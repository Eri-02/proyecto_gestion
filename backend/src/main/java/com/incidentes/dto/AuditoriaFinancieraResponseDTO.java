package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditoriaFinancieraResponseDTO {
    private Long id;
    private Long incidenteId;
    private String incidenteTitulo;
    private Long usuarioId;
    private String usuarioNombre;
    private String tipoCambio;
    private String detalle;
    private BigDecimal valorAfectado;
    private String registroAnterior;
    private String registroNuevo;
    private String ipAddress;
    private LocalDateTime fechaCambio;
}
