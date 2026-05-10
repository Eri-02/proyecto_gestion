package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilizacionRecursoDTO {
    private Long recursoId;
    private String nombre;
    private String cargo;
    private String especialidad;
    private BigDecimal horasTrabajadas;
    private BigDecimal capacidadDisponible;
    private BigDecimal porcentajeUtilizacion;
}
