package com.example.trivia.model;

public class Puntuacion {

    private int id;
    private int equipoId;
    private int partidaId;
    private int puntos;

    public Puntuacion(int id, int equipoId, int partidaId, int puntos) {
        this.id = id;
        this.equipoId = equipoId;
        this.partidaId = partidaId;
        this.puntos = puntos;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEquipoId() {
        return equipoId;
    }

    public void setEquipoId(int equipoId) {
        this.equipoId = equipoId;
    }

    public int getPartidaId() {
        return partidaId;
    }

    public void setPartidaId(int partidaId) {
        this.partidaId = partidaId;
    }

    public int getPuntos() {
        return puntos;
    }

    public void setPuntos(int puntos) {
        this.puntos = puntos;
    }
}
