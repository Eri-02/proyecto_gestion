package com.incidentes.service;

import com.incidentes.dto.*;
import com.incidentes.exception.ResourceNotFoundException;
import com.incidentes.model.*;
import com.incidentes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CostoExtraService {

    private final CostoExtraRepository costoExtraRepository;
    private final IncidenteRepository incidenteRepository;
    private final UsuarioRepository usuarioRepository;
    private final AuditoriaFinancieraService auditoriaFinancieraService;

    @Transactional(readOnly = true)
    public List<CostoExtraResponseDTO> listarTodos() {
        return costoExtraRepository.findAll().stream()
                .map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CostoExtraResponseDTO> listarConFiltros(LocalDate inicio, LocalDate fin, Boolean facturable) {
        return costoExtraRepository.findConFiltros(null, inicio, fin, facturable)
                .stream().map(this::toDTO).collect(Collectors.toList());
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

    @Transactional(readOnly = true)
    public List<CostoExtraResponseDTO> listarPorIncidenteConFiltros(Long incidenteId, LocalDate inicio, LocalDate fin, Boolean facturable) {
        return costoExtraRepository.findConFiltros(incidenteId, inicio, fin, facturable)
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
        CostoExtra guardado = costoExtraRepository.save(c);
        auditoriaFinancieraService.registrar(incidente, usuario, "CREATE", "CostoExtra",
                guardado.getId(), guardado.getMonto(), null, snapshot(guardado));
        return toDTO(guardado);
    }

    public CostoExtraResponseDTO actualizar(Long id, CostoExtraRequestDTO dto) {
        CostoExtra c = costoExtraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CostoExtra", "id", id));
        var anterior = snapshot(c);
        c.setConcepto(dto.getConcepto());
        c.setMonto(dto.getMonto());
        c.setFecha(dto.getFecha());
        c.setProveedor(dto.getProveedor());
        c.setDocumentoSoporte(dto.getDocumentoSoporte());
        if (dto.getCategoria() != null) c.setCategoria(dto.getCategoria());
        if (dto.getFacturable() != null) c.setFacturable(dto.getFacturable());
        CostoExtra guardado = costoExtraRepository.save(c);
        auditoriaFinancieraService.registrar(guardado.getIncidente(), guardado.getUsuarioRegistra(), "UPDATE", "CostoExtra",
                guardado.getId(), guardado.getMonto(), anterior, snapshot(guardado));
        return toDTO(guardado);
    }

    public void eliminar(Long id) {
        CostoExtra c = costoExtraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("CostoExtra", "id", id));
        var anterior = snapshot(c);
        auditoriaFinancieraService.registrar(c.getIncidente(), c.getUsuarioRegistra(), "DELETE", "CostoExtra",
                c.getId(), c.getMonto(), anterior, null);
        costoExtraRepository.delete(c);
    }

    private java.util.Map<String, Object> snapshot(CostoExtra c) {
        java.util.Map<String, Object> data = new java.util.LinkedHashMap<>();
        data.put("id", c.getId());
        data.put("incidenteId", c.getIncidente().getId());
        data.put("usuarioRegistraId", c.getUsuarioRegistra().getId());
        data.put("concepto", c.getConcepto());
        data.put("monto", c.getMonto());
        data.put("fecha", c.getFecha());
        data.put("proveedor", c.getProveedor());
        data.put("documentoSoporte", c.getDocumentoSoporte());
        data.put("categoria", c.getCategoria());
        data.put("facturable", c.getFacturable());
        return data;
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
