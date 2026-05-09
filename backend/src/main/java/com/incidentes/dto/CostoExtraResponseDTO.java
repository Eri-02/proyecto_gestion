package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CostoExtraResponseDTO {
    private Long id;
    private Long incidenteId;
    private String incidenteTitulo;
    private Long usuarioRegistraId;
    private String usuarioRegistraNombre;
    private String concepto;
    private BigDecimal monto;
    private LocalDate fecha;
    private String proveedor;
    private String documentoSoporte;
    private String categoria;
    private Boolean facturable;
    private LocalDateTime fechaRegistro;
}
