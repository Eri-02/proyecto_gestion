package com.incidentes.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RolResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Integer nivelPermiso;
    private LocalDateTime fechaCreacion;
}
