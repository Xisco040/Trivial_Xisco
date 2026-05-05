package com.example.trivia.model;

public class Equipo {
    private int id;
    private int salaId;
    private String nombre;

    public Equipo(int id, int salaId, String nombre) {
        this.id = id;
        this.salaId = salaId;
        this.nombre = nombre;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSalaId() {
        return salaId;
    }

    public void setSalaId(int salaId) {
        this.salaId = salaId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
