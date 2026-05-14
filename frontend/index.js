let usuarioActual = {};
let salaActualId = null;
let preguntaActualId = null;
let temporizadorActual = null;
let preguntaActual = null;
let configuracionJuego = {
  rondas: 3,
  tiempoPregunta: 10
};
let rondaActual = 1;
const equiposDisponibles = ["Rojo", "Azul", "Verde", "Amarillo"];
let equiposJugadores = {};
const coloresEquipos = {
  Rojo: "#e53935",
  Azul: "#1e88e5",
  Verde: "#43a047",
  Amarillo: "#ffd600"
};


// Crear una sala nueva
function crearSala() {
  const nombreUsuario = document.getElementById("username").value;
  if (!nombreUsuario) return alert("Introduce un nombre de usuario");

  const usuarioId = Date.now();
  usuarioActual = { usuarioId, nombreUsuario };

  fetchMock("/api/createRoom", { userId: usuarioId, username: nombreUsuario }).then(res => {
    salaActualId = res.roomId;
    document.getElementById("room-title").textContent = `Sala: ${salaActualId}`;
    refrescarLobby();
    setTimeout(mostrarLobby, 120);

  });
}

// Unirse a una sala existente
function unirseSala() {
  const nombreUsuario = document.getElementById("username").value;
  const salaId = document.getElementById("room-code").value;
  if (!nombreUsuario || !salaId) return alert("Faltan datos");

  const usuarioId = Date.now();
  usuarioActual = { usuarioId, nombreUsuario };

  fetchMock("/api/joinRoom", { username: nombreUsuario, roomId: salaId }).then(res => {
    if (!res.success) return alert(res.message);
    salaActualId = res.roomId;
    document.getElementById("room-title").textContent = `Sala: ${salaActualId}`;
    refrescarLobby();
    setTimeout(mostrarLobby, 120);
  });
}

// Detecta si eres el anfitrión (el primer jugador de la sala)
function esAnfitrion() {
  // Si tienes el usuario actual y la sala, y eres el primero
  const lista = document.getElementById("player-list");
  if (!lista || lista.children.length === 0) return false;
  const primerNombre = lista.children[0].textContent;
  return usuarioActual && usuarioActual.nombreUsuario === primerNombre;
}

// Actualiza la lista de jugadores en el lobby
function refrescarLobby() {
  fetchMock("/api/roomStatus", { roomId: salaActualId }).then(res => {
    if (res.success) {
      const listaJugadores = document.getElementById("player-list");
      listaJugadores.innerHTML = "";
      res.players.forEach(jugador => {
        const li = document.createElement("li");
        li.textContent = jugador.username;
        listaJugadores.appendChild(li);
      });
      mostrarEquiposLobby(res.players);
    }
  });
}

// Muestra la pantalla del lobby
function mostrarLobby() {
  document.getElementById("create-join-room").classList.add("hidden");
  document.getElementById("lobby").classList.remove("hidden");
  refrescarLobby();

  // Si eres el anfitrión, muestra la configuración
  setTimeout(() => {
    if (esAnfitrion()) {
      document.getElementById("configuracion-juego").classList.remove("hidden");
      document.getElementById("num-rondas").value = configuracionJuego.rondas;
      document.getElementById("tiempo-pregunta").value = configuracionJuego.tiempoPregunta;
    } else {
      document.getElementById("configuracion-juego").classList.add("hidden");
    }
  }, 200);
}

//Muestra selección de equipo en el lobby
function mostrarEquiposLobby(jugadores) {
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
    if (esAnfitrion() || jugador.username === usuarioActual.nombreUsuario) {
      const select = document.createElement("select");
      equiposDisponibles.forEach(eq => {
        const opt = document.createElement("option");
        opt.value = eq;
        opt.textContent = eq;
        if ((equiposJugadores[jugador.username] || equiposDisponibles[0]) === eq) opt.selected = true;
        select.appendChild(opt);
      });
      select.onchange = () => {
        equiposJugadores[jugador.username] = select.value;
        mostrarEquiposLobby(jugadores); // refresca para mostrar cambios
      };
      div.appendChild(select);
    } else {
      // Solo muestra el equipo
      const eq = equiposJugadores[jugador.username] || equiposDisponibles[0];
      div.innerHTML += `<span style="color:#ffd700;font-weight:600;">${eq}</span>`;
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

// Empieza la partida
function empezarPartida() {
  rondaActual = 1;

  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("create-join-room").classList.add("hidden");
  document.getElementById("configuracion-juego").classList.add("hidden");


  fetchMock("/api/startGame", {
    roomId: salaActualId,
    rondas: configuracionJuego.rondas,
    tiempoPregunta: configuracionJuego.tiempoPregunta
  }).then(() => {
    cargarSiguientePregunta();
  });
}

// Carga la siguiente pregunta
function cargarSiguientePregunta() {
  document.getElementById("game").classList.add("hidden");

  // Si ya hemos llegado al máximo de rondas, termina la partida
  if (rondaActual > configuracionJuego.rondas) {
    mostrarClasificacion(true);
    return;
  }

  fetchMock("/api/nextQuestion", { roomId: salaActualId }).then(res => {
    if (res.finished) {
      mostrarClasificacion(true);
    } else {
      preguntaActualId = res.questionId;
      preguntaActual = res;
      document.getElementById("question-text").textContent = res.text;
      const opcionesDiv = document.getElementById("options");
      opcionesDiv.innerHTML = "";

      res.options.forEach(opcion => {
        const btn = document.createElement("button");
        btn.textContent = opcion.text;
        btn.onclick = () => enviarRespuesta(opcion.optionId, configuracionJuego.tiempoPregunta); opcionesDiv.appendChild(btn);
      });

      iniciarTemporizador(configuracionJuego.tiempoPregunta);

      document.getElementById("game").classList.remove("hidden");
    }
  });
}

// Inicia el temporizador para responder la pregunta
function iniciarTemporizador(segundos) {
  const timerEl = document.getElementById("timer");
  let restante = segundos;
  timerEl.textContent = `Tiempo restante: ${restante}s`;

  clearInterval(temporizadorActual);
  temporizadorActual = setInterval(() => {
    restante--;
    timerEl.textContent = `Tiempo restante: ${restante}s`;
    if (restante <= 0) {
      clearInterval(temporizadorActual);
      enviarRespuesta(null, segundos); // No respondió
    }
  }, 1000);
}

// Envía la respuesta del usuario
function enviarRespuesta(opcionId, tiempoLimite) {
  clearInterval(temporizadorActual);
  const segundosTranscurridos = tiempoLimite - parseInt(document.getElementById("timer").textContent.split(": ")[1]);
  fetchMock("/api/submitAnswer", {
    roomId: salaActualId,
    userId: usuarioActual.usuarioId,
    optionId: opcionId,
    elapsedSec: segundosTranscurridos,
    tiempoPregunta: configuracionJuego.tiempoPregunta,
  }).then(res => {
    const opcionesDiv = document.getElementById("options");
    const botones = opcionesDiv.querySelectorAll("button");
    botones.forEach(btn => {
      const opcion = preguntaActual.options.find(o => o.text === btn.textContent);      // Busca la opción correcta
      if (opcion.optionId === preguntaActual.correctOptionId) {
        btn.classList.add("opcion-correcta");
      } else if (opcion.optionId === opcionId) {
        btn.classList.add("opcion-incorrecta");
      }
      btn.disabled = true;
    });

    setTimeout(() => {
      document.getElementById("game").classList.add("hidden");
      document.getElementById("result").classList.remove("hidden");
      document.getElementById("result-text").textContent = res.correct
        ? "✅ ¡Correcto!"
        : "❌ ¡Incorrecto!";
    }, 1200);
  });
}

// Muestra la clasificación
function mostrarClasificacion(fin = false) {
  fetchMock("/api/scoreboard", { roomId: salaActualId }).then(res => {
    const lista = document.getElementById("score-list");
    lista.innerHTML = "";

    // Agrupa por equipo
    const equipos = {};
    res.players.forEach(jugador => {
      const eq = equiposJugadores[jugador.username] || equiposDisponibles[0];
      if (!equipos[eq]) equipos[eq] = [];
      equipos[eq].push(jugador);
    });

    // Suma puntos por equipo
    const equiposPuntos = Object.entries(equipos).map(([nombre, jugadores]) => ({
      nombre,
      puntos: jugadores.reduce((acc, j) => acc + j.score, 0),
      jugadores
    })).sort((a, b) => b.puntos - a.puntos);

    // Muestra equipos y jugadores
    equiposPuntos.forEach(equipo => {
      const liEquipo = document.createElement("li");
      liEquipo.textContent = `Equipo ${equipo.nombre}: ${equipo.puntos} pts`;
      liEquipo.style.fontWeight = "bold";
      liEquipo.style.color = coloresEquipos[equipo.nombre] || "#ffd700";
      lista.appendChild(liEquipo);
      equipo.jugadores
        .sort((a, b) => b.score - a.score)
        .forEach(jugador => {
          const li = document.createElement("li");
          li.textContent = `- ${jugador.username}: ${jugador.score} pts`;
          li.style.marginLeft = "18px";
          lista.appendChild(li);
        });
    });

    document.getElementById("result").classList.add("hidden");
    document.getElementById("scoreboard").classList.remove("hidden");

    if (fin) {
      let h2 = document.querySelector("#scoreboard h2");
      h2.textContent = "¡Partida finalizada!";
      document.getElementById("game").classList.add("hidden");
      return;
    }

    setTimeout(() => {
      rondaActual++;
      document.getElementById("scoreboard").classList.add("hidden");
      document.getElementById("game").classList.remove("hidden");
      cargarSiguientePregunta();
    }, 3000);
  });
}

function volverAlInicio() {
  // Resetea variables globales
  usuarioActual = {};
  salaActualId = null;
  preguntaActualId = null;
  clearInterval(temporizadorActual);

  // Limpia campos de texto si es necesario
  document.getElementById("username").value = "";
  if (document.getElementById("room-code")) document.getElementById("room-code").value = "";

  // Oculta todas las pantallas
  document.getElementById("lobby").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("scoreboard").classList.add("hidden");
  document.querySelector("#scoreboard h2").textContent = "Clasificación";

  // Muestra la pantalla inicial
  document.getElementById("create-join-room").classList.remove("hidden");
}