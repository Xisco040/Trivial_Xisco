package com.example.trivia.dao;

import com.example.trivia.model.RespuestaUsuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import javax.sql.DataSource;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;

@Repository
public class RespuestaUsuarioDAO {
    private final DataSource dataSource;

    @Autowired
    public RespuestaUsuarioDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public RespuestaUsuario obtenerRespuestaPorId(long id) {
        String sql = "SELECT * FROM respuestas_usuario WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new RespuestaUsuario(rs.getInt("id"), rs.getInt("sala_usuario_id"), rs.getInt("ronda_pregunta_id"), rs.getInt("opcion_respuesta_id"), rs.getString("respuesta_corta"), rs.getBoolean("correcta"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}