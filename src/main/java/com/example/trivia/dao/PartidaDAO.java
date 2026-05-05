package com.example.trivia.dao;

import com.example.trivia.model.Partida;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@Repository
public class PartidaDAO {
    private final DataSource dataSource;

    @Autowired
    public PartidaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Partida obtenerPartidaPorId(long id) {
        String sql = "SELECT * FROM partidas WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Partida(rs.getInt("id"), rs.getInt("sala_id"), rs.getTimestamp("fecha_inicio").toLocalDateTime(), rs.getBoolean("finalizada"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}