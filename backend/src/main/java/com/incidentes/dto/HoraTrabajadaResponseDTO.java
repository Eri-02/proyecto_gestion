package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HoraTrabajadaResponseDTO {
    private Long id;
    private Long incidenteId;
    private String incidenteTitulo;
    private Long recursoId;
    private String recursoNombre;
    private String recursoCargo;
    private BigDecimal costoPorHora;
    private Long usuarioRegistraId;
    private String usuarioRegistraNombre;
    private BigDecimal horas;
    private BigDecimal costoTotal;
    private LocalDate fechaTrabajo;
    private String descripcion;
    private Boolean facturable;
    private LocalDateTime fechaRegistro;
}
