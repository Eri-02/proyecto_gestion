package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class IncidenteRequestDTO {
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200) private String titulo;
    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;
    @NotNull(message = "La prioridad es obligatoria")
    private Long prioridadId;
    @NotNull(message = "El estado es obligatorio")
    private Long estadoId;
    @NotNull(message = "El costo estimado es obligatorio")
    @Positive(message = "El costo estimado debe ser mayor a 0")
    private BigDecimal costoEstimado;
    @PositiveOrZero private BigDecimal ingresos;
    @NotNull(message = "El usuario creador es obligatorio")
    private Long creadoPorUsuarioId;
    private Long resueltoPorUsuarioId;
    @Size(max = 150) private String cliente;
    @Size(max = 200) private String sistemaAfectado;
    private String descripcionTecnica;
    private String leccionesAprendidas;
}
