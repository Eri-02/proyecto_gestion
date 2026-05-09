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
public class CostoExtraService {

    private final CostoExtraRepository costoExtraRepository;
    private final IncidenteRepository incidenteRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<CostoExtraResponseDTO> listarTodos() {
        return costoExtraRepository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CostoExtraResponseDTO obtenerPorId(Long id) {
        return toDTO(costoExtraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CostoExtra", "id", id)));
    }

    @Transactional(readOnly = true)
    public List<CostoExtraResponseDTO> listarPorIncidente(Long incidenteId) {
        return costoExtraRepository.findByIncidenteId(incidenteId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CostoExtraResponseDTO crear(CostoExtraRequestDTO dto) {
        Incidente incidente = incidenteRepository.findById(dto.getIncidenteId())
                .orElseThrow(() -> new ResourceNotFoundException("Incidente", "id", dto.getIncidenteId()));
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioRegistraId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", dto.getUsuarioRegistraId()));
        CostoExtra c = CostoExtra.builder()
                .incidente(incidente).usuarioRegistra(usuario)
                .concepto(dto.getConcepto()).monto(dto.getMonto()).fecha(dto.getFecha())
                .proveedor(dto.getProveedor()).documentoSoporte(dto.getDocumentoSoporte())
                .categoria(dto.getCategoria() != null ? dto.getCategoria() : "Otros")
                .facturable(dto.getFacturable() != null ? dto.getFacturable() : true)
                .build();
        return toDTO(costoExtraRepository.save(c));
    }

    public CostoExtraResponseDTO actualizar(Long id, CostoExtraRequestDTO dto) {
        CostoExtra c = costoExtraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CostoExtra", "id", id));
        c.setConcepto(dto.getConcepto());
        c.setMonto(dto.getMonto());
        c.setFecha(dto.getFecha());
        c.setProveedor(dto.getProveedor());
        c.setDocumentoSoporte(dto.getDocumentoSoporte());
        if (dto.getCategoria() != null) c.setCategoria(dto.getCategoria());
        if (dto.getFacturable() != null) c.setFacturable(dto.getFacturable());
        return toDTO(costoExtraRepository.save(c));
    }

    public void eliminar(Long id) {
        CostoExtra c = costoExtraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CostoExtra", "id", id));
        costoExtraRepository.delete(c);
    }

    private CostoExtraResponseDTO toDTO(CostoExtra c) {
        return CostoExtraResponseDTO.builder()
                .id(c.getId())
                .incidenteId(c.getIncidente().getId())
                .incidenteTitulo(c.getIncidente().getTitulo())
                .usuarioRegistraId(c.getUsuarioRegistra().getId())
                .usuarioRegistraNombre(c.getUsuarioRegistra().getNombreCompleto())
                .concepto(c.getConcepto()).monto(c.getMonto()).fecha(c.getFecha())
                .proveedor(c.getProveedor()).documentoSoporte(c.getDocumentoSoporte())
                .categoria(c.getCategoria()).facturable(c.getFacturable())
                .fechaRegistro(c.getFechaRegistro())
                .build();
    }
}
