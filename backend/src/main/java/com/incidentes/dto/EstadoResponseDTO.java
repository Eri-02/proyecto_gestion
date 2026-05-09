package com.incidentes.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EstadoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String color;
}
