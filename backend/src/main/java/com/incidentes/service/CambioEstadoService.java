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
public class CambioEstadoService {
    private final CambioEstadoRepository cambioEstadoRepository;
    private final IncidenteRepository incidenteRepository;
    private final EstadoRepository estadoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<CambioEstadoResponseDTO> listarTodos() {
        return cambioEstadoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CambioEstadoResponseDTO obtenerPorId(Long id) {
        return toDTO(cambioEstadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CambioEstado", "id", id)));
    }

    @Transactional(readOnly = true)
    public List<CambioEstadoResponseDTO> listarPorIncidente(Long incidenteId) {
        return cambioEstadoRepository.findByIncidenteIdOrderByFechaCambioDesc(incidenteId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CambioEstadoResponseDTO crear(CambioEstadoRequestDTO dto) {
        Incidente inc = incidenteRepository.findById(dto.getIncidenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", dto.getIncidenteId()));
        Estado anterior = estadoRepository.findById(dto.getEstadoAnteriorId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", dto.getEstadoAnteriorId()));
        Estado nuevo = estadoRepository.findById(dto.getEstadoNuevoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado", "id", dto.getEstadoNuevoId()));
        Usuario usr = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", dto.getUsuarioId()));
        CambioEstado c = CambioEstado.builder()
                .incidente(inc).estadoAnterior(anterior).estadoNuevo(nuevo)
                .usuario(usr).comentario(dto.getComentario()).build();
        return toDTO(cambioEstadoRepository.save(c));
    }

    public CambioEstadoResponseDTO actualizar(Long id, CambioEstadoRequestDTO dto) {
        CambioEstado c = cambioEstadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CambioEstado", "id", id));
        c.setComentario(dto.getComentario());
        return toDTO(cambioEstadoRepository.save(c));
    }

    public void eliminar(Long id) {
        CambioEstado c = cambioEstadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CambioEstado", "id", id));
        cambioEstadoRepository.delete(c);
    }

    private CambioEstadoResponseDTO toDTO(CambioEstado c) {
        return CambioEstadoResponseDTO.builder()
                .id(c.getId()).incidenteId(c.getIncidente().getId())
                .incidenteTitulo(c.getIncidente().getTitulo())
                .estadoAnteriorId(c.getEstadoAnterior().getId())
                .estadoAnteriorNombre(c.getEstadoAnterior().getNombre())
                .estadoNuevoId(c.getEstadoNuevo().getId())
                .estadoNuevoNombre(c.getEstadoNuevo().getNombre())
                .usuarioId(c.getUsuario().getId()).usuarioNombre(c.getUsuario().getNombreCompleto())
                .comentario(c.getComentario()).fechaCambio(c.getFechaCambio()).build();
    }
}
