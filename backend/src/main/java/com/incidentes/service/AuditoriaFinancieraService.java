package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.*;
import com.incidentes.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Transactional
public class AuditoriaFinancieraService {
    private final AuditoriaFinancieraRepository auditoriaRepository;
    private final IncidenteRepository incidenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<AuditoriaFinancieraResponseDTO> listarTodos() {
        return auditoriaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<AuditoriaFinancieraResponseDTO> listarConFiltros(LocalDateTime inicio, LocalDateTime fin,
                                                                 String tipoCambio, String accion,
                                                                 String entidadAfectada, Long incidenteId,
                                                                 Long usuarioId, Pageable pageable) {
        return auditoriaRepository.findConFiltros(inicio, fin, blankToNull(tipoCambio), blankToNull(accion),
                        blankToNull(entidadAfectada), incidenteId, usuarioId, pageable)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public AuditoriaFinancieraResponseDTO obtenerPorId(Long id) {
        return toDTO(auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditoriaFinanciera", "id", id)));
    }

    public AuditoriaFinancieraResponseDTO crear(AuditoriaFinancieraRequestDTO dto) {
        Incidente inc = incidenteRepository.findById(dto.getIncidenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", dto.getIncidenteId()));
        Usuario usr = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", dto.getUsuarioId()));
        AuditoriaFinanciera a = AuditoriaFinanciera.builder()
                .incidente(inc).usuario(usr).tipoCambio(dto.getTipoCambio())
                .accion(dto.getAccion()).entidadAfectada(dto.getEntidadAfectada())
                .registroId(dto.getRegistroId())
                .detalle(dto.getDetalle()).valorAfectado(dto.getValorAfectado())
                .registroAnterior(dto.getRegistroAnterior()).registroNuevo(dto.getRegistroNuevo())
                .build();
        return toDTO(auditoriaRepository.save(a));
    }

    public void registrar(Incidente incidente, Usuario usuario, String accion, String entidadAfectada,
                          Long registroId, BigDecimal valorAfectado, Object anterior, Object nuevo) {
        AuditoriaFinanciera auditoria = AuditoriaFinanciera.builder()
                .incidente(incidente)
                .usuario(usuario)
                .tipoCambio(accion + "_" + entidadAfectada)
                .accion(accion)
                .entidadAfectada(entidadAfectada)
                .registroId(registroId)
                .detalle("Auditoria automatica de " + entidadAfectada)
                .valorAfectado(valorAfectado)
                .registroAnterior(toJson(anterior))
                .registroNuevo(toJson(nuevo))
                .build();
        auditoriaRepository.save(auditoria);
    }

    public AuditoriaFinancieraResponseDTO actualizar(Long id, AuditoriaFinancieraRequestDTO dto) {
        AuditoriaFinanciera a = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditoriaFinanciera", "id", id));
        a.setTipoCambio(dto.getTipoCambio()); a.setDetalle(dto.getDetalle());
        a.setAccion(dto.getAccion());
        a.setEntidadAfectada(dto.getEntidadAfectada());
        a.setRegistroId(dto.getRegistroId());
        a.setValorAfectado(dto.getValorAfectado());
        a.setRegistroAnterior(dto.getRegistroAnterior()); a.setRegistroNuevo(dto.getRegistroNuevo());
        return toDTO(auditoriaRepository.save(a));
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("No se pudo serializar auditoria financiera", e);
        }
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    public void eliminar(Long id) {
        AuditoriaFinanciera a = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditoriaFinanciera", "id", id));
        auditoriaRepository.delete(a);
    }

    private AuditoriaFinancieraResponseDTO toDTO(AuditoriaFinanciera a) {
        return AuditoriaFinancieraResponseDTO.builder()
                .id(a.getId()).incidenteId(a.getIncidente().getId())
                .incidenteTitulo(a.getIncidente().getTitulo())
                .usuarioId(a.getUsuario().getId()).usuarioNombre(a.getUsuario().getNombreCompleto())
                .tipoCambio(a.getTipoCambio()).accion(a.getAccion())
                .entidadAfectada(a.getEntidadAfectada()).registroId(a.getRegistroId())
                .detalle(a.getDetalle())
                .valorAfectado(a.getValorAfectado()).registroAnterior(a.getRegistroAnterior())
                .registroNuevo(a.getRegistroNuevo()).ipAddress(a.getIpAddress())
                .fechaCambio(a.getFechaCambio()).build();
    }
}
