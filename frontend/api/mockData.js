// Generar codigo sala aleatorio
function generarCodigoSala(longitud = 6) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

var mockDB = {
  questions: {
    201: {
      text: "¿Quién dirigió la película 'Titanic' de 1997?",
      options: [
        { optionId: "a", text: "Steven Spielberg" },
        { optionId: "b", text: "Martin Scorsese" },
        { optionId: "c", text: "James Cameron" },
        { optionId: "d", text: "Christopher Nolan" }
      ],
      correctOptionId: "c",
      timeLimit: 10
    },
    202: {
      text: "¿Cuál es el nombre del personaje interpretado por Keanu Reeves en 'The Matrix'?",
      options: [
        { optionId: "a", text: "Neo" },
        { optionId: "b", text: "Morpheus" },
        { optionId: "c", text: "Trinity" },
        { optionId: "d", text: "Agent Smith" }
      ],
      correctOptionId: "a",
      timeLimit: 8
    },
    203: {
      text: "¿Qué película ganó el Oscar a Mejor Película en 2020?",
      options: [
        { optionId: "a", text: "1917" },
        { optionId: "b", text: "Joker" },
        { optionId: "c", text: "Parasite" },
        { optionId: "d", text: "Once Upon a Time in Hollywood" }
      ],
      correctOptionId: "c",
      timeLimit: 12
    },
    204: {
      text: "¿Qué actor interpreta a Iron Man en el Universo Cinematográfico de Marvel?",
      options: [
        { optionId: "a", text: "Chris Evans" },
        { optionId: "b", text: "Robert Downey Jr." },
        { optionId: "c", text: "Chris Hemsworth" },
        { optionId: "d", text: "Mark Ruffalo" }
      ],
      correctOptionId: "b",
      timeLimit: 5
    },
    205: {
      text: "¿En qué película animada aparece el personaje 'Woody'?",
      options: [
        { optionId: "a", text: "Cars" },
        { optionId: "b", text: "Toy Story" },
        { optionId: "c", text: "Shrek" },
        { optionId: "d", text: "Frozen" }
      ],
      correctOptionId: "b",
      timeLimit: 10
    },
  206: {
      text: "¿En qué película aparece el personaje 'Forrest Gump'?",
      options: [
        { optionId: "a", text: "The Green Mile" },
        { optionId: "b", text: "Forrest Gump" },
        { optionId: "c", text: "Cast Away" },
        { optionId: "d", text: "Saving Private Ryan" }
      ],
      correctOptionId: "b",
      timeLimit: 10
    },
    207: {
      text: "¿Cuál es el nombre del hobbit que lleva el anillo en 'El Señor de los Anillos'?",
      options: [
        { optionId: "a", text: "Bilbo" },
        { optionId: "b", text: "Sam" },
        { optionId: "c", text: "Frodo" },
        { optionId: "d", text: "Pippin" }
      ],
      correctOptionId: "c",
      timeLimit: 10
    },
    208: {
      text: "¿Quién interpreta al Joker en 'The Dark Knight' (2008)?",
      options: [
        { optionId: "a", text: "Joaquin Phoenix" },
        { optionId: "b", text: "Jack Nicholson" },
        { optionId: "c", text: "Heath Ledger" },
        { optionId: "d", text: "Jared Leto" }
      ],
      correctOptionId: "c",
      timeLimit: 8
    },
    209: {
      text: "¿Qué director es conocido por películas como 'Pulp Fiction' y 'Kill Bill'?",
      options: [
        { optionId: "a", text: "Quentin Tarantino" },
        { optionId: "b", text: "Guy Ritchie" },
        { optionId: "c", text: "Martin Scorsese" },
        { optionId: "d", text: "Tim Burton" }
      ],
      correctOptionId: "a",
      timeLimit: 10
    },
    210: {
      text: "¿En qué película se escucha la frase: 'Yo soy tu padre'?",
      options: [
        { optionId: "a", text: "Star Wars: Episodio IV" },
        { optionId: "b", text: "Star Wars: Episodio V" },
        { optionId: "c", text: "Star Wars: Episodio VI" },
        { optionId: "d", text: "Rogue One" }
      ],
      correctOptionId: "b",
      timeLimit: 9
    },
    211: {
      text: "¿Qué actriz protagoniza 'La La Land' junto a Ryan Gosling?",
      options: [
        { optionId: "a", text: "Emma Stone" },
        { optionId: "b", text: "Jennifer Lawrence" },
        { optionId: "c", text: "Scarlett Johansson" },
        { optionId: "d", text: "Natalie Portman" }
      ],
      correctOptionId: "a",
      timeLimit: 7
    },
    212: {
      text: "¿Cuál es el nombre del villano en 'Avengers: Infinity War'?",
      options: [
        { optionId: "a", text: "Loki" },
        { optionId: "b", text: "Thanos" },
        { optionId: "c", text: "Ultron" },
        { optionId: "d", text: "Red Skull" }
      ],
      correctOptionId: "b",
      timeLimit: 6
    },
    213: {
      text: "¿Qué película de animación trata sobre emociones dentro de la mente de una niña?",
      options: [
        { optionId: "a", text: "Coco" },
        { optionId: "b", text: "Up" },
        { optionId: "c", text: "Inside Out" },
        { optionId: "d", text: "Soul" }
      ],
      correctOptionId: "c",
      timeLimit: 10
    },
    214: {
      text: "¿Qué película cuenta la historia de una inteligencia artificial llamada HAL 9000?",
      options: [
        { optionId: "a", text: "Ex Machina" },
        { optionId: "b", text: "Blade Runner" },
        { optionId: "c", text: "2001: A Space Odyssey" },
        { optionId: "d", text: "Her" }
      ],
      correctOptionId: "c",
      timeLimit: 12
    },
    215: {
      text: "¿Qué película dirigida por Bong Joon-ho trata sobre la desigualdad social?",
      options: [
        { optionId: "a", text: "Memories of Murder" },
        { optionId: "b", text: "Snowpiercer" },
        { optionId: "c", text: "Parasite" },
        { optionId: "d", text: "Okja" }
      ],
      correctOptionId: "c",
      timeLimit: 11
    },
  },

  rooms: {
    ABCD: {
      roomId: generarCodigoSala(),
      host: { userId: 1, username: "Anfitrión" },
      players: [
        { userId: 1, username: "Anfitrión", score: 0 }
      ],
      questionIds: [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215],
      currentQuestionIndex: 0,
      gameStarted: false
    }
  }
};

  function fetchMock(endpoint, payload) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        var res, room, qId, question, player;
        switch (endpoint) {
  
          case "/api/createRoom":
            const roomId = generarCodigoSala();
              const questionIds = Object.keys(mockDB.questions).map(Number); // genera un array de IDs de preguntas
            room = {
              roomId: roomId,
              host: { userId: payload.userId, username: payload.username },
              players: [ { userId: payload.userId, username: payload.username, score: 0 } ],
              questionIds: questionIds,
              currentQuestionIndex: 0,
              gameStarted: false
            };
            mockDB.rooms[roomId] = room;
            res = { roomId: roomId, host: room.host };
            break;
  
  
          case "/api/roomStatus":
            room = mockDB.rooms[payload.roomId];
            if (!room) {
              res = { success: false, message: "Sala no existe" };
            } else {
              res = { success: true, players: room.players, gameStarted: room.gameStarted };
            }
            break;
  
          case "/api/startGame":
            room = mockDB.rooms[payload.roomId];
            room.gameStarted = true;
            res = { success: true };
            break;
  
          case "/api/nextQuestion":
            room = mockDB.rooms[payload.roomId];
            if (room.currentQuestionIndex >= room.questionIds.length) {
              res = { finished: true };
            } else {
              qId = room.questionIds[room.currentQuestionIndex];
              question = mockDB.questions[qId];
              // devolvemos text, options, correctOptionId, timeLimit y questionId
              res = Object.assign({ finished: false, questionId: qId }, question);
            }
            break;
  
          case "/api/submitAnswer":
            room = mockDB.rooms[payload.roomId];
            if (room.currentQuestionIndex >= room.questionIds.length) {
              res = { finished: true, correct: false, players: room.players };
              break;
            }
            qId = room.questionIds[room.currentQuestionIndex];
            question = mockDB.questions[qId];
            var correct = payload.optionId === question.correctOptionId;
            player = room.players.find(function(p) { return p.userId === payload.userId; });
            if (correct) {
              // puntos = timeLimit - tiempo empleado
              var tiempoPregunta = payload.tiempoPregunta || question.timeLimit;
              var pts = Math.max(0, tiempoPregunta - (payload.elapsedSec || 0));
              player.score += pts;
            }
            // Avanzamos al siguiente índice
            room.currentQuestionIndex++;
            res = { correct: correct, players: room.players };
            break;
  
          case "/api/scoreboard":
            room = mockDB.rooms[payload.roomId];
            res = { players: room ? room.players : [] };
            break;
  
          default:
            res = { error: "endpoint desconocido" };
        }
        resolve(res);
      }, 300 + Math.random() * 200);
    });
  }