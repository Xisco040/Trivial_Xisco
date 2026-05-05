package com.example.trivia.model;

public class RondaPregunta {

    private int id;
    private int rondaId;
    private int preguntaId;

    public RondaPregunta(int id, int rondaId, int preguntaId) {
        this.id = id;
        this.rondaId = rondaId;
        this.preguntaId = preguntaId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRondaId() {
        return rondaId;
    }

    public void setRondaId(int rondaId) {
        this.rondaId = rondaId;
    }

    public int getPreguntaId() {
        return preguntaId;
    }

    public void setPreguntaId(int preguntaId) {
        this.preguntaId = preguntaId;
    }
}
