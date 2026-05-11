package com.incidentes.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_financiera")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditoriaFinanciera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incidente_id", nullable = false)
    private Incidente incidente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo_cambio", nullable = false, length = 50)
    private String tipoCambio;

    @Column(name = "accion", nullable = false, length = 20)
    private String accion;

    @Column(name = "entidad_afectada", nullable = false, length = 80)
    private String entidadAfectada;

    @Column(name = "registro_id", nullable = false)
    private Long registroId;

    @Column(name = "detalle", columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "valor_afectado", precision = 12, scale = 2)
    private BigDecimal valorAfectado;

    @Column(name = "registro_anterior", columnDefinition = "TEXT")
    private String registroAnterior;

    @Column(name = "registro_nuevo", columnDefinition = "TEXT")
    private String registroNuevo;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "fecha_cambio", updatable = false)
    private LocalDateTime fechaCambio;

    @PrePersist
    protected void onCreate() {
        this.fechaCambio = LocalDateTime.now();
    }
}
