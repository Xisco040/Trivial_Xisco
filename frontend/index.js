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