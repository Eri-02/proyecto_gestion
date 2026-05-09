package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RecursoResponseDTO {
    private Long id;
    private String nombre;
    private String cargo;
    private BigDecimal costoPorHora;
    private String especialidad;
    private String email;
    private Boolean activo;
    private LocalDateTime fechaCreacion;
}
