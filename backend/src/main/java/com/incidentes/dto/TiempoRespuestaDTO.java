package com.incidentes.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TiempoRespuestaDTO {

    private BigDecimal promedioGlobalMinutos;
    private BigDecimal promedioGlobalHoras;
    private Long totalIncidentesAnalizados;
    private List<DetalleTiempoRespuestaDTO> detalles;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleTiempoRespuestaDTO {
        private Long incidenteId;
        private String titulo;
        private LocalDateTime fechaCreacion;
        private LocalDateTime fechaPrimerCambioEstado;
        private Long tiempoRespuestaMinutos;
        private BigDecimal tiempoRespuestaHoras;
    }
}
