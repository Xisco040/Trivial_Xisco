package com.example.trivia.dto;

public record RespuestaUsuarioDTO(long id, long salaUsuarioId, long rondaPreguntaId, Long opcionRespuestaId, String respuestaCorta, Boolean correcta) {}
