ALTER TABLE auditoria_financiera
    ADD COLUMN accion VARCHAR(20) NOT NULL DEFAULT 'UPDATE' AFTER tipo_cambio,
    ADD COLUMN entidad_afectada VARCHAR(80) NOT NULL DEFAULT 'Financiera' AFTER accion,
    ADD COLUMN registro_id BIGINT NOT NULL DEFAULT 0 AFTER entidad_afectada;

CREATE INDEX idx_auditoria_financiera_entidad_registro
    ON auditoria_financiera (entidad_afectada, registro_id);

CREATE TABLE presupuesto (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(120) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_presupuestado DECIMAL(14,2) NOT NULL CHECK (monto_presupuestado > 0),
    umbral_alerta_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 10.00 CHECK (umbral_alerta_porcentaje >= 0),
    descripcion VARCHAR(250),
    creado_por_usuario_id BIGINT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_presupuesto_periodo UNIQUE (fecha_inicio, fecha_fin),
    CONSTRAINT chk_presupuesto_periodo CHECK (fecha_inicio <= fecha_fin),
    CONSTRAINT fk_presupuesto_usuario FOREIGN KEY (creado_por_usuario_id) REFERENCES usuario(id)
);

CREATE INDEX idx_presupuesto_periodo ON presupuesto (fecha_inicio, fecha_fin, activo);
CREATE INDEX idx_hora_trabajada_periodo_facturable ON hora_trabajada (fecha_trabajo, facturable);
CREATE INDEX idx_costo_extra_periodo_facturable ON costo_extra (fecha, facturable);

DROP VIEW IF EXISTS vista_incidente_completo;
CREATE VIEW vista_incidente_completo AS
SELECT
    i.id,
    i.titulo,
    i.descripcion,
    p.nombre AS prioridad,
    p.nivel AS prioridad_nivel,
    p.color AS prioridad_color,
    e.nombre AS estado,
    e.color AS estado_color,
    i.costo_estimado,
    i.ingresos,
    COALESCE(h.costo_mano_obra, 0) AS costo_mano_obra,
    COALESCE(ce.costo_extras, 0) AS costo_extras,
    COALESCE(h.costo_mano_obra, 0) + COALESCE(ce.costo_extras, 0) AS costo_real,
    COALESCE(h.costo_mano_obra_facturable, 0) + COALESCE(ce.costo_extras_facturable, 0) AS costo_facturable,
    COALESCE(h.costo_mano_obra_no_facturable, 0) + COALESCE(ce.costo_extras_no_facturable, 0) AS costo_no_facturable,
    i.fecha_creacion,
    i.fecha_resolucion,
    i.fecha_cierre,
    i.cliente,
    i.sistema_afectado,
    u.nombre_completo AS creado_por,
    TIMESTAMPDIFF(HOUR, i.fecha_creacion, COALESCE(i.fecha_resolucion, i.fecha_cierre, NOW())) AS horas_para_resolucion
FROM incidente i
INNER JOIN prioridad p ON i.prioridad_id = p.id
INNER JOIN estado e ON i.estado_id = e.id
INNER JOIN usuario u ON i.creado_por_usuario_id = u.id
LEFT JOIN (
    SELECT
        h.incidente_id,
        SUM(h.horas * r.costo_por_hora) AS costo_mano_obra,
        SUM(CASE WHEN h.facturable = TRUE THEN h.horas * r.costo_por_hora ELSE 0 END) AS costo_mano_obra_facturable,
        SUM(CASE WHEN h.facturable = FALSE THEN h.horas * r.costo_por_hora ELSE 0 END) AS costo_mano_obra_no_facturable
    FROM hora_trabajada h
    INNER JOIN recurso r ON h.recurso_id = r.id
    GROUP BY h.incidente_id
) h ON i.id = h.incidente_id
LEFT JOIN (
    SELECT
        incidente_id,
        SUM(monto) AS costo_extras,
        SUM(CASE WHEN facturable = TRUE THEN monto ELSE 0 END) AS costo_extras_facturable,
        SUM(CASE WHEN facturable = FALSE THEN monto ELSE 0 END) AS costo_extras_no_facturable
    FROM costo_extra
    GROUP BY incidente_id
) ce ON i.id = ce.incidente_id;

DROP VIEW IF EXISTS vista_kpi_financiero;
CREATE VIEW vista_kpi_financiero AS
SELECT
    i.id,
    i.titulo,
    i.costo_estimado,
    COALESCE(h.costo_mano_obra, 0) + COALESCE(ce.costo_extras, 0) AS costo_real,
    COALESCE(h.costo_mano_obra_facturable, 0) + COALESCE(ce.costo_extras_facturable, 0) AS costo_facturable,
    COALESCE(h.costo_mano_obra_no_facturable, 0) + COALESCE(ce.costo_extras_no_facturable, 0) AS costo_no_facturable,
    i.ingresos,
    (COALESCE(h.costo_mano_obra, 0) + COALESCE(ce.costo_extras, 0)) - i.costo_estimado AS desviacion_absoluta,
    ROUND(((COALESCE(h.costo_mano_obra, 0) + COALESCE(ce.costo_extras, 0)) - i.costo_estimado) / i.costo_estimado * 100, 2) AS desviacion_porcentual,
    i.ingresos - (COALESCE(h.costo_mano_obra, 0) + COALESCE(ce.costo_extras, 0)) AS margen_absoluto,
    CASE
        WHEN i.ingresos = 0 THEN 0
        ELSE ROUND((i.ingresos - (COALESCE(h.costo_mano_obra, 0) + COALESCE(ce.costo_extras, 0))) / i.ingresos * 100, 2)
    END AS margen_porcentual
FROM incidente i
LEFT JOIN (
    SELECT
        h.incidente_id,
        SUM(h.horas * r.costo_por_hora) AS costo_mano_obra,
        SUM(CASE WHEN h.facturable = TRUE THEN h.horas * r.costo_por_hora ELSE 0 END) AS costo_mano_obra_facturable,
        SUM(CASE WHEN h.facturable = FALSE THEN h.horas * r.costo_por_hora ELSE 0 END) AS costo_mano_obra_no_facturable
    FROM hora_trabajada h
    INNER JOIN recurso r ON h.recurso_id = r.id
    GROUP BY h.incidente_id
) h ON i.id = h.incidente_id
LEFT JOIN (
    SELECT
        incidente_id,
        SUM(monto) AS costo_extras,
        SUM(CASE WHEN facturable = TRUE THEN monto ELSE 0 END) AS costo_extras_facturable,
        SUM(CASE WHEN facturable = FALSE THEN monto ELSE 0 END) AS costo_extras_no_facturable
    FROM costo_extra
    GROUP BY incidente_id
) ce ON i.id = ce.incidente_id;
