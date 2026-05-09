package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import java.math.BigDecimal;

@Entity
@Immutable
@Table(name = "vista_kpi_financiero")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VistaKpiFinanciero {

    @Id
    private Long id;

    private String titulo;

    @Column(name = "costo_estimado", precision = 12, scale = 2)
    private BigDecimal costoEstimado;

    @Column(name = "costo_real", precision = 12, scale = 2)
    private BigDecimal costoReal;

    @Column(precision = 12, scale = 2)
    private BigDecimal ingresos;

    @Column(name = "desviacion_absoluta", precision = 12, scale = 2)
    private BigDecimal desviacionAbsoluta;

    @Column(name = "desviacion_porcentual", precision = 10, scale = 2)
    private BigDecimal desviacionPorcentual;

    @Column(name = "margen_absoluto", precision = 12, scale = 2)
    private BigDecimal margenAbsoluto;

    @Column(name = "margen_porcentual", precision = 10, scale = 2)
    private BigDecimal margenPorcentual;
}
