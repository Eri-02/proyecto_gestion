

-- =====================================================
-- 1. TABLAS DE ROLES Y USUARIOS
-- =====================================================

CREATE TABLE rol (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    nivel_permiso INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rol (nombre, descripcion, nivel_permiso) VALUES
('ROLE_READ_ONLY', 'Solo lectura - Consultores externos', 1),
('ROLE_ANALISTA', 'Analista de ciberseguridad - Puede gestionar incidentes', 2),
('ROLE_FINANZAS', 'Area financiera - Puede ver y editar costos', 2),
('ROLE_ADMIN', 'Administrador del sistema - Gestion completa', 3),
('ROLE_SUPER_ADMIN', 'Super administrador - Acceso total', 4),
('ROLE_DIRECTOR', 'Direccion - Acceso a dashboards y reportes', 3);

CREATE TABLE usuario (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nombre_completo VARCHAR(150) NOT NULL,
    rol_id BIGINT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE RESTRICT
);

INSERT INTO usuario (username, password, email, nombre_completo, rol_id) VALUES
('lector', 'lector123', 'lector@ciberseguridad.com', 'Consultor Externo', 1),
('analista1', 'analista123', 'carlos.paez@ciberseguridad.com', 'Carlos Paez - Analista Senior', 2),
('analista2', 'analista123', 'laura.gomez@ciberseguridad.com', 'Laura Gomez - Analista Junior', 2),
('finanzas', 'finanzas123', 'contabilidad@empresa.com', 'Maria Rodriguez - Finanzas', 3),
('admin', 'admin123', 'admin@sistema.com', 'Administrador del Sistema', 4),
('superadmin', 'super123', 'super@admin.com', 'Super Administrador', 5),
('director', 'director123', 'direccion@empresa.com', 'Juan Carlos Mendez - Director', 6);

-- =====================================================
-- 2. TABLAS DE RECURSOS HUMANOS
-- =====================================================

CREATE TABLE recurso (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    costo_por_hora DECIMAL(10,2) NOT NULL CHECK (costo_por_hora >= 0),
    especialidad VARCHAR(100),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO recurso (nombre, cargo, costo_por_hora, especialidad, email) VALUES
('Carlos Paez', 'Analista de Seguridad Senior', 50.00, 'Respuesta a incidentes', 'carlos.paez@seguridad.com'),
('Laura Gomez', 'Analista de Seguridad Junior', 30.00, 'Monitoreo SOC', 'laura.gomez@seguridad.com'),
('Miguel Torres', 'Arquitecto de Seguridad', 80.00, 'Infraestructura', 'miguel.torres@seguridad.com'),
('Ana Martinez', 'Coordinadora SOC', 60.00, 'Gestion de incidentes', 'ana.martinez@seguridad.com'),
('Roberto Diaz', 'Especialista Forense', 100.00, 'Analisis forense digital', 'roberto.diaz@seguridad.com'),
('Sofia Ramirez', 'Ingeniera de Seguridad', 70.00, 'Pentesting', 'sofia.ramirez@seguridad.com'),
('Julian Castro', 'Administrador de SIEM', 55.00, 'Monitoreo avanzado', 'julian.castro@seguridad.com');

-- =====================================================
-- 3. TABLAS DE INCIDENTES
-- =====================================================

CREATE TABLE prioridad (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL UNIQUE,
    nivel INT NOT NULL,
    color VARCHAR(20),
    tiempo_resolucion_esperado_horas INT
);

INSERT INTO prioridad (nombre, nivel, color, tiempo_resolucion_esperado_horas) VALUES
('Baja', 1, 'green', 48),
('Media', 2, 'yellow', 24),
('Alta', 3, 'orange', 8),
('Critica', 4, 'red', 2);

CREATE TABLE estado (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    descripcion VARCHAR(100),
    color VARCHAR(20)
);

INSERT INTO estado (nombre, descripcion, color) VALUES
('Nuevo', 'Incidente recien reportado', 'gray'),
('EnAnalisis', 'Equipo analizando el incidente', 'blue'),
('EnContencion', 'Acciones para contener el incidente', 'purple'),
('Resuelto', 'Incidente resuelto exitosamente', 'green'),
('Cerrado', 'Incidente cerrado y documentado', 'gray'),
('Escalado', 'Requiere intervencion de nivel superior', 'red'),
('EnRevision', 'En revision por supervisores', 'yellow');

CREATE TABLE incidente (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad_id BIGINT NOT NULL,
    estado_id BIGINT NOT NULL,
    costo_estimado DECIMAL(12,2) NOT NULL CHECK (costo_estimado > 0),
    ingresos DECIMAL(12,2) DEFAULT 0.00,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP NULL,
    fecha_cierre TIMESTAMP NULL,
    creado_por_usuario_id BIGINT NOT NULL,
    resuelto_por_usuario_id BIGINT NULL,
    cliente VARCHAR(150),
    sistema_afectado VARCHAR(200),
    descripcion_tecnica TEXT,
    lecciones_aprendidas TEXT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (prioridad_id) REFERENCES prioridad(id),
    FOREIGN KEY (estado_id) REFERENCES estado(id),
    FOREIGN KEY (creado_por_usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (resuelto_por_usuario_id) REFERENCES usuario(id)
);

-- =====================================================
-- 4. TABLAS DE CONTROL FINANCIERO
-- =====================================================

CREATE TABLE hora_trabajada (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    incidente_id BIGINT NOT NULL,
    recurso_id BIGINT NOT NULL,
    usuario_registra_id BIGINT NOT NULL,
    horas DECIMAL(8,2) NOT NULL CHECK (horas > 0 AND horas <= 24),
    fecha_trabajo DATE NOT NULL,
    descripcion VARCHAR(200),
    facturable BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incidente_id) REFERENCES incidente(id) ON DELETE CASCADE,
    FOREIGN KEY (recurso_id) REFERENCES recurso(id),
    FOREIGN KEY (usuario_registra_id) REFERENCES usuario(id)
);

CREATE TABLE costo_extra (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    incidente_id BIGINT NOT NULL,
    usuario_registra_id BIGINT NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    monto DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    fecha DATE NOT NULL,
    proveedor VARCHAR(150),
    documento_soporte VARCHAR(255),
    categoria VARCHAR(50) DEFAULT 'Otros',
    facturable BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incidente_id) REFERENCES incidente(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_registra_id) REFERENCES usuario(id)
);

-- =====================================================
-- 5. TABLAS DE AUDITORIA
-- =====================================================

CREATE TABLE auditoria_financiera (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    incidente_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    tipo_cambio VARCHAR(50) NOT NULL,
    detalle TEXT,
    valor_afectado DECIMAL(12,2),
    registro_anterior TEXT,
    registro_nuevo TEXT,
    ip_address VARCHAR(45),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incidente_id) REFERENCES incidente(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE cambio_estado (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    incidente_id BIGINT NOT NULL,
    estado_anterior_id BIGINT NOT NULL,
    estado_nuevo_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    comentario TEXT,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (incidente_id) REFERENCES incidente(id) ON DELETE CASCADE,
    FOREIGN KEY (estado_anterior_id) REFERENCES estado(id),
    FOREIGN KEY (estado_nuevo_id) REFERENCES estado(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- =====================================================
-- 6. VISTAS
-- =====================================================


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
    COALESCE(SUM(h.horas * r.costo_por_hora), 0) AS costo_mano_obra,
    COALESCE(SUM(ce.monto), 0) AS costo_extras,
    (COALESCE(SUM(h.horas * r.costo_por_hora), 0) + COALESCE(SUM(ce.monto), 0)) AS costo_real,
    i.fecha_creacion,
    i.fecha_resolucion,
    i.fecha_cierre,
    i.cliente,
    i.sistema_afectado,
    u.nombre_completo AS creado_por,
    TIMESTAMPDIFF(HOUR, i.fecha_creacion, 
        COALESCE(i.fecha_resolucion, i.fecha_cierre, NOW())) AS horas_para_resolucion
FROM incidente i
INNER JOIN prioridad p ON i.prioridad_id = p.id
INNER JOIN estado e ON i.estado_id = e.id
INNER JOIN usuario u ON i.creado_por_usuario_id = u.id
LEFT JOIN hora_trabajada h ON i.id = h.incidente_id
LEFT JOIN recurso r ON h.recurso_id = r.id
LEFT JOIN costo_extra ce ON i.id = ce.incidente_id
GROUP BY i.id, i.titulo, i.descripcion, p.nombre, p.nivel, p.color, 
         e.nombre, e.color, i.costo_estimado, i.ingresos, i.fecha_creacion,
         i.fecha_resolucion, i.fecha_cierre, i.cliente, i.sistema_afectado,
         u.nombre_completo;
        
CREATE VIEW vista_kpi_financiero AS
SELECT 
    i.id,
    i.titulo,
    i.costo_estimado,
    (COALESCE(SUM(h.horas * r.costo_por_hora), 0) + COALESCE(SUM(ce.monto), 0)) AS costo_real,
    i.ingresos,
    ((COALESCE(SUM(h.horas * r.costo_por_hora), 0) + COALESCE(SUM(ce.monto), 0)) - i.costo_estimado) AS desviacion_absoluta,
    ROUND(((COALESCE(SUM(h.horas * r.costo_por_hora), 0) + COALESCE(SUM(ce.monto), 0)) - i.costo_estimado) / i.costo_estimado * 100, 2) AS desviacion_porcentual,
    (i.ingresos - (COALESCE(SUM(h.horas * r.costo_por_hora), 0) + COALESCE(SUM(ce.monto), 0))) AS margen_absoluto,
    ROUND((i.ingresos - (COALESCE(SUM(h.horas * r.costo_por_hora), 0) + COALESCE(SUM(ce.monto), 0))) / i.ingresos * 100, 2) AS margen_porcentual
FROM incidente i
LEFT JOIN hora_trabajada h ON i.id = h.incidente_id
LEFT JOIN recurso r ON h.recurso_id = r.id
LEFT JOIN costo_extra ce ON i.id = ce.incidente_id
GROUP BY i.id, i.titulo, i.costo_estimado, i.ingresos;

-- =====================================================
-- 7. DATOS DE PRUEBA (10 INCIDENTES)
-- =====================================================

INSERT INTO incidente (titulo, descripcion, prioridad_id, estado_id, costo_estimado, ingresos, creado_por_usuario_id, cliente, sistema_afectado) VALUES
('Ataque de phishing masivo', 'Multiples usuarios reportaron correos sospechosos con enlaces maliciosos.', 
 (SELECT id FROM prioridad WHERE nombre = 'Alta'), (SELECT id FROM estado WHERE nombre = 'Resuelto'), 1200.00, 2500.00, 2, 'TechCorp S.A.', 'Correo Corporativo'),

('Ransomware en servidor critico', 'Servidor de base de datos principal infectado con ransomware.', 
 (SELECT id FROM prioridad WHERE nombre = 'Critica'), (SELECT id FROM estado WHERE nombre = 'Resuelto'), 5000.00, 15000.00, 2, 'Finanzas Global', 'Servidor BD Principal'),

('Fuga de datos confidenciales', 'Posible exposicion de informacion de clientes debido a una API mal configurada.', 
 (SELECT id FROM prioridad WHERE nombre = 'Critica'), (SELECT id FROM estado WHERE nombre = 'EnAnalisis'), 3500.00, 8000.00, 3, 'DataSecure', 'API Gateway'),

('Intento de fuerza bruta', 'Multiples intentos fallidos de login al panel administrativo.', 
 (SELECT id FROM prioridad WHERE nombre = 'Media'), (SELECT id FROM estado WHERE nombre = 'Cerrado'), 500.00, 1000.00, 4, 'PyME Digital', 'Panel Admin'),

('Malware en estacion de trabajo', 'Equipo de contabilidad presenta comportamiento anomalo.', 
 (SELECT id FROM prioridad WHERE nombre = 'Alta'), (SELECT id FROM estado WHERE nombre = 'Nuevo'), 800.00, 1500.00, 2, 'Contabilidad Plus', 'Estacion de trabajo'),

('Configuracion incorrecta de firewall', 'Reglas de firewall mal aplicadas causaron caida de servicios.', 
 (SELECT id FROM prioridad WHERE nombre = 'Baja'), (SELECT id FROM estado WHERE nombre = 'Resuelto'), 400.00, 800.00, 3, 'ISP Regional', 'Firewall Corporativo'),

('Vulnerabilidad critica sin parche', 'Se detecto vulnerabilidad CVE-2024-1234 en servidores web.', 
 (SELECT id FROM prioridad WHERE nombre = 'Alta'), (SELECT id FROM estado WHERE nombre = 'EnAnalisis'), 2000.00, 4000.00, 2, 'WebHosting', 'Servidores Web'),

('Ataque DDoS masivo', 'Ataque de denegacion de servicio distribuido.', 
 (SELECT id FROM prioridad WHERE nombre = 'Critica'), (SELECT id FROM estado WHERE nombre = 'Nuevo'), 4000.00, 12000.00, 4, 'E-commerce Express', 'Infraestructura Cloud'),

('Ingenieria social a empleado', 'Empleado del area de RH compartio credenciales por telefono.', 
 (SELECT id FROM prioridad WHERE nombre = 'Media'), (SELECT id FROM estado WHERE nombre = 'Resuelto'), 600.00, 1200.00, 3, 'Empresa Segura', 'Active Directory'),

('Perdida de laptop corporativa', 'Laptop de gerente financiero extraviada con datos sensibles.', 
 (SELECT id FROM prioridad WHERE nombre = 'Alta'), (SELECT id FROM estado WHERE nombre = 'EnAnalisis'), 2500.00, 5000.00, 2, 'Finanzas', 'Endpoint Management');

UPDATE incidente SET fecha_resolucion = DATE_ADD(fecha_creacion, INTERVAL 4 HOUR) WHERE titulo LIKE '%phishing%';
UPDATE incidente SET fecha_resolucion = DATE_ADD(fecha_creacion, INTERVAL 12 HOUR) WHERE titulo LIKE '%Ransomware%';
UPDATE incidente SET fecha_resolucion = DATE_ADD(fecha_creacion, INTERVAL 2 HOUR) WHERE titulo LIKE '%firewall%';
UPDATE incidente SET fecha_resolucion = DATE_ADD(fecha_creacion, INTERVAL 3 HOUR) WHERE titulo LIKE '%ingenieria%';

INSERT INTO hora_trabajada (incidente_id, recurso_id, usuario_registra_id, horas, fecha_trabajo, descripcion) VALUES
(1, 1, 2, 4.0, '2026-04-01', 'Analisis inicial y clasificacion'),
(1, 2, 2, 2.0, '2026-04-01', 'Bloqueo de dominios maliciosos'),
(2, 1, 2, 8.0, '2026-04-03', 'Analisis del ransomware'),
(2, 3, 2, 4.0, '2026-04-03', 'Restauracion de servidores'),
(2, 5, 2, 6.0, '2026-04-04', 'Analisis forense'),
(6, 2, 3, 1.0, '2026-04-07', 'Correccion de reglas de firewall'),
(9, 2, 3, 2.0, '2026-04-08', 'Rotacion de contrasenas');

INSERT INTO costo_extra (incidente_id, usuario_registra_id, concepto, monto, fecha, proveedor, categoria) VALUES
(2, 5, 'Licencia de herramienta de desencriptacion', 2500.00, '2026-04-04', 'Emsisoft', 'Herramientas'),
(3, 5, 'Herramienta de monitoreo de APIs', 1200.00, '2026-04-06', 'APIsec', 'Herramientas'),
(7, 5, 'Servicio de scanning de vulnerabilidades', 800.00, '2026-04-10', 'Tenable', 'ServiciosExternos');

