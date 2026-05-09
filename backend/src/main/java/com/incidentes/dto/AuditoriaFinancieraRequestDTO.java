package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditoriaFinancieraRequestDTO {
    @NotNull private Long incidenteId;
    @NotNull private Long usuarioId;
    @NotBlank @Size(max = 50) private String tipoCambio;
    private String detalle;
    private BigDecimal valorAfectado;
    private String registroAnterior;
    private String registroNuevo;
}
