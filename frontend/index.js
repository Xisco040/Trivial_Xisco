const API_URL = "https://triviaapi.artemrudenko.com";

// Estado de la sesión
let token = null;
let jugadorActualId = null;
let salaActualId = null;
let salaActual = null;
let eventosSala = null;

// Estado de la partida
let juegoActual = null;
let rondas = [];
let indiceRonda = 0;
let rondaActual = null;
let preguntaActual = null;
let respuestaEnviada = null;
let respuestasRonda = 0;
let puntuaciones = {};
let enPartida = false;
let clasificacionMostrada = false;
let desfaseReloj = 0; 
let temporizadorActual = null;

// Estado del lobby
let jugadores = [];
let equipos = [];
let configuracionJuego = {
  rondas: 3,
  tiempoPregunta: 10
};

const nombresEquipos = ["Rojo", "Azul", "Verde", "Amarillo"];
const coloresEquipos = {
  Rojo: "#e53935",
  Azul: "#1e88e5",
  Verde: "#43a047",
  Amarillo: "#ffd600"
};

// Llama a la API REST (conecta frontend y backend) 
async function api(ruta, opciones = {}) {
  const cabeceras = { ...(opciones.headers || {}) };
  if (token) cabeceras["Authorization"] = `Bearer ${token}`;
  if (opciones.body) cabeceras["Content-Type"] = "application/json";
  const res = await fetch(API_URL + ruta, { ...opciones, headers: cabeceras });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Reintenta una llamada por si algo falla
async function reintentar(fn, intentos = 8, espera = 500) {
  let error;
  for (let i = 0; i < intentos; i++) {
    try {
      return await fn();
    } catch (e) {
      error = e;
      await esperar(espera);
    }
  }
  throw error;
}
// Sincorniza la hora
function ahoraServidor() {
  return Date.now() + desfaseReloj;
}
// Detecta si eres el anfitrión (el primer jugador de la sala)
function esAnfitrion() {
  return salaActual != null && salaActual.hostId === jugadorActualId;
}

// El nombre de cada equipo se deriva de su orden de creación (id ascendente)
function nombreEquipo(teamId) {
  const indice = equipos.findIndex(e => e.id === teamId);
  return indice >= 0 ? nombresEquipos[indice % nombresEquipos.length] : "Sin equipo";
}

function esRespuestaCorrecta(respuesta, correctas) {
  if (respuesta == null) return false;
  return correctas.some(c => c.trim().toLowerCase() === respuesta.trim().toLowerCase());
}

// Crear una sala nueva
async function crearSala() {
  const nombreUsuario = document.getElementById("username").value.trim();
  if (!nombreUsuario) return alert("Introduce un nombre de usuario");

  try {
    const sala = await api("/rooms", { method: "POST" });
    await entrarEnSala(sala.id, nombreUsuario, null);

    // El anfitrión crea los equipos de la sala
    for (let i = 0; i < nombresEquipos.length; i++) {
      await api(`/teams?roomId=${salaActualId}`, { method: "POST" });
    }
    await asignarmeAlPrimerEquipo();
    await mostrarLobby();
  } catch (e) {
    alert("No se pudo crear la sala: " + e.message);
  }
}

// Unirse a una sala existente
async function unirseSala() {
  const nombreUsuario = document.getElementById("username").value.trim();
  if (!nombreUsuario) return alert("Introduce un nombre de usuario");

  const roomId = parseInt(document.getElementById("join-room-id").value);
  if (!roomId) return alert("Introduce el ID de la sala");

  try {
    await entrarEnSala(roomId, nombreUsuario, null);
    await asignarmeAlPrimerEquipo();
    await mostrarLobby();
  } catch (e) {
    alert("No se pudo entrar en la sala: ");
  }
}

// Se registra como jugador en la sala
async function entrarEnSala(roomId, nombreUsuario, code) {
  let ruta = `/players?roomId=${roomId}&username=${encodeURIComponent(nombreUsuario)}`;
  if (code) ruta += `&code=${encodeURIComponent(code)}`;
  const res = await api(ruta, { method: "POST" });

  token = res.token;
  jugadorActualId = parseInt(JSON.parse(atob(token.split(".")[1])).sub);
  salaActualId = roomId;

  conectarEventosSala();
}

// Por defecto todo el mundo entra en el primer equipo
async function asignarmeAlPrimerEquipo() {
  equipos = (await api(`/teams?roomId=${salaActualId}`)).sort((a, b) => a.id - b.id);
  if (equipos.length === 0) return;
  try {
    await api(`/teams/${equipos[0].id}/players/${jugadorActualId}`, { method: "PUT" });
  } catch (e) {
    // Si hay partida en curso no se puede entrar en un equipo: queda como espectador
  }
}

// Sincronización multijugador
function conectarEventosSala() {
  if (eventosSala) eventosSala.close();
  eventosSala = new EventSource(`${API_URL}/rooms/${salaActualId}/events`);

  const eventosLobby = [
    "player-joined",
    "player-left",
    "team-created",
    "team-deleted",
    "player-assigned-to-team",
    "player-removed-from-team"
  ];
  eventosLobby.forEach(evento => {
    eventosSala.addEventListener(evento, () => {
      if (!enPartida) refrescarLobby();
    });
  });

  // El anfitrión crea la partida y todos la empiezan a la vez con este evento
  eventosSala.addEventListener("game-created", async () => {
    if (enPartida) return;
    salaActual = await api(`/rooms/${salaActualId}`);
    if (salaActual.gameId) iniciarJuego(salaActual.gameId, true);
  });

  // Muestra cuántos jugadores han respondido ya la pregunta actual
  eventosSala.addEventListener("player-submitted-answer", () => {
    if (!enPartida) return;
    respuestasRonda++;
    const info = document.getElementById("respuestas-info");
    if (info) info.textContent = `${respuestasRonda} respuesta(s) enviada(s)`;
  });

  eventosSala.addEventListener("room-deleted", () => {
    alert("La sala ha sido eliminada");
    volverAlInicio();
  });
}

// Muestra la pantalla del lobby
async function mostrarLobby() {
  document.getElementById("create-join-room").classList.add("hidden");
  document.getElementById("lobby").classList.remove("hidden");
  document.getElementById("room-title").textContent = `Sala: ${salaActualId}`;
  document.getElementById("num-rondas").value = configuracionJuego.rondas;
  document.getElementById("tiempo-pregunta").value = configuracionJuego.tiempoPregunta;

  await refrescarLobby();

  // Si ya hay una partida en curso entramos en ella
  if (salaActual && salaActual.gameId) {
    const juego = await api(`/games/${salaActual.gameId}`);
    if (Date.parse(juego.endedAt) > ahoraServidor()) iniciarJuego(juego.id, false);
  }
}

// Actualiza la lista de jugadores y equipos en el lobby
async function refrescarLobby() {
  if (!salaActualId) return;
  try {
    [salaActual, jugadores, equipos] = await Promise.all([
      api(`/rooms/${salaActualId}`),
      api(`/players?roomId=${salaActualId}`),
      api(`/teams?roomId=${salaActualId}`)
    ]);
  } catch (e) {
    console.error("Error al refrescar el lobby:", e.message);
    return;
  }
  equipos.sort((a, b) => a.id - b.id);

  const listaJugadores = document.getElementById("player-list");
  listaJugadores.innerHTML = "";
  jugadores.forEach(jugador => {
    const li = document.createElement("li");
    li.textContent = jugador.username + (jugador.id === salaActual.hostId ? " 👑" : "");
    listaJugadores.appendChild(li);
  });

  mostrarEquiposLobby();

  // Solo el anfitrión puede configurar y empezar la partida
  document.getElementById("start-button").style.display = esAnfitrion() ? "" : "none";
  document.getElementById("configuracion-juego").classList.toggle("hidden", !esAnfitrion());
}

//Muestra selección de equipo en el lobby
function mostrarEquiposLobby() {
  const cont = document.getElementById("equipos-lobby");
  cont.innerHTML = "";
  jugadores.forEach(jugador => {
    const div = document.createElement("div");
    div.style.marginBottom = "6px";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "8px";
    div.innerHTML = `<span style="min-width:90px">${jugador.username}</span>`;

    // Solo el anfitrión o el propio jugador puede cambiar su equipo
    if (esAnfitrion() || jugador.id === jugadorActualId) {
      const select = document.createElement("select");
      equipos.forEach((equipo, i) => {
        const opt = document.createElement("option");
        opt.value = equipo.id;
        opt.textContent = nombresEquipos[i % nombresEquipos.length];
        if (jugador.teamId === equipo.id) opt.selected = true;
        select.appendChild(opt);
      });
      select.onchange = async () => {
        try {
          await api(`/teams/${select.value}/players/${jugador.id}`, { method: "PUT" });
        } catch (e) {
          alert("No se pudo cambiar el equipo: " + e.message);
        }
        refrescarLobby();
      };
      div.appendChild(select);
    } else {
      const nombre = nombreEquipo(jugador.teamId);
      div.innerHTML += `<span style="color:${coloresEquipos[nombre] || "#ffd700"};font-weight:600;">${nombre}</span>`;
    }
    cont.appendChild(div);
  });
}

// Guarda la configuración cuando el anfitrión la cambia
document.getElementById("num-rondas").addEventListener("change", function () {
  configuracionJuego.rondas = parseInt(this.value);
});
document.getElementById("tiempo-pregunta").addEventListener("change", function () {
  configuracionJuego.tiempoPregunta = parseInt(this.value);
});

// Segundos extra por ronda para mostrar el resultado y la clasificación
const SEGUNDOS_REVELACION = 5;

// Empieza la partida
async function empezarPartida() {
  try {
    await api(
      `/games?roomId=${salaActualId}` +
      `&rounds=${configuracionJuego.rondas}` +
      `&timePerRound=${configuracionJuego.tiempoPregunta + SEGUNDOS_REVELACION}` +
      `&questionsPerRound=1`,
      { method: "POST" }
    );
  } catch (e) {
    alert("No se pudo empezar la partida: " + e.message);
  }
}

// Carga la partida y empieza a jugar las rondas
async function iniciarJuego(gameId, recienCreada) {
  if (enPartida) return;
  enPartida = true;

  juegoActual = await api(`/games/${gameId}`);
  if (recienCreada) desfaseReloj = Date.parse(juegoActual.createdAt) - Date.now();

  rondas = (await api(`/rounds?gameId=${gameId}`))
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  indiceRonda = 0;
  puntuaciones = {};

  // Si nos unimos a mitad de partida, saltamos las rondas ya terminadas
  while (indiceRonda < rondas.length && Date.parse(rondas[indiceRonda].endedAt) <= ahoraServidor()) {
    indiceRonda++;
  }

  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("configuracion-juego").classList.add("hidden");
  document.querySelector("#scoreboard h2").textContent = "Clasificación";

  jugarRonda();
}

// Juega la ronda actual: espera a que empiece, pide la pregunta y arranca el temporizador
async function jugarRonda() {
  clasificacionMostrada = false;
  if (indiceRonda >= rondas.length) {
    mostrarClasificacion(true);
    return;
  }
  rondaActual = rondas[indiceRonda];

  document.getElementById("scoreboard").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");

  // Espera a que el servidor dé comienzo a la ronda
  const espera = Date.parse(rondaActual.createdAt) - ahoraServidor();
  if (espera > 0) await esperar(espera + 200);

  let preguntas;
  try {
    preguntas = await reintentar(() => api(`/questions?roundId=${rondaActual.id}`));
  } catch (e) {
    alert("No se pudo cargar la pregunta: " + e.message);
    return;
  }

  preguntaActual = preguntas[0];
  respuestaEnviada = null;
  respuestasRonda = 0;
  mostrarPregunta(preguntaActual);
  iniciarTemporizador(rondaActual);
}

// Carga la siguiente pregunta
function mostrarPregunta(pregunta) {
  document.getElementById("question-text").textContent = pregunta.question;
  const opcionesDiv = document.getElementById("options");
  opcionesDiv.innerHTML = "";

  const info = document.getElementById("respuestas-info");
  if (info) info.textContent = "";

  if (pregunta.type === "open_ended" || !(pregunta.options || []).length) {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "open-answer";
    input.placeholder = "Escribe tu respuesta...";
    const btn = document.createElement("button");
    btn.textContent = "Enviar";
    btn.onclick = () => enviarRespuesta(input.value.trim());
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") btn.click();
    });
    opcionesDiv.appendChild(input);
    opcionesDiv.appendChild(btn);
    input.focus();
  } else {
    pregunta.options.forEach(opcion => {
      const btn = document.createElement("button");
      btn.textContent = opcion;
      btn.onclick = () => enviarRespuesta(opcion);
      opcionesDiv.appendChild(btn);
    });
  }

  document.getElementById("game").classList.remove("hidden");
}

// Inicia el temporizador para responder la pregunta
function iniciarTemporizador(ronda) {
  const timerEl = document.getElementById("timer");
  const fin = Date.parse(ronda.endedAt);

  clearInterval(temporizadorActual);
  const tic = () => {
    const restante = Math.max(0, Math.ceil((fin - ahoraServidor()) / 1000));
    timerEl.textContent = `Tiempo restante: ${restante}s`;
    if (restante <= 0) {
      clearInterval(temporizadorActual);
      finalizarRonda();
    }
  };
  tic();
  temporizadorActual = setInterval(tic, 250);
}

// Envía la respuesta del usuario
async function enviarRespuesta(respuesta) {
  if (!respuesta || respuestaEnviada != null) return;
  respuestaEnviada = respuesta;

  document.querySelectorAll("#options button, #options input").forEach(el => {
    el.disabled = true;
  });

  try {
    await api(`/answers?roundId=${rondaActual.id}&questionId=${preguntaActual.id}`, {
      method: "POST",
      body: JSON.stringify({ answer: respuesta })
    });
  } catch (e) {
    console.error("Error al enviar la respuesta:", e.message);
  }
}

// Finaliza la ronda
async function finalizarRonda() {
  document.getElementById("timer").textContent = "¡Tiempo!";
  await esperar(800); 

  let preguntas = await reintentar(() => api(`/questions?roundId=${rondaActual.id}`));
  for (let i = 0; i < 5 && !(preguntas[0].correctAnswers || []).length; i++) {
    await esperar(400);
    preguntas = await api(`/questions?roundId=${rondaActual.id}`);
  }
  const correctas = preguntas[0].correctAnswers || [];

  let respuestas = [];
  try {
    respuestas = await reintentar(() => api(`/answers?roundId=${rondaActual.id}&questionId=${preguntaActual.id}`));
  } catch (e) {
    console.error("Error al obtener las respuestas:", e.message);
  }
  const finRonda = Date.parse(rondaActual.endedAt);
  respuestas.forEach(r => {
    if (esRespuestaCorrecta(r.answer, correctas)) {
      const restante = Math.max(0, Math.round((finRonda - Date.parse(r.createdAt)) / 1000));
      puntuaciones[r.playerId] = (puntuaciones[r.playerId] || 0) + restante;
    }
  });

  marcarOpciones(correctas);
  const acerto = esRespuestaCorrecta(respuestaEnviada, correctas);
  indiceRonda++;

  setTimeout(() => {
    document.getElementById("game").classList.add("hidden");
    document.getElementById("result").classList.remove("hidden");
    document.getElementById("result-text").textContent = acerto
      ? "✅ ¡Correcto!"
      : "❌ ¡Incorrecto!";
    setTimeout(() => mostrarClasificacion(indiceRonda >= rondas.length), 1300);
  }, 1000);
}

// Marca si es correecto o incorrecto
function marcarOpciones(correctas) {
  document.querySelectorAll("#options button").forEach(btn => {
    btn.disabled = true;
    if (esRespuestaCorrecta(btn.textContent, correctas)) {
      btn.classList.add("opcion-correcta");
    } else if (btn.textContent === respuestaEnviada) {
      btn.classList.add("opcion-incorrecta");
    }
  });

  const input = document.getElementById("open-answer");
  if (input && correctas.length) {
    const p = document.createElement("p");
    p.textContent = `Respuesta correcta: ${correctas[0]}`;
    document.getElementById("options").appendChild(p);
  }
}

// Muestra la clasificación por equipos y jugadores
async function mostrarClasificacion(fin = false) {
  if (clasificacionMostrada) return;
  clasificacionMostrada = true;
  fin = fin || indiceRonda >= rondas.length;

  try {
    jugadores = await api(`/players?roomId=${salaActualId}`);
  } catch (e) {
    console.error("Error al cargar los jugadores:", e.message);
  }

  const lista = document.getElementById("score-list");
  lista.innerHTML = "";

  // Agrupa por equipo y suma los puntos
  const porEquipo = {};
  jugadores.forEach(jugador => {
    const clave = jugador.teamId != null ? jugador.teamId : "sin";
    if (!porEquipo[clave]) porEquipo[clave] = [];
    porEquipo[clave].push(jugador);
  });

  const equiposPuntos = Object.entries(porEquipo).map(([clave, miembros]) => ({
    nombre: clave === "sin" ? "Sin equipo" : nombreEquipo(parseInt(clave)),
    puntos: miembros.reduce((acc, j) => acc + (puntuaciones[j.id] || 0), 0),
    jugadores: miembros
  })).sort((a, b) => b.puntos - a.puntos);

  equiposPuntos.forEach(equipo => {
    const liEquipo = document.createElement("li");
    liEquipo.textContent = `Equipo ${equipo.nombre}: ${equipo.puntos} pts`;
    liEquipo.style.fontWeight = "bold";
    liEquipo.style.color = coloresEquipos[equipo.nombre] || "#ffd700";
    lista.appendChild(liEquipo);
    equipo.jugadores
      .sort((a, b) => (puntuaciones[b.id] || 0) - (puntuaciones[a.id] || 0))
      .forEach(jugador => {
        const li = document.createElement("li");
        li.textContent = `- ${jugador.username}: ${puntuaciones[jugador.id] || 0} pts`;
        li.style.marginLeft = "18px";
        lista.appendChild(li);
      });
  });

  document.getElementById("result").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("scoreboard").classList.remove("hidden");

  if (fin) {
    document.querySelector("#scoreboard h2").textContent = "¡Partida finalizada!";
    enPartida = false;
    return;
  }

  setTimeout(() => {
    document.getElementById("scoreboard").classList.add("hidden");
    jugarRonda();
  }, 1500);
}

// Vuelve al inicio
async function volverAlInicio() {
  clearInterval(temporizadorActual);
  if (eventosSala) {
    eventosSala.close();
    eventosSala = null;
  }

  // Abandona la sala; si somos el último jugador borramos la sala entera
  if (token && jugadorActualId && salaActualId) {
    try {
      const [sala, jugadoresSala] = await Promise.all([
        api(`/rooms/${salaActualId}`),
        api(`/players?roomId=${salaActualId}`)
      ]);
      const soyElUltimo = jugadoresSala.length === 1 && jugadoresSala[0].id === jugadorActualId;
      if (soyElUltimo && sala.gameId == null) {
        await api(`/rooms/${salaActualId}`, { method: "DELETE" });
      } else {
        await api(`/players/${jugadorActualId}`, { method: "DELETE" });
      }
    } catch (e) {

    }
  }

  // Resetea el estado
  token = null;
  jugadorActualId = null;
  salaActualId = null;
  salaActual = null;
  juegoActual = null;
  rondas = [];
  indiceRonda = 0;
  rondaActual = null;
  preguntaActual = null;
  respuestaEnviada = null;
  puntuaciones = {};
  jugadores = [];
  equipos = [];
  enPartida = false;
  desfaseReloj = 0;
  history.replaceState(null, "", location.pathname);

  document.getElementById("username").value = "";

  // Oculta todas las pantallas
  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("scoreboard").classList.add("hidden");
  document.getElementById("configuracion-juego").classList.add("hidden");
  document.querySelector("#scoreboard h2").textContent = "Clasificación";

  // Muestra la pantalla inicial
  document.getElementById("create-join-room").classList.remove("hidden");
}

// Si llegamos con una URL compartida (?room=ID), rellena el campo de unirse
const salaCompartida = new URLSearchParams(location.search).get("room");
if (salaCompartida) document.getElementById("join-room-id").value = salaCompartida;
