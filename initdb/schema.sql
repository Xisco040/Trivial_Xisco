DROP TABLE IF EXISTS respuestas_usuario CASCADE;
DROP TABLE IF EXISTS opciones_respuesta CASCADE;
DROP TABLE IF EXISTS ronda_preguntas CASCADE;
DROP TABLE IF EXISTS preguntas CASCADE;
DROP TABLE IF EXISTS rondas CASCADE;
DROP TABLE IF EXISTS partidas CASCADE;
DROP TABLE IF EXISTS sala_usuarios CASCADE;
DROP TABLE IF EXISTS equipos CASCADE;
DROP TABLE IF EXISTS salas CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS puntuaciones CASCADE;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL
);

CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    url_unica VARCHAR(32) NOT NULL UNIQUE,
    anfitrion_id INTEGER REFERENCES usuarios(id),
    rondas INTEGER DEFAULT 5,
    tiempo_por_ronda INTEGER DEFAULT 30,
    preguntas_por_ronda INTEGER DEFAULT 1,
    max_jugadores_por_equipo INTEGER DEFAULT 5,
    dificultad VARCHAR(20) DEFAULT 'normal'
);

CREATE TABLE equipos (
    id SERIAL PRIMARY KEY,
    sala_id INTEGER REFERENCES salas(id) ON DELETE CASCADE,
    nombre VARCHAR(32) NOT NULL
);

CREATE TABLE partidas (
    id SERIAL PRIMARY KEY,
    sala_id INTEGER REFERENCES salas(id) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalizada BOOLEAN DEFAULT FALSE
);

CREATE TABLE rondas (
    id SERIAL PRIMARY KEY,
    partida_id INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    numero_ronda INTEGER NOT NULL
);

CREATE TABLE preguntas (
    id SERIAL PRIMARY KEY,
    texto TEXT NOT NULL,
    tipo VARCHAR(15) NOT NULL CHECK (tipo IN ('multiple', 'corta', 'timbre')),
    puntos INTEGER DEFAULT 1,
    media_url TEXT
);

CREATE TABLE ronda_preguntas (
    id SERIAL PRIMARY KEY,
    ronda_id INTEGER REFERENCES rondas(id) ON DELETE CASCADE,
    pregunta_id INTEGER REFERENCES preguntas(id) ON DELETE CASCADE
);

CREATE TABLE opciones_respuesta (
    id SERIAL PRIMARY KEY,
    pregunta_id INTEGER REFERENCES preguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    es_correcta BOOLEAN DEFAULT FALSE
);

CREATE TABLE sala_usuarios (
    id SERIAL PRIMARY KEY,
    sala_id INTEGER REFERENCES salas(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    equipo_id INTEGER REFERENCES equipos(id),
    es_anfitrion BOOLEAN DEFAULT FALSE,
    UNIQUE(sala_id, usuario_id)
);

CREATE TABLE respuestas_usuario (
    id SERIAL PRIMARY KEY,
    sala_usuario_id INTEGER REFERENCES sala_usuarios(id) ON DELETE CASCADE,
    ronda_pregunta_id INTEGER REFERENCES ronda_preguntas(id) ON DELETE CASCADE,
    opcion_respuesta_id INTEGER REFERENCES opciones_respuesta(id),
    respuesta_corta TEXT,
    correcta BOOLEAN
);

CREATE TABLE puntuaciones (
    id SERIAL PRIMARY KEY,
    equipo_id INTEGER REFERENCES equipos(id) ON DELETE CASCADE,
    partida_id INTEGER REFERENCES partidas(id) ON DELETE CASCADE,
    puntos INTEGER DEFAULT 0
);

INSERT INTO preguntas (texto, tipo, puntos) VALUES
('¿Qué película ganó el Óscar a la mejor película en 2010?', 'multiple', 2),
('¿Quién interpretó a Iron Man en el Universo Cinematográfico de Marvel?', 'multiple', 2),
('¿En qué año se estrenó la primera película de "Star Wars"?', 'corta', 3),
('¿Qué actor es conocido como "El Rey del Mundo" por su papel en Titanic?', 'multiple', 2),
('¿Quién dirigió la trilogía de "El Señor de los Anillos"?', 'multiple', 2),
('¿Qué película tiene el récord de más premios Óscar ganados?', 'multiple', 2),
('¿En qué país nació el director Alfred Hitchcock?', 'multiple', 2),
('¿Qué saga cinematográfica incluye películas como "Prisionero de Azkaban" y "Las Reliquias de la Muerte"?', 'multiple', 2),
('¿Qué actor interpretó al Joker en "The Dark Knight"?', 'multiple', 2),
('¿Cuántos Óscar ha ganado Meryl Streep hasta 2023?', 'multiple', 2),
('¿Quién dirigió "Pulp Fiction"?', 'multiple', 2),
('¿Cuál fue la primera película animada nominada a mejor película en los Óscar?', 'multiple', 2),
('¿Qué actor ha interpretado a James Bond más veces?', 'multiple', 2),
('¿Qué película de Disney está basada en una leyenda china?', 'multiple', 2),
('¿Cuál es el personaje principal de "Forrest Gump"?', 'multiple', 2),
('¿En qué ciudad se desarrolla "La La Land"?', 'multiple', 2),
('¿Qué película protagoniza el personaje "Vito Corleone"?', 'multiple', 2),
('¿Quién fue el director de "Titanic"?', 'multiple', 2),
('¿Qué película animada trata sobre emociones como Alegría y Tristeza?', 'multiple', 2),
('¿Cuál es la película más taquillera de la historia (sin ajustar por inflación)?', 'multiple', 2),
('¿Qué actriz protagonizó "Gravity" junto a George Clooney?', 'multiple', 2),
('¿En qué película aparece el personaje "Jack Sparrow"?', 'multiple', 2),
('¿Qué película está basada en el naufragio del Titanic?', 'multiple', 2),
('¿Quién interpretó a Batman en "The Batman" (2022)?', 'multiple', 2),
('¿Qué película de Christopher Nolan trata sobre sueños dentro de sueños?', 'multiple', 2),
('¿Qué director es conocido por películas como "Inception" y "Interstellar"?', 'multiple', 2),
('¿En qué película se escucha la frase "Hasta la vista, baby"?', 'multiple', 2),
('¿Qué actor protagonizó "El Renacido"?', 'multiple', 2),
('¿Qué película cuenta la historia de una inteligencia artificial llamada Samantha?', 'multiple', 2),
('¿Qué director creó el universo de "Avatar"?', 'multiple', 2),
('¿Qué actriz ganó el Óscar por su papel en "Los Miserables" (2012)?', 'multiple', 2),
('¿Qué película de terror está basada en una muñeca poseída llamada Annabelle?', 'multiple', 2),
('¿Qué película popularizó la frase "Yo soy tu padre"?', 'multiple', 2),
('¿Qué director es conocido por sus películas de suspenso y giros inesperados, como "Sexto sentido"?', 'multiple', 2),
('¿En qué película animada un panda aprende kung-fu?', 'multiple', 2),
('¿Qué película de 2023 ganó el Óscar a mejor película?', 'multiple', 2),
('¿Qué actor interpretó a Oppenheimer en la película de 2023?', 'multiple', 2),
('¿Qué actriz interpretó a Barbie en la película de 2023?', 'multiple', 2),
('¿Qué película de Studio Ghibli trata sobre una niña que entra a un mundo espiritual?', 'multiple', 2),
('¿Qué actor ha ganado más premios Óscar como mejor actor?', 'multiple', 2),
('¿En qué película animada los juguetes cobran vida?', 'multiple', 2),
('¿Quién dirigió "Parásitos", ganadora del Óscar en 2020?', 'multiple', 2),
('¿Qué película cuenta la historia de un joven que sobrevive a un naufragio con un tigre?', 'multiple', 2),
('¿Qué película musical incluye la canción "This Is Me"?', 'multiple', 2),
('¿Qué película bélica dirigida por Steven Spielberg se centra en el desembarco de Normandía?', 'multiple', 2),
('¿En qué película animada un pez payaso busca a su hijo?', 'multiple', 2),
('¿Qué película trata sobre un grupo de magos que realizan atracos?', 'multiple', 2),
('¿Qué película protagonizó Joaquin Phoenix como el Joker?', 'multiple', 2),
('¿Qué actriz interpretó a Katniss Everdeen en "Los Juegos del Hambre"?', 'multiple', 2),
('¿Qué película está inspirada en la vida de Freddie Mercury?', 'multiple', 2);

INSERT INTO opciones_respuesta (pregunta_id, texto, es_correcta) VALUES
(1, 'En tierra hostil', FALSE),
(1, 'Avatar', TRUE),
(1, 'The Hurt Locker', FALSE),
(1, 'Slumdog Millionaire', FALSE),

(2, 'Chris Evans', FALSE),
(2, 'Robert Downey Jr.', TRUE),
(2, 'Chris Hemsworth', FALSE),
(2, 'Mark Ruffalo', TRUE),

(4, 'Brad Pitt', FALSE),
(4, 'Leonardo DiCaprio', TRUE),
(4, 'Johnny Depp', FALSE),
(4, 'Matt Damon', FALSE),

(5, 'Peter Jackson', TRUE),
(5, 'Steven Spielberg', FALSE),
(5, 'James Cameron', FALSE),
(5, 'Christopher Nolan', FALSE),

(6, 'Titanic', FALSE),
(6, 'Ben-Hur', FALSE),
(6, 'El Señor de los Anillos: El Retorno del Rey', FALSE),
(6, 'Titanic, Ben-Hur y El Retorno del Rey (empatadas)', TRUE),

(7, 'Estados Unidos', FALSE),
(7, 'Inglaterra', TRUE),
(7, 'Canadá', FALSE),
(7, 'Irlanda', FALSE),

(8, 'Harry Potter y la piedra filosofal', TRUE),
(8, 'Harry Potter y las Reliquias de la Muerte', FALSE),
(8, 'Harry Potter y el misterio del príncipe', FALSE),
(8, 'Harry Potter y la cámara secreta', FALSE),

(9, 'Joaquin Phoenix', FALSE),
(9, 'Heath Ledger', TRUE),
(9, 'Jack Nicholson', FALSE),
(9, 'Jared Leto', FALSE),

(10, '1', FALSE),
(10, '2', TRUE),
(10, '3', FALSE),
(10, '4', FALSE),

(11, 'Steven Spielberg', FALSE),
(11, 'Quentin Tarantino', TRUE),
(11, 'Martin Scorsese', FALSE),
(11, 'Francis Ford Coppola', FALSE),

(12, 'La Bella y la Bestia', TRUE),
(12, 'El Rey León', FALSE),
(12, 'Toy Story', FALSE),
(12, 'Shrek', FALSE),

(13, 'Sean Connery', FALSE),
(13, 'Daniel Craig', FALSE),
(13, 'Roger Moore', TRUE),
(13, 'Pierce Brosnan', FALSE),

(14, 'Mulán', TRUE),
(14, 'Pocahontas', FALSE),
(14, 'Valiente', FALSE),
(14, 'Moana', FALSE),

(15, 'Tom Hanks', TRUE),
(15, 'Brad Pitt', FALSE),
(15, 'Will Smith', FALSE),
(15, 'Robin Williams', FALSE),

(16, 'Nueva York', FALSE),
(16, 'Los Ángeles', TRUE),
(16, 'Chicago', FALSE),
(16, 'Miami', FALSE),

(17, 'El Padrino II', TRUE),
(17, 'Scarface', FALSE),
(17, 'Casino Royale (2006)', FALSE),
(17, 'Uno de los nuestros (Goodfellas)', FALSE),

(18, 'Steven Spielberg (Jurassic Park)', FALSE),
(18, 'James Cameron (Avatar)', TRUE),
(18, 'Peter Jackson (El Señor de los Anillos)', FALSE),
(18, 'Ridley Scott (Gladiador)', FALSE),

(19, 'Soul', FALSE),
(19, 'Inside Out (Del revés)', TRUE),
(19, 'Coco', FALSE),
(19, 'Up', FALSE),

(20, 'Vengadores: Endgame', TRUE),
(20, 'Avatar', FALSE),
(20, 'Titanic', FALSE),
(20, 'Star Wars: The Force Awakens', FALSE),

(21, 'Sandra Bullock', TRUE),
(21, 'Nicole Kidman', FALSE),
(21, 'Amy Adams', FALSE),
(21, 'Charlize Theron', FALSE),

(22, 'Los Piratas del Caribe: La maldición de la Perla Negra', TRUE),
(22, 'Hook', FALSE),
(22, 'La Isla del Tesoro', FALSE),
(22, 'Titanic', FALSE),

(23, 'Titanic', TRUE),
(23, 'Master and Commander: Al otro lado del mundo', FALSE),
(23, 'La tormenta perfecta', FALSE),
(23, 'Poseidón', FALSE),

(24, 'Ben Affleck (Batman v Superman)', FALSE),
(24, 'Christian Bale (The Dark Knight)', FALSE),
(24, 'Robert Pattinson (The Batman)', TRUE),
(24, 'Michael Keaton (Batman)', FALSE),

(25, 'Inception (Origen)', TRUE),
(25, 'Tenet', FALSE),
(25, 'Memento', FALSE),
(25, 'Interstellar', FALSE),

(26, 'Christopher Nolan (Inception)', TRUE),
(26, 'James Cameron (Avatar)', FALSE),
(26, 'David Fincher (Seven)', FALSE),
(26, 'Peter Jackson (El Señor de los Anillos)', FALSE),

(27, 'Matrix Revolutions', FALSE),
(27, 'Terminator 2: El juicio final', TRUE),
(27, 'RoboCop', FALSE),
(27, 'Blade Runner 2049', FALSE),

(28, 'Brad Pitt (Fight Club)', FALSE),
(28, 'Leonardo DiCaprio (El Renacido)', TRUE),
(28, 'Tom Hardy (Mad Max: Furia en la carretera)', FALSE),
(28, 'Matt Damon (El Martiano)', FALSE),

(29, 'Her', TRUE),
(29, 'Lucy', FALSE),
(29, 'Ex Machina', FALSE),
(29, 'IA: Inteligencia Artificial', FALSE),

(30, 'James Cameron (Avatar)', TRUE),
(30, 'Steven Spielberg (Jurassic Park)', FALSE),
(30, 'Peter Jackson (El Señor de los Anillos)', FALSE),
(30, 'George Lucas (Star Wars)', FALSE),

(31, 'Amy Adams (La llegada)', FALSE),
(31, 'Anne Hathaway (Los Miserables)', TRUE),
(31, 'Meryl Streep (El diablo viste de Prada)', FALSE),
(31, 'Jennifer Lawrence (Los Juegos del Hambre)', FALSE),

(32, 'La monja', FALSE),
(32, 'Annabelle', TRUE),
(32, 'It', FALSE),
(32, 'Expediente Warren: El caso Enfield', FALSE),

(33, 'Star Wars: El Imperio contraataca', TRUE),
(33, 'Star Wars: Una nueva esperanza', FALSE),
(33, 'Star Wars: El retorno del Jedi', FALSE),
(33, 'Star Wars: La amenaza fantasma', FALSE),

(34, 'M. Night Shyamalan (El sexto sentido)', TRUE),
(34, 'Christopher Nolan (Inception)', FALSE),
(34, 'David Fincher (Seven)', FALSE),
(34, 'Jordan Peele (Get Out)', FALSE),

(35, 'Kung Fu Panda', TRUE),
(35, 'Shrek', FALSE),
(35, 'Big Hero 6', FALSE),
(35, 'Ratatouille', FALSE),

(36, 'Oppenheimer', TRUE),
(36, 'Everything Everywhere All at Once', FALSE),
(36, 'Poor Things', FALSE),
(36, 'Barbie', FALSE),

(37, 'Cillian Murphy (Oppenheimer)', TRUE),
(37, 'Robert Downey Jr.', FALSE),
(37, 'Matt Damon (Oppenheimer)', FALSE),
(37, 'Christian Bale (El maquinista)', FALSE),

(38, 'Margot Robbie (Barbie)', TRUE),
(38, 'Emma Stone (La La Land)', FALSE),
(38, 'Florence Pugh (Midsommar)', FALSE),
(38, 'Anya Taylor-Joy (Gambito de dama)', FALSE),

(39, 'Mi vecino Totoro', FALSE),
(39, 'El viaje de Chihiro', TRUE),
(39, 'Ponyo', FALSE),
(39, 'La tumba de las luciérnagas', FALSE),

(40, 'Daniel Day-Lewis (Lincoln)', TRUE),
(40, 'Jack Nicholson (El resplandor)', FALSE),
(40, 'Marlon Brando (El Padrino)', FALSE),
(40, 'Tom Hanks (Forrest Gump)', FALSE),

(41, 'Toy Story', TRUE),
(41, 'Cars', FALSE),
(41, 'Shrek', FALSE),
(41, 'Monstruos S.A.', FALSE),

(42, 'Bong Joon-ho (Parásitos)', TRUE),
(42, 'Park Chan-wook (Oldboy)', FALSE),
(42, 'Kim Ki-duk (La isla)', FALSE),
(42, 'Hirokazu Koreeda (Un asunto de familia)', FALSE),

(43, 'La vida de Pi', TRUE),
(43, 'Náufrago', FALSE),
(43, 'El náufrago', FALSE),
(43, 'Moby Dick', FALSE),

(44, 'Los Miserables', TRUE),
(44, 'El gran showman', FALSE),
(44, 'Moulin Rouge', FALSE),
(44, 'Chicago', FALSE),

(45, 'Salvar al soldado Ryan', TRUE),
(45, 'Dunkerque', FALSE),
(45, '1917', FALSE),
(45, 'Cartas desde Iwo Jima', FALSE),

(46, 'Buscando a Nemo', TRUE),
(46, 'La sirenita', FALSE),
(46, 'Shark Tale', FALSE),
(46, 'Finding Dory', FALSE),

(47, 'Los ilusionistas', TRUE),
(47, 'El truco final', FALSE),
(47, 'Ahora me ves', TRUE),
(47, 'El ilusionista', FALSE),

(48, 'Joker', TRUE),
(48, 'El Caballero Oscuro', FALSE),
(48, 'Batman Begins', FALSE),
(48, 'Gotham', FALSE),

(49, 'Jennifer Lawrence', TRUE),
(49, 'Emma Watson', FALSE),
(49, 'Kristen Stewart', FALSE),
(49, 'Shailene Woodley', FALSE),

(50, 'Bohemian Rhapsody', TRUE),
(50, 'Rocketman', FALSE),
(50, 'Elvis', FALSE),
(50, 'La La Land', FALSE);



