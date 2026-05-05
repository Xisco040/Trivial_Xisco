package com.example.trivia.dto;

public record PreguntaDTO(long id, String texto, String tipo, int puntos, String mediaUrl) {}