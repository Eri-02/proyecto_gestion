package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.Recurso;
import com.incidentes.repository.RecursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class RecursoService {
    private final RecursoRepository recursoRepository;

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> listarTodos() {
        return recursoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecursoResponseDTO obtenerPorId(Long id) {
        return toDTO(recursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", id)));
    }

    public RecursoResponseDTO crear(RecursoRequestDTO dto) {
        Recurso r = Recurso.builder()
                .nombre(dto.getNombre()).cargo(dto.getCargo()).costoPorHora(dto.getCostoPorHora())
                .especialidad(dto.getEspecialidad()).email(dto.getEmail())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();
        return toDTO(recursoRepository.save(r));
    }

    public RecursoResponseDTO actualizar(Long id, RecursoRequestDTO dto) {
        Recurso r = recursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", id));
        r.setNombre(dto.getNombre()); r.setCargo(dto.getCargo()); r.setCostoPorHora(dto.getCostoPorHora());
        r.setEspecialidad(dto.getEspecialidad()); r.setEmail(dto.getEmail());
        if (dto.getActivo() != null) r.setActivo(dto.getActivo());
        return toDTO(recursoRepository.save(r));
    }

    public void eliminar(Long id) {
        Recurso r = recursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", id));
        recursoRepository.delete(r);
    }

    private RecursoResponseDTO toDTO(Recurso r) {
        return RecursoResponseDTO.builder()
                .id(r.getId()).nombre(r.getNombre()).cargo(r.getCargo()).costoPorHora(r.getCostoPorHora())
                .especialidad(r.getEspecialidad()).email(r.getEmail()).activo(r.getActivo())
                .fechaCreacion(r.getFechaCreacion())
                .build();
    }
}
