package com.example.trivia.dto;

public record OpcionRespuestaDTO(long id, long preguntaId, String texto, boolean esCorrecta) {}