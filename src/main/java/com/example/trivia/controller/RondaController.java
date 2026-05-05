package com.example.trivia.controller;

import com.example.trivia.dto.RondaDTO;
import com.example.trivia.model.Ronda;
import com.example.trivia.dao.RondaDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RondaController {
    private final RondaDAO rondaDAO;

    public RondaController(RondaDAO rondaDAO) {
        this.rondaDAO = rondaDAO;
    }

    @GetMapping("/ronda/{id}")
    public RondaDTO getRonda(@PathVariable long id) {
        Ronda ronda = rondaDAO.obtenerRondaPorId(id);
        if (ronda == null) return null;
        return new RondaDTO(ronda.getId(), ronda.getPartidaId(), ronda.getNumeroRonda());
    }
}
