package com.example.trivia.controller;

import com.example.trivia.dto.OpcionRespuestaDTO;
import com.example.trivia.model.OpcionRespuesta;
import com.example.trivia.dao.OpcionRespuestaDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class OpcionRespuestaController {
    private final OpcionRespuestaDAO opcionRespuestaDAO;

    public OpcionRespuestaController(OpcionRespuestaDAO opcionRespuestaDAO) {
        this.opcionRespuestaDAO = opcionRespuestaDAO;
    }

    @GetMapping("/opcionrespuesta/{id}")
    public OpcionRespuestaDTO getOpcionRespuesta(@PathVariable long id) {
        OpcionRespuesta opcion = opcionRespuestaDAO.obtenerOpcionPorId(id);
        if (opcion == null) return null;
        return new OpcionRespuestaDTO(opcion.getId(), opcion.getPreguntaId(), opcion.getTexto(), opcion.isCorrecta());
    }
}