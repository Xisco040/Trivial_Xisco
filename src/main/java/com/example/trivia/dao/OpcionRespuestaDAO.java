package com.example.trivia.dao;

import com.example.trivia.model.OpcionRespuesta;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;

@Repository
public class OpcionRespuestaDAO {

    private final DataSource dataSource;

    @Autowired
    public OpcionRespuestaDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public OpcionRespuesta obtenerOpcionPorId(long id) {
        String sql = "SELECT * FROM opciones_respuesta WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new OpcionRespuesta(
                    rs.getInt("id"),
                    rs.getInt("pregunta_id"),
                    rs.getString("texto"),
                    rs.getBoolean("es_correcta")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}