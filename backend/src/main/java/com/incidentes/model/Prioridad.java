package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prioridad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prioridad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true, length = 20)
    private String nombre;

    @Column(name = "nivel", nullable = false)
    private Integer nivel;

    @Column(name = "color", length = 20)
    private String color;

    @Column(name = "tiempo_resolucion_esperado_horas")
    private Integer tiempoResolucionEsperadoHoras;
}
