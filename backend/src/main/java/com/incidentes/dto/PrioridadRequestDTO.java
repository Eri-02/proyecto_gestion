package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrioridadRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 20) private String nombre;
    @NotNull(message = "El nivel es obligatorio")
    @Positive private Integer nivel;
    @Size(max = 20) private String color;
    private Integer tiempoResolucionEsperadoHoras;
}
