package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalistaDesempenoDTO {
    private Long analistaId;
    private String nombre;
    private String cargo;
    private Long incidentesResueltos;
    private Long incidentesAsignados;
    private BigDecimal tiempoPromedioResolucionHoras;
    private BigDecimal tasaExito;
    private BigDecimal horasTrabajadas;
}
