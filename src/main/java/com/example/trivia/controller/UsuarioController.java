package com.example.trivia.controller;

import com.example.trivia.dto.UsuarioDTO;
import com.example.trivia.model.Usuario;
import com.example.trivia.dao.UsuarioDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {
    private final UsuarioDAO usuarioDAO;

    public UsuarioController(UsuarioDAO usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    @GetMapping("/usuario/{id}")
    public UsuarioDTO getUsuario(@PathVariable long id) {
        Usuario usuario = usuarioDAO.obtenerUsuarioPorId(id);
        if (usuario == null) return null;
        return new UsuarioDTO(usuario.getId(), usuario.getNombreUsuario());
    }
}