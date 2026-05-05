package com.example.trivia.dao;

import com.example.trivia.model.Equipo;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class EquipoDAO {

    private final DataSource dataSource;

    @Autowired
    public EquipoDAO(DataSource dataSource){
        this.dataSource = dataSource;
    }

    public Equipo obtenerEquipoPorId(long id) {
        String sql = "SELECT * FROM equipos WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Equipo(rs.getInt("id"), rs.getInt("sala_id"), rs.getString("nombre"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}