package com.example.trivia.dao;

import com.example.trivia.model.Puntuacion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@Repository
public class PuntuacionDAO {
    private final DataSource dataSource;

    @Autowired
    public PuntuacionDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Puntuacion obtenerPuntuacionPorId(long id) {
        String sql = "SELECT * FROM puntuaciones WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Puntuacion(rs.getInt("id"), rs.getInt("equipo_id"), rs.getInt("partida_id"), rs.getInt("puntos"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}