package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HoraTrabajadaRequestDTO {
    @NotNull(message = "El incidente es obligatorio")
    private Long incidenteId;
    @NotNull(message = "El recurso es obligatorio")
    private Long recursoId;
    @NotNull(message = "El usuario que registra es obligatorio")
    private Long usuarioRegistraId;
    @NotNull(message = "Las horas son obligatorias")
    @Positive @DecimalMax("24.00") private BigDecimal horas;
    @NotNull(message = "La fecha de trabajo es obligatoria")
    private LocalDate fechaTrabajo;
    @Size(max = 200) private String descripcion;
    private Boolean facturable;
}
