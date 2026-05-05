package com.example.trivia.model;

public class Sala {
	private int id;
	private String url;
	private String anfitrion;
	private int rondas;
	private int tiempoPorRonda;
	private int preguntasPorRonda;
	private int maxJugadoresPorEquipo;
	private String dificultad;

	public Sala(int id, String urlUnica, int anfitrionId, int rondas, int tiempoPorRonda, int preguntasPorRonda, int maxJugadoresPorEquipo, String dificultad) {
		this.id = id;
		this.url = urlUnica;
		this.anfitrion = String.valueOf(anfitrionId);
		this.rondas = rondas;
		this.tiempoPorRonda = tiempoPorRonda;
		this.preguntasPorRonda = preguntasPorRonda;
		this.maxJugadoresPorEquipo = maxJugadoresPorEquipo;
		this.dificultad = dificultad;
	}

	public int getId() {
		return id;
	}

	public String getUrl() {
		return url;
	}

	public String getAnfitrion() {
		return anfitrion;
	}

	public int getRondas() {
		return rondas;
	}

	public void setRondas(int rondas) {
		this.rondas = rondas;
	}

	public int getTiempoPorRonda() {
		return tiempoPorRonda;
	}

	public void setTiempoPorRonda(int tiempoPorRonda) {
		this.tiempoPorRonda = tiempoPorRonda;
	}

	public int getPreguntasPorRonda() {
		return preguntasPorRonda;
	}

	public void setPreguntasPorRonda(int preguntasPorRonda) {
		this.preguntasPorRonda = preguntasPorRonda;
	}

	public int getMaxJugadoresPorEquipo() {
		return maxJugadoresPorEquipo;
	}

	public void setMaxJugadoresPorEquipo(int maxJugadoresPorEquipo) {
		this.maxJugadoresPorEquipo = maxJugadoresPorEquipo;
	}

	public String getDificultad() {
		return dificultad;
	}

	public void setDificultad(String dificultad) {
		this.dificultad = dificultad;
	}

	public String getUrlUnica() {
		return url;
	}

	public int getAnfitrionId() {
		return Integer.parseInt(anfitrion);
	}
}
