package com.example.trivia.controller;

import com.example.trivia.dto.RespuestaUsuarioDTO;
import com.example.trivia.model.RespuestaUsuario;
import com.example.trivia.dao.RespuestaUsuarioDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RespuestaUsuarioController {
    private final RespuestaUsuarioDAO respuestaUsuarioDAO;

    public RespuestaUsuarioController(RespuestaUsuarioDAO respuestaUsuarioDAO) {
        this.respuestaUsuarioDAO = respuestaUsuarioDAO;
    }

    @GetMapping("/respuestausuario/{id}")
    public RespuestaUsuarioDTO getRespuestaUsuario(@PathVariable long id) {
        RespuestaUsuario respuesta = respuestaUsuarioDAO.obtenerRespuestaPorId(id);
        if (respuesta == null) return null;
        return new RespuestaUsuarioDTO(respuesta.getId(), respuesta.getSalaUsuarioId(), respuesta.getRondaPreguntaId(), respuesta.getOpcionRespuestaId(), respuesta.getRespuestaCorta(), respuesta.isCorrecta());
    }
}