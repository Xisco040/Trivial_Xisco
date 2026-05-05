package com.example.trivia.model;

public class Pregunta {
    private int id;
    private String texto;
    private String tipo;
    private int puntos;
    private String mediaUrl;

    public Pregunta(int id, String texto, String tipo, int puntos, String mediaUrl) {
        this.id = id;
        this.texto = texto;
        this.tipo = tipo;
        this.puntos = puntos;
        this.mediaUrl = mediaUrl;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public int getPuntos() {
        return puntos;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }
}



