package com.example.trivia.controller;

import com.example.trivia.dto.EquipoDTO;
import com.example.trivia.model.Equipo;
import com.example.trivia.dao.EquipoDAO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EquipoController {
    private final EquipoDAO equipoDAO;

    public EquipoController(EquipoDAO equipoDAO) {
        this.equipoDAO = equipoDAO;
    }

    @GetMapping("/equipo/{id}")
    public EquipoDTO getEquipo(@PathVariable long id) {
        Equipo equipo = equipoDAO.obtenerEquipoPorId(id);
        if (equipo == null) return null;
        return new EquipoDTO(equipo.getId(), equipo.getNombre(), equipo.getSalaId());
    }
}
