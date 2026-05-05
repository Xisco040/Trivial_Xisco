package com.example.trivia.dao;

import com.example.trivia.model.RondaPregunta;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;

@Repository
public class RondaPreguntaDAO {
    private final DataSource dataSource;

    @Autowired
    public RondaPreguntaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public RondaPregunta obtenerRondaPreguntaPorId(long id) {
        String sql = "SELECT * FROM ronda_preguntas WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new RondaPregunta(rs.getInt("id"), rs.getInt("ronda_id"), rs.getInt("pregunta_id"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}