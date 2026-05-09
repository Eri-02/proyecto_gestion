package com.incidentes.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PrioridadResponseDTO {
    private Long id;
    private String nombre;
    private Integer nivel;
    private String color;
    private Integer tiempoResolucionEsperadoHoras;
}
