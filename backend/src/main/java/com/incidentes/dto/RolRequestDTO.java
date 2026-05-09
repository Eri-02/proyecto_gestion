package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RolRequestDTO {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50) private String nombre;
    @Size(max = 200) private String descripcion;
    @NotNull(message = "El nivel de permiso es obligatorio")
    @Positive private Integer nivelPermiso;
}
