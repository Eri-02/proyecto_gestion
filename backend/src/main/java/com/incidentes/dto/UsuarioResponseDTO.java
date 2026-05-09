package com.incidentes.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String nombreCompleto;
    private Long rolId;
    private String rolNombre;
    private Integer rolNivelPermiso;
    private Boolean activo;
    private LocalDateTime ultimoAcceso;
    private LocalDateTime fechaCreacion;
}
