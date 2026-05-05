package com.example.trivia.model;

public class RespuestaUsuario {

    private int id;
    private int sala_usuario_id;
    private int ronda_pregunta_id;
    private int opcion_respuesta_id;
    private String respuesta_corta;
    private boolean correcta;

    public RespuestaUsuario(int id, int sala_usuario_id, int ronda_pregunta_id, int opcion_respuesta_id, String respuesta_corta, boolean correcta) {
        this.id = id;
        this.sala_usuario_id = sala_usuario_id;
        this.ronda_pregunta_id = ronda_pregunta_id;
        this.opcion_respuesta_id = opcion_respuesta_id;
        this.respuesta_corta = respuesta_corta;
        this.correcta = correcta;
    }

    // Getters and Setters

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSala_usuario_id() {
        return sala_usuario_id;
    }

    public void setSala_usuario_id(int sala_usuario_id) {
        this.sala_usuario_id = sala_usuario_id;
    }

    public int getRonda_pregunta_id() {
        return ronda_pregunta_id;
    }

    public void setRonda_pregunta_id(int ronda_pregunta_id) {
        this.ronda_pregunta_id = ronda_pregunta_id;
    }

    public int getOpcion_respuesta_id() {
        return opcion_respuesta_id;
    }

    public void setOpcion_respuesta_id(int opcion_respuesta_id) {
        this.opcion_respuesta_id = opcion_respuesta_id;
    }

    public String getRespuesta_corta() {
        return respuesta_corta;
    }

    public void setRespuesta_corta(String respuesta_corta) {
        this.respuesta_corta = respuesta_corta;
    }

    public boolean isCorrecta() {
        return correcta;
    }

    public void setCorrecta(boolean correcta) {
        this.correcta = correcta;
    }

    public long getSalaUsuarioId() {
        return sala_usuario_id;
    }

    public long getRondaPreguntaId() {
        return ronda_pregunta_id;
    }

    public long getOpcionRespuestaId() {
        return opcion_respuesta_id;
    }

    public String getRespuestaCorta() {
        return respuesta_corta;
    }
}
