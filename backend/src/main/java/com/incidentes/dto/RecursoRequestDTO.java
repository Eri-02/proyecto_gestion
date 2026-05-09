package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RecursoRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100) private String nombre;
    @NotBlank(message = "El cargo es obligatorio")
    @Size(max = 100) private String cargo;
    @NotNull(message = "El costo por hora es obligatorio")
    @PositiveOrZero private BigDecimal costoPorHora;
    @Size(max = 100) private String especialidad;
    @Size(max = 100) private String email;
    private Boolean activo;
}
