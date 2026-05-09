package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.Prioridad;
import com.incidentes.repository.PrioridadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class PrioridadService {
    private final PrioridadRepository prioridadRepository;

    @Transactional(readOnly = true)
    public List<PrioridadResponseDTO> listarTodos() {
        return prioridadRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PrioridadResponseDTO obtenerPorId(Long id) {
        return toDTO(prioridadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad", "id", id)));
    }

    public PrioridadResponseDTO crear(PrioridadRequestDTO dto) {
        Prioridad p = Prioridad.builder()
                .nombre(dto.getNombre()).nivel(dto.getNivel())
                .color(dto.getColor()).tiempoResolucionEsperadoHoras(dto.getTiempoResolucionEsperadoHoras())
                .build();
        return toDTO(prioridadRepository.save(p));
    }

    public PrioridadResponseDTO actualizar(Long id, PrioridadRequestDTO dto) {
        Prioridad p = prioridadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad", "id", id));
        p.setNombre(dto.getNombre()); p.setNivel(dto.getNivel());
        p.setColor(dto.getColor()); p.setTiempoResolucionEsperadoHoras(dto.getTiempoResolucionEsperadoHoras());
        return toDTO(prioridadRepository.save(p));
    }

    public void eliminar(Long id) {
        Prioridad p = prioridadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prioridad", "id", id));
        prioridadRepository.delete(p);
    }

    private PrioridadResponseDTO toDTO(Prioridad p) {
        return PrioridadResponseDTO.builder()
                .id(p.getId()).nombre(p.getNombre()).nivel(p.getNivel())
                .color(p.getColor()).tiempoResolucionEsperadoHoras(p.getTiempoResolucionEsperadoHoras())
                .build();
    }
}
