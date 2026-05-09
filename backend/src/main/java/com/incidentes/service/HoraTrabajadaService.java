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

@Service @RequiredArgsConstructor @Transactional
public class HoraTrabajadaService {
    private final HoraTrabajadaRepository horaTrabajadaRepository;
    private final IncidenteRepository incidenteRepository;
    private final RecursoRepository recursoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<HoraTrabajadaResponseDTO> listarTodos() {
        return horaTrabajadaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HoraTrabajadaResponseDTO obtenerPorId(Long id) {
        return toDTO(horaTrabajadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HoraTrabajada", "id", id)));
    }

    @Transactional(readOnly = true)
    public List<HoraTrabajadaResponseDTO> listarPorIncidente(Long incidenteId) {
        return horaTrabajadaRepository.findByIncidenteId(incidenteId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public HoraTrabajadaResponseDTO crear(HoraTrabajadaRequestDTO dto) {
        Incidente incidente = incidenteRepository.findById(dto.getIncidenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", dto.getIncidenteId()));
        Recurso recurso = recursoRepository.findById(dto.getRecursoId())
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", dto.getRecursoId()));
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioRegistraId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", dto.getUsuarioRegistraId()));
        HoraTrabajada h = HoraTrabajada.builder()
                .incidente(incidente).recurso(recurso).usuarioRegistra(usuario)
                .horas(dto.getHoras()).fechaTrabajo(dto.getFechaTrabajo())
                .descripcion(dto.getDescripcion())
                .facturable(dto.getFacturable() != null ? dto.getFacturable() : true)
                .build();
        return toDTO(horaTrabajadaRepository.save(h));
    }

    public HoraTrabajadaResponseDTO actualizar(Long id, HoraTrabajadaRequestDTO dto) {
        HoraTrabajada h = horaTrabajadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HoraTrabajada", "id", id));
        Recurso recurso = recursoRepository.findById(dto.getRecursoId())
                .orElseThrow(() -> new ResourceNotFoundException("Recurso", "id", dto.getRecursoId()));
        h.setRecurso(recurso); h.setHoras(dto.getHoras());
        h.setFechaTrabajo(dto.getFechaTrabajo()); h.setDescripcion(dto.getDescripcion());
        if (dto.getFacturable() != null) h.setFacturable(dto.getFacturable());
        return toDTO(horaTrabajadaRepository.save(h));
    }

    public void eliminar(Long id) {
        HoraTrabajada h = horaTrabajadaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("HoraTrabajada", "id", id));
        horaTrabajadaRepository.delete(h);
    }

    private HoraTrabajadaResponseDTO toDTO(HoraTrabajada h) {
        return HoraTrabajadaResponseDTO.builder()
                .id(h.getId())
                .incidenteId(h.getIncidente().getId()).incidenteTitulo(h.getIncidente().getTitulo())
                .recursoId(h.getRecurso().getId()).recursoNombre(h.getRecurso().getNombre())
                .recursoCargo(h.getRecurso().getCargo()).costoPorHora(h.getRecurso().getCostoPorHora())
                .usuarioRegistraId(h.getUsuarioRegistra().getId())
                .usuarioRegistraNombre(h.getUsuarioRegistra().getNombreCompleto())
                .horas(h.getHoras())
                .costoTotal(h.getHoras().multiply(h.getRecurso().getCostoPorHora()))
                .fechaTrabajo(h.getFechaTrabajo()).descripcion(h.getDescripcion())
                .facturable(h.getFacturable()).fechaRegistro(h.getFechaRegistro())
                .build();
    }
}
