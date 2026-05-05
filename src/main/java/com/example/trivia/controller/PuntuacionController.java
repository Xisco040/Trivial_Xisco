package com.example.trivia.controller;

import com.example.trivia.dto.PuntuacionDTO;
import com.example.trivia.model.Puntuacion;
import com.example.trivia.dao.PuntuacionDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PuntuacionController {
    private final PuntuacionDAO puntuacionDAO;

    public PuntuacionController(PuntuacionDAO puntuacionDAO) {
        this.puntuacionDAO = puntuacionDAO;
    }

    @GetMapping("/puntuacion/{id}")
    public PuntuacionDTO getPuntuacion(@PathVariable long id) {
        Puntuacion puntuacion = puntuacionDAO.obtenerPuntuacionPorId(id);
        if (puntuacion == null) return null;
        return new PuntuacionDTO(puntuacion.getId(), puntuacion.getEquipoId(), puntuacion.getPartidaId(), puntuacion.getPuntos());
    }
}