package com.example.trivia.model;

public class SalaUsuario {
    private int id;
    private int salaId;
    private int usuarioId;
    private Integer equipoId;
    private boolean esAnfitrion;

    public SalaUsuario(int id, int salaId, int usuarioId, Integer equipoId, boolean esAnfitrion) {
        this.id = id;
        this.salaId = salaId;
        this.usuarioId = usuarioId;
        this.equipoId = equipoId;
        this.esAnfitrion = esAnfitrion;
    }

    public int getId() {
        return id;
    }

    public int getSalaId() {
        return salaId;
    }

    public int getUsuarioId() {
        return usuarioId;
    }

    public Integer getEquipoId() {
        return equipoId;
    }

    public boolean isEsAnfitrion() {
        return esAnfitrion;
    }
}
