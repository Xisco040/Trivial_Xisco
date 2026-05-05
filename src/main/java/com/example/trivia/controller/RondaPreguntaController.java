package com.example.trivia.controller;

import com.example.trivia.dto.RondaPreguntaDTO;
import com.example.trivia.model.RondaPregunta;
import com.example.trivia.dao.RondaPreguntaDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RondaPreguntaController {
    private final RondaPreguntaDAO rondaPreguntaDAO;

    public RondaPreguntaController(RondaPreguntaDAO rondaPreguntaDAO) {
        this.rondaPreguntaDAO = rondaPreguntaDAO;
    }

    @GetMapping("/rondapregunta/{id}")
    public RondaPreguntaDTO getRondaPregunta(@PathVariable long id) {
        RondaPregunta rp = rondaPreguntaDAO.obtenerRondaPreguntaPorId(id);
        if (rp == null) return null;
        return new RondaPreguntaDTO(rp.getId(), rp.getRondaId(), rp.getPreguntaId());
    }
}