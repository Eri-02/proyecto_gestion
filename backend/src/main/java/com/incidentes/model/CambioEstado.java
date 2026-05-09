package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cambio_estado")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CambioEstado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_anterior_id", nullable = false)
    private Estado estadoAnterior;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "estado_nuevo_id", nullable = false)
    private Estado estadoNuevo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha_cambio", updatable = false)
    private LocalDateTime fechaCambio;

    @PrePersist
    protected void onCreate() {
        this.fechaCambio = LocalDateTime.now();
    }
}
