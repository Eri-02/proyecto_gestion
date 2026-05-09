package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UsuarioRequestDTO {
    @NotBlank(message = "El username es obligatorio")
    @Size(max = 50) private String username;
    @NotBlank(message = "El password es obligatorio")
    private String password;
    @NotBlank(message = "El email es obligatorio")
    @Size(max = 100) private String email;
    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 150) private String nombreCompleto;
    @NotNull(message = "El rol es obligatorio")
    private Long rolId;
    private Boolean activo;
}
