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