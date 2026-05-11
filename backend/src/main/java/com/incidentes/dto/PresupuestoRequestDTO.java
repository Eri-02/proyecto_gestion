package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresupuestoRequestDTO {
    @NotBlank
    @Size(max = 120)
    private String nombre;

    @NotNull
    private LocalDate fechaInicio;

    @NotNull
    private LocalDate fechaFin;

    @NotNull
    @Positive
    private BigDecimal montoPresupuestado;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("999.99")
    private BigDecimal umbralAlertaPorcentaje;

    @Size(max = 250)
    private String descripcion;

    private Long creadoPorUsuarioId;
}
