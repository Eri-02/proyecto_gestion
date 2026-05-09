package com.incidentes.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CostoExtraRequestDTO {
    @NotNull(message = "El incidente es obligatorio")
    private Long incidenteId;
    @NotNull(message = "El usuario que registra es obligatorio")
    private Long usuarioRegistraId;
    @NotBlank(message = "El concepto es obligatorio")
    @Size(max = 200) private String concepto;
    @NotNull(message = "El monto es obligatorio")
    @Positive private BigDecimal monto;
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate fecha;
    @Size(max = 150) private String proveedor;
    private String documentoSoporte;
    @Size(max = 50) private String categoria;
    private Boolean facturable;
}
