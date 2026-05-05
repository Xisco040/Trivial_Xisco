package com.example.trivia.dao;

import com.example.trivia.model.Sala;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;

@Repository
public class SalaDAO {
    private final DataSource dataSource;

    @Autowired
    public SalaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void createSala(Sala sala) throws SQLException {
        String sql = "INSERT INTO salas (url_unica, anfitrion_id, rondas, tiempo_por_ronda, preguntas_por_ronda, max_jugadores_por_equipo, dificultad) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, sala.getUrlUnica());
            pstmt.setInt(2, sala.getAnfitrionId());
            pstmt.setInt(3, sala.getRondas());
            pstmt.setInt(4, sala.getTiempoPorRonda());
            pstmt.setInt(5, sala.getPreguntasPorRonda());
            pstmt.setInt(6, sala.getMaxJugadoresPorEquipo());
            pstmt.setString(7, sala.getDificultad());
            pstmt.executeUpdate();
        }
    }

    public Sala findByUrlUnica(String urlUnica) throws SQLException {
        String sql = "SELECT * FROM salas WHERE url_unica = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, urlUnica);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Sala(
                    rs.getInt("id"),
                    rs.getString("url_unica"),
                    rs.getInt("anfitrion_id"),
                    rs.getInt("rondas"),
                    rs.getInt("tiempo_por_ronda"),
                    rs.getInt("preguntas_por_ronda"),
                    rs.getInt("max_jugadores_por_equipo"),
                    rs.getString("dificultad")
                );
            }
        }
        return null;
    }
}