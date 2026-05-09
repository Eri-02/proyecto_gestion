package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EstadoRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 30) private String nombre;
    @Size(max = 100) private String descripcion;
    @Size(max = 20) private String color;
}
