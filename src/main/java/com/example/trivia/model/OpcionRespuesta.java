package com.example.trivia.model;

public class OpcionRespuesta {

    private int id;
    private int preguntaId;
    private String texto;
    private boolean esCorrecta;

    public OpcionRespuesta(int id, int preguntaId, String texto, boolean esCorrecta) {
        this.id = id;
        this.preguntaId = preguntaId;
        this.texto = texto;
        this.esCorrecta = esCorrecta;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPreguntaId() {
        return preguntaId;
    }

    public void setPreguntaId(int preguntaId) {
        this.preguntaId = preguntaId;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public boolean isEsCorrecta() {
        return esCorrecta;
    }

    public void setEsCorrecta(boolean esCorrecta) {
        this.esCorrecta = esCorrecta;
    }

    public boolean isCorrecta() {
        return esCorrecta;
    }
}
