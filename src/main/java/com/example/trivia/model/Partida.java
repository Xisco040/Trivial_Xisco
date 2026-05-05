package com.example.trivia.model;

import java.time.LocalDateTime;

public class Partida {

    private int id;
    private int salaId;
    private LocalDateTime fechaInicio;
    private boolean finalizada;

    public Partida(int id, int salaId, LocalDateTime fechaInicio, boolean finalizada) {
        this.id = id;
        this.salaId = salaId;
        this.fechaInicio = fechaInicio;
        this.finalizada = finalizada;
    }

    public int getId() {
        return id;
    }

    public int getSalaId() {
        return salaId;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public boolean isFinalizada() {
        return finalizada;
    }
}
