package com.example.trivia.dao;

import com.example.trivia.model.SalaUsuario;
import com.example.trivia.model.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;

@Repository
public class SalaUsuarioDAO {
    private final DataSource dataSource;

    @Autowired
    public SalaUsuarioDAO(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public void createSalaUsuario(SalaUsuario salaUsuario) throws SQLException {
        String sql = "INSERT INTO sala_usuarios (sala_id, usuario_id, equipo_id, es_anfitrion) VALUES (?, ?, ?, ?)";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, salaUsuario.getSalaId());
            pstmt.setInt(2, salaUsuario.getUsuarioId());
            pstmt.setObject(3, salaUsuario.getEquipoId(), java.sql.Types.INTEGER); // asi acepta null
            pstmt.setBoolean(4, salaUsuario.isEsAnfitrion());
            pstmt.executeUpdate();
        }
    }

    public List<Usuario> getUsuariosEnSala(int id) {
        String sql = "SELECT u.id, u.nombre_usuario FROM sala_usuarios su JOIN usuarios u ON su.usuario_id = u.id WHERE su.sala_id = ?";
        try (Connection connection = dataSource.getConnection();
             PreparedStatement pstmt = connection.prepareStatement(sql)){
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            List<Usuario> usuarios = new ArrayList<>();
            while (rs.next()) {
                int usuarioId = rs.getInt("id");
                String nombreUsuario = rs.getString("nombre_usuario");
                usuarios.add(new Usuario(usuarioId, nombreUsuario));
            }
            return usuarios;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}
