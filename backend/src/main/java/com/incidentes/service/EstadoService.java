package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.Estado;
import com.incidentes.repository.EstadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class EstadoService {
    private final EstadoRepository estadoRepository;

    @Transactional(readOnly = true)
    public List<EstadoResponseDTO> listarTodos() {
        return estadoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EstadoResponseDTO obtenerPorId(Long id) {
        return toDTO(estadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", id)));
    }

    public EstadoResponseDTO crear(EstadoRequestDTO dto) {
        Estado e = Estado.builder().nombre(dto.getNombre()).descripcion(dto.getDescripcion()).color(dto.getColor()).build();
        return toDTO(estadoRepository.save(e));
    }

    public EstadoResponseDTO actualizar(Long id, EstadoRequestDTO dto) {
        Estado e = estadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", id));
        e.setNombre(dto.getNombre()); e.setDescripcion(dto.getDescripcion()); e.setColor(dto.getColor());
        return toDTO(estadoRepository.save(e));
    }

    public void eliminar(Long id) {
        Estado e = estadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", id));
        estadoRepository.delete(e);
    }

    private EstadoResponseDTO toDTO(Estado e) {
        return EstadoResponseDTO.builder()
                .id(e.getId()).nombre(e.getNombre()).descripcion(e.getDescripcion()).color(e.getColor())
                .build();
    }
}
