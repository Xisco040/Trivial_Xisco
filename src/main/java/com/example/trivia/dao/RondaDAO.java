package com.example.trivia.dao;

import com.example.trivia.model.Ronda;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;

@Repository
public class RondaDAO {
    private final DataSource dataSource;

    @Autowired
    public RondaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Ronda obtenerRondaPorId(long id) {
        String sql = "SELECT * FROM rondas WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Ronda(rs.getInt("id"), rs.getInt("partida_id"), rs.getInt("numero_ronda"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}