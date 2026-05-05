package com.example.trivia.dao;

import com.example.trivia.model.Pregunta;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@Repository
public class PreguntaDAO {
    private final DataSource dataSource;

    @Autowired
    public PreguntaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Pregunta obtenerPreguntaPorId(long id) {
        String sql = "SELECT * FROM preguntas WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Pregunta(rs.getInt("id"), rs.getString("texto"), rs.getString("tipo"), rs.getInt("puntos"), rs.getString("media_url"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}