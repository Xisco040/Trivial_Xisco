package com.example.trivia.model;

public class Ronda {

    private int id;
    private int partidaId;
    private int numeroRonda;

    public Ronda(int id, int partidaId, int numeroRonda) {
        this.id = id;
        this.partidaId = partidaId;
        this.numeroRonda = numeroRonda;
    }

    public int getId() {
        return id;
    }

    public int getPartidaId() {
        return partidaId;
    }

    public int getNumeroRonda() {
        return numeroRonda;
    }
}
