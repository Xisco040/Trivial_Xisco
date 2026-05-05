package com.example.trivia.controller;

import com.example.trivia.dto.PartidaDTO;
import com.example.trivia.model.Partida;
import com.example.trivia.dao.PartidaDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PartidaController {
    private final PartidaDAO partidaDAO;

    public PartidaController(PartidaDAO partidaDAO) {
        this.partidaDAO = partidaDAO;
    }

    @GetMapping("/partida/{id}")
    public PartidaDTO getPartida(@PathVariable long id) {
        Partida partida = partidaDAO.obtenerPartidaPorId(id);
        if (partida == null) return null;
        return new PartidaDTO(partida.getId(), partida.getSalaId(), partida.isFinalizada());
    }
}
