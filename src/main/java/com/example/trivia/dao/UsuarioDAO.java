package com.example.trivia.dao;

import com.example.trivia.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;

@Repository
public class UsuarioDAO {
    private final DataSource dataSource;

    @Autowired
    public UsuarioDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void createUsuario(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuarios (nombre_usuario) VALUES (?)";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, usuario.getNombreUsuario());
            pstmt.executeUpdate();
        }
    }

    public Usuario findOrCreateByUsername(String username) throws SQLException {
        String selectSql = "SELECT * FROM usuarios WHERE nombre_usuario = ?";
        // Buscar usuario por nombre
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(selectSql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Usuario(rs.getInt("id"), rs.getString("nombre_usuario"));
            }
        }
        // Si no existe, crearlo
        Usuario nuevo = new Usuario(0, username);
        createUsuario(nuevo);
        // Buscarlo de nuevo para obtener el id
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(selectSql)) {
            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Usuario(rs.getInt("id"), rs.getString("nombre_usuario"));
            }
        }
        return null;
    }

    public Usuario obtenerUsuarioPorId(long id) {
        String sql = "SELECT * FROM usuarios WHERE id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setLong(1, id);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                return new Usuario(rs.getInt("id"), rs.getString("nombre_usuario"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}