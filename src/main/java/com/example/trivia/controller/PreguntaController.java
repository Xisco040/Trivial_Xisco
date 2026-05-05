package com.example.trivia.controller;

import com.example.trivia.dto.PreguntaDTO;
import com.example.trivia.model.Pregunta;
import com.example.trivia.dao.PreguntaDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PreguntaController {
    private final PreguntaDAO preguntaDAO;

    public PreguntaController(PreguntaDAO preguntaDAO) {
        this.preguntaDAO = preguntaDAO;
    }

    @GetMapping("/pregunta/{id}")
    public PreguntaDTO getPregunta(@PathVariable long id) {
        Pregunta pregunta = preguntaDAO.obtenerPreguntaPorId(id);
        if (pregunta == null) return null;
        return new PreguntaDTO(pregunta.getId(), pregunta.getTexto(), pregunta.getTipo(), pregunta.getPuntos(), pregunta.getMediaUrl());
    }
}
