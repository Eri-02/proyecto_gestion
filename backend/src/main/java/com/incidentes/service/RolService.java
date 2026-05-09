package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.Rol;
import com.incidentes.repository.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RolService {
    private final RolRepository rolRepository;

    @Transactional(readOnly = true)
    public List<RolResponseDTO> listarTodos() {
        return rolRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RolResponseDTO obtenerPorId(Long id) {
        return toDTO(rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "id", id)));
    }

    public RolResponseDTO crear(RolRequestDTO dto) {
        Rol rol = Rol.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .nivelPermiso(dto.getNivelPermiso())
                .build();
        return toDTO(rolRepository.save(rol));
    }

    public RolResponseDTO actualizar(Long id, RolRequestDTO dto) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "id", id));
        rol.setNombre(dto.getNombre());
        rol.setDescripcion(dto.getDescripcion());
        rol.setNivelPermiso(dto.getNivelPermiso());
        return toDTO(rolRepository.save(rol));
    }

    public void eliminar(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol", "id", id));
        rolRepository.delete(rol);
    }

    private RolResponseDTO toDTO(Rol r) {
        return RolResponseDTO.builder()
                .id(r.getId()).nombre(r.getNombre()).descripcion(r.getDescripcion())
                .nivelPermiso(r.getNivelPermiso()).fechaCreacion(r.getFechaCreacion())
                .build();
    }
}
