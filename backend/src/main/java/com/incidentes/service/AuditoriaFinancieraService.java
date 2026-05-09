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
public class AuditoriaFinancieraService {
    private final AuditoriaFinancieraRepository auditoriaRepository;
    private final IncidenteRepository incidenteRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<AuditoriaFinancieraResponseDTO> listarTodos() {
        return auditoriaRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
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
                .detalle(dto.getDetalle()).valorAfectado(dto.getValorAfectado())
                .registroAnterior(dto.getRegistroAnterior()).registroNuevo(dto.getRegistroNuevo())
                .build();
        return toDTO(auditoriaRepository.save(a));
    }

    public AuditoriaFinancieraResponseDTO actualizar(Long id, AuditoriaFinancieraRequestDTO dto) {
        AuditoriaFinanciera a = auditoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AuditoriaFinanciera", "id", id));
        a.setTipoCambio(dto.getTipoCambio()); a.setDetalle(dto.getDetalle());
        a.setValorAfectado(dto.getValorAfectado());
        a.setRegistroAnterior(dto.getRegistroAnterior()); a.setRegistroNuevo(dto.getRegistroNuevo());
        return toDTO(auditoriaRepository.save(a));
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
                .tipoCambio(a.getTipoCambio()).detalle(a.getDetalle())
                .valorAfectado(a.getValorAfectado()).registroAnterior(a.getRegistroAnterior())
                .registroNuevo(a.getRegistroNuevo()).ipAddress(a.getIpAddress())
                .fechaCambio(a.getFechaCambio()).build();
    }
}
