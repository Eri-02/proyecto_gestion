package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.*;
import com.incidentes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO obtenerPorId(Long id) {
        return toDTO(usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id)));
    }

    public UsuarioResponseDTO crear(UsuarioRequestDTO dto) {
        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "id", dto.getRolId()));
        Usuario u = Usuario.builder()
                .username(dto.getUsername()).password(dto.getPassword())
                .email(dto.getEmail()).nombreCompleto(dto.getNombreCompleto())
                .rol(rol).activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        return toDTO(usuarioRepository.save(u));
    }

    public UsuarioResponseDTO actualizar(Long id, UsuarioRequestDTO dto) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "id", dto.getRolId()));
        u.setUsername(dto.getUsername());
        u.setPassword(dto.getPassword());
        u.setEmail(dto.getEmail());
        u.setNombreCompleto(dto.getNombreCompleto());
        u.setRol(rol);
        if (dto.getActivo() != null) u.setActivo(dto.getActivo());
        return toDTO(usuarioRepository.save(u));
    }

    public void eliminar(Long id) {
        Usuario u = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        usuarioRepository.delete(u);
    }

    private UsuarioResponseDTO toDTO(Usuario u) {
        return UsuarioResponseDTO.builder()
                .id(u.getId()).username(u.getUsername()).email(u.getEmail())
                .nombreCompleto(u.getNombreCompleto())
                .rolId(u.getRol().getId()).rolNombre(u.getRol().getNombre())
                .rolNivelPermiso(u.getRol().getNivelPermiso())
                .activo(u.getActivo()).ultimoAcceso(u.getUltimoAcceso())
                .fechaCreacion(u.getFechaCreacion())
                .build();
    }
}
