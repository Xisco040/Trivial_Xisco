package com.example.trivia.controller;

import com.example.trivia.dao.SalaDAO;
import com.example.trivia.dao.UsuarioDAO;
import com.example.trivia.dao.SalaUsuarioDAO;
import com.example.trivia.model.Sala;
import com.example.trivia.model.Usuario;
import com.example.trivia.model.SalaUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/api/salas")
@RestController
@CrossOrigin(origins = "*")
public class SalaController {

    @Autowired
    private SalaDAO salaDAO;
    @Autowired
    private UsuarioDAO usuarioDAO;
    @Autowired
    private SalaUsuarioDAO salaUsuarioDAO;

    // Crear sala
    @PostMapping
    public Map<String, Object> crearSala(@RequestBody Map<String, String> body) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String username = body.get("username");
            Usuario usuario = usuarioDAO.findOrCreateByUsername(username);
            String urlUnica = java.util.UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            Sala sala = new Sala(0, urlUnica, usuario.getId(), 5, 30, 1, 5, "normal");
            salaDAO.createSala(sala);
            Sala salaCreada = salaDAO.findByUrlUnica(urlUnica);
            salaUsuarioDAO.createSalaUsuario(new SalaUsuario(0, salaCreada.getId(), usuario.getId(), null, true));
            resp.put("roomId", salaCreada.getUrlUnica());
            resp.put("hostId", usuario.getId());
            resp.put("host", Map.of("username", usuario.getNombreUsuario(), "userId", usuario.getId()));
            return resp;
        } catch (Exception e) {
            resp.put("error", e.getMessage());
            return resp;
        }
    }

    // Unirse a sala
    @PostMapping("/{roomId}/join")
    public Map<String, Object> joinSala(@PathVariable String roomId, @RequestBody Map<String, String> body) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String username = body.get("username");
            Sala sala = salaDAO.findByUrlUnica(roomId);
            if (sala == null) {
                resp.put("success", false);
                resp.put("message", "Sala no encontrada");
                return resp;
            }
            Usuario usuario = usuarioDAO.findOrCreateByUsername(username);
            salaUsuarioDAO.createSalaUsuario(new SalaUsuario(0, sala.getId(), usuario.getId(), null, false));
            // Devuelve lista de jugadores (ejemplo)
            List<Usuario> jugadores = salaUsuarioDAO.getUsuariosEnSala(sala.getId());
            resp.put("success", true);
            resp.put("roomId", roomId);
            resp.put("userId", usuario.getId());
            resp.put("players", jugadores);
            return resp;
        } catch (Exception e) {
            resp.put("success", false);
            resp.put("message", e.getMessage());
            return resp;
        }
    }

    // Iniciar partida
    @PostMapping("/{roomId}/start")
    public Map<String, Object> startGame(@PathVariable String roomId) {
        Map<String, Object> resp = new HashMap<>();
        // Lógica para marcar la partida como iniciada
        resp.put("started", true);
        return resp;
    }

    // Estado de la sala
    @GetMapping("/{roomId}/status")
    public Map<String, Object> statusSala(@PathVariable String roomId) {
        Map<String, Object> resp = new HashMap<>();
        // Lógica para devolver estado de la sala y lista de jugadores
        resp.put("gameStarted", false); // o true si ya empezó
        resp.put("players", List.of()); // lista de jugadores
        return resp;
    }

    // Siguiente pregunta
    @GetMapping("/{roomId}/nextQuestion")
    public Map<String, Object> nextQuestion(@PathVariable String roomId) {
        Map<String, Object> resp = new HashMap<>();
        // Lógica para devolver la siguiente pregunta
        resp.put("text", "¿Ejemplo de pregunta?");
        resp.put("options", List.of(
                Map.of("optionId", 1, "text", "Opción 1"),
                Map.of("optionId", 2, "text", "Opción 2")
        ));
        resp.put("timeLimit", 30);
        resp.put("finished", false);
        return resp;
    }

    // Responder pregunta
    @PostMapping("/{roomId}/answer")
    public Map<String, Object> answerQuestion(@PathVariable String roomId, @RequestBody Map<String, Object> body) {
        Map<String, Object> resp = new HashMap<>();
        // body: { userId, optionId, elapsedSec }
        // Lógica para registrar respuesta y devolver la opción correcta
        resp.put("correctOptionId", "1"); // ejemplo
        return resp;
    }

    // Scoreboard
    @GetMapping("/{roomId}/scoreboard")
    public Map<String, Object> scoreboard(@PathVariable String roomId) {
        Map<String, Object> resp = new HashMap<>();
        // Lógica para devolver puntuaciones
        resp.put("players", List.of(
                Map.of("username", "Jugador1", "score", 10),
                Map.of("username", "Jugador2", "score", 5)
        ));
        return resp;
    }
}