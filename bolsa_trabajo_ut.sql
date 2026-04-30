-- ============================================================
--  BOLSA DE TRABAJO UT DE LA COSTA
--  Base de datos PostgreSQL 16
--  Hackathon DITI 2026
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- 1. CATÁLOGO DE CARRERAS
-- ============================================================
CREATE TABLE catalogo_carreras (
    carrera_id              SMALLINT        PRIMARY KEY,
    codigo_correo           CHAR(2)         NOT NULL UNIQUE,
    nombre                  VARCHAR(80)     NOT NULL,
    tiene_prueba_tecnica    BOOLEAN         NOT NULL DEFAULT FALSE,
    activa                  BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_carrera_id CHECK (carrera_id BETWEEN 1 AND 99)
);

COMMENT ON TABLE  catalogo_carreras IS 'Catálogo de carreras de la UT de la Costa';
COMMENT ON COLUMN catalogo_carreras.carrera_id IS '01=Admin, 02=Agrobiotec, 03=Mercadotecnia, 04=Proc.Alimentarios, 05=TI, 06=Acuicultura, 07=Turismo, 08=Gastronomia, 09=Contaduria';
COMMENT ON COLUMN catalogo_carreras.codigo_correo IS 'Codigo de 2 dígitos usado en el correo institucional (ej. 01 para Admin)';
COMMENT ON COLUMN catalogo_carreras.tiene_prueba_tecnica IS 'TRUE solo para carrera_id 01 (Admin) y 05 (TI) en esta fase del proyecto';

INSERT INTO catalogo_carreras (carrera_id, codigo_correo, nombre, tiene_prueba_tecnica) VALUES
    (1,  '01', 'Administración',         TRUE),
    (2,  '02', 'Agrobiotecnología',       FALSE),
    (3,  '03', 'Mercadotecnia',           FALSE),
    (4,  '04', 'Procesos Alimentarios',   FALSE),
    (5,  '05', 'Tecnologías de la Información', TRUE),
    (6,  '06', 'Acuicultura',             FALSE),
    (7,  '07', 'Turismo',                 FALSE),
    (8,  '08', 'Gastronomía',             FALSE),
    (9,  '09', 'Contaduría',              FALSE);


-- ============================================================
-- 2. ALUMNOS (EGRESADOS)
-- ============================================================
CREATE TABLE alumnos (
    alumno_id                   SERIAL          PRIMARY KEY,

    -- Datos del SIEst 2.0 (obtenidos via endpoint, almacenados localmente)
    cve_alumno                  VARCHAR(30)     NOT NULL UNIQUE,
    matricula                   VARCHAR(20)     NOT NULL UNIQUE,   -- nombre_usuario para login
    nombre                      VARCHAR(80)     NOT NULL,
    apellido_paterno            VARCHAR(60)     NOT NULL,
    apellido_materno            VARCHAR(60),
    carrera_id                  SMALLINT        NOT NULL REFERENCES catalogo_carreras(carrera_id),
    periodo_egreso              DATE            NOT NULL,
    foto_url                    TEXT,                              -- URL en Google Drive

    -- Contacto y acceso
    correo_institucional        VARCHAR(120)    NOT NULL UNIQUE,   -- alXX-XXX-XXXX@utdelacosta.edu.mx
    correo_alternativo          VARCHAR(120),
    contrasena_hash             VARCHAR(255)    NOT NULL,

    -- 2FA
    totp_secreto                VARCHAR(100),
    totp_activo                 BOOLEAN         NOT NULL DEFAULT TRUE,

    -- Perfil adicional (actualizable)
    cv_drive_url                TEXT,                              -- URL en Google Drive
    telefono                    VARCHAR(20),
    linkedin_url                VARCHAR(255),
    disponibilidad              VARCHAR(20)     NOT NULL DEFAULT 'activo'
                                    CHECK (disponibilidad IN ('activo','no_disponible','contratado')),

    -- Control de sincronización con SIEst
    datos_siest_sync_at         TIMESTAMP,
    perfil_actualizado_at       TIMESTAMP,

    -- Estado de cuenta
    activo                      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    -- Validaciones de correo institucional
    CONSTRAINT chk_correo_institucional
        CHECK (correo_institucional ~ '^al[0-9]{2}-[0-9]{3}-[0-9]{4}@utdelacosta\.edu\.mx$')
);

COMMENT ON TABLE  alumnos IS 'Egresados registrados en la plataforma. Los datos del SIEst se almacenan localmente para evitar sobrecargar sus servidores.';
COMMENT ON COLUMN alumnos.cve_alumno IS 'Clave única del SIEst 2.0. Se usa para consultar el endpoint. DISTINTA de la matrícula.';
COMMENT ON COLUMN alumnos.matricula IS 'Nombre de usuario para el login. Formato: alXX-XXX-XXXX. Mismo que el prefijo del correo institucional.';
COMMENT ON COLUMN alumnos.periodo_egreso IS 'Fecha de egreso. Los ingresos son siempre el 1 de septiembre. Plan 2023: 3 años 8 meses. Plan 2024+: 3 años 4 meses.';
COMMENT ON COLUMN alumnos.foto_url IS 'URL de la foto almacenada en Google Drive. No se guarda el archivo en la BD.';
COMMENT ON COLUMN alumnos.cv_drive_url IS 'URL del CV almacenado en Google Drive.';


-- ============================================================
-- 3. EMPRESAS
-- ============================================================
CREATE TABLE empresas (
    empresa_id                  SERIAL          PRIMARY KEY,

    -- Datos de registro (verificación anti-duplicados por correo + RFC)
    nombre                      VARCHAR(120)    NOT NULL,
    correo                      VARCHAR(120)    NOT NULL UNIQUE,
    rfc                         VARCHAR(13)     NOT NULL UNIQUE,
    contrasena_hash             VARCHAR(255)    NOT NULL,

    -- Contacto
    telefono                    VARCHAR(20),
    sitio_web                   VARCHAR(255),
    sector                      VARCHAR(80),

    -- Ubicación
    pais                        VARCHAR(60)     NOT NULL DEFAULT 'México',
    estado                      VARCHAR(60)     NOT NULL,
    municipio                   VARCHAR(80)     NOT NULL,
    zona_norte_nayarit          BOOLEAN         NOT NULL DEFAULT FALSE,

    -- Convenio
    estatus_convenio            VARCHAR(25)     NOT NULL DEFAULT 'sin_convenio'
                                    CHECK (estatus_convenio IN (
                                        'activo','pendiente_formalizacion',
                                        'por_vencer','sin_convenio','vencido'
                                    )),
    convenio_fecha_inicio       DATE,
    convenio_fecha_vencimiento  DATE,

    -- Estado de cuenta
    activo                      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_rfc_formato CHECK (LENGTH(rfc) BETWEEN 12 AND 13),
    CONSTRAINT chk_convenio_fechas CHECK (
        convenio_fecha_vencimiento IS NULL OR
        convenio_fecha_vencimiento > convenio_fecha_inicio
    )
);

COMMENT ON TABLE  empresas IS 'Empresas registradas en la plataforma. Se verifica RFC + correo antes de dar de alta para evitar duplicados.';
COMMENT ON COLUMN empresas.zona_norte_nayarit IS 'TRUE si la empresa opera en la zona norte del estado de Nayarit. Esto determina el convenio automático.';
COMMENT ON COLUMN empresas.estatus_convenio IS 'activo: con convenio vigente. pendiente_formalizacion: egresado marcó contratación pero aún sin convenio formal. por_vencer: convenio próximo a expirar. sin_convenio: empresa fuera de zona norte sin contrataciones confirmadas.';


-- ============================================================
-- 4. VACANTES
-- ============================================================
CREATE TABLE vacantes (
    vacante_id                  SERIAL          PRIMARY KEY,
    empresa_id                  INTEGER         REFERENCES empresas(empresa_id) ON DELETE SET NULL,

    -- Descripción del puesto
    titulo                      VARCHAR(120)    NOT NULL,
    descripcion                 TEXT            NOT NULL,
    area_especialidad           VARCHAR(80),
    carrera_preferente          SMALLINT        REFERENCES catalogo_carreras(carrera_id),
    salario_min                 NUMERIC(10,2),
    salario_max                 NUMERIC(10,2),
    tipo_contrato               VARCHAR(30)     CHECK (tipo_contrato IN (
                                    'tiempo_completo','medio_tiempo','por_proyecto',
                                    'practicas','servicio_social'
                                )),

    -- Ubicación
    ubicacion_estado            VARCHAR(60)     NOT NULL,
    ubicacion_municipio         VARCHAR(80),

    -- Perfil idóneo (benchmark por dimensión — empresa lo define, 0-100)
    benchmark_psicometrico      SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_psicometrico BETWEEN 0 AND 100),
    benchmark_cognitivo         SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_cognitivo    BETWEEN 0 AND 100),
    benchmark_tecnico           SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_tecnico      BETWEEN 0 AND 100),
    benchmark_proyectivo        SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_proyectivo   BETWEEN 0 AND 100),

    -- Origen de la vacante
    fuente                      VARCHAR(15)     NOT NULL DEFAULT 'local'
                                    CHECK (fuente IN ('local','api_nacional')),
    ref_api_externa             VARCHAR(100),   -- ID en la API nacional (si fuente = api_nacional)

    -- Estado
    estatus                     VARCHAR(15)     NOT NULL DEFAULT 'activa'
                                    CHECK (estatus IN ('activa','cerrada','pausada')),
    fecha_publicacion           DATE            NOT NULL DEFAULT CURRENT_DATE,
    fecha_cierre                DATE,

    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_salario CHECK (salario_max IS NULL OR salario_max >= salario_min),
    CONSTRAINT chk_fecha_cierre CHECK (fecha_cierre IS NULL OR fecha_cierre >= fecha_publicacion)
);

COMMENT ON TABLE  vacantes IS 'Ofertas de trabajo: locales (empresa registrada) o nacionales (importadas via API externa).';
COMMENT ON COLUMN vacantes.benchmark_psicometrico IS 'Puntaje mínimo requerido en prueba psicométrica. La empresa define este valor al crear la vacante.';
COMMENT ON COLUMN vacantes.fuente IS 'local = publicada por empresa registrada en la plataforma. api_nacional = importada de la API externa.';
COMMENT ON COLUMN vacantes.ref_api_externa IS 'Identificador de la vacante en el servicio de API nacional. NULL si es vacante local.';


-- ============================================================
-- 5. RESULTADOS DE PRUEBAS
-- (Una fila por alumno. Las pruebas son irrepetibles.)
-- ============================================================
CREATE TABLE resultados_pruebas (
    resultado_id                SERIAL          PRIMARY KEY,
    alumno_id                   INTEGER         NOT NULL UNIQUE REFERENCES alumnos(alumno_id) ON DELETE CASCADE,

    -- Prueba 1: Psicométrica
    puntaje_psicometrico        SMALLINT        CHECK (puntaje_psicometrico BETWEEN 0 AND 100),
    psicometrico_completado_at  TIMESTAMP,

    -- Prueba 2: Cognitiva
    puntaje_cognitivo           SMALLINT        CHECK (puntaje_cognitivo BETWEEN 0 AND 100),
    cognitivo_completado_at     TIMESTAMP,

    -- Prueba 3: Técnica (solo carreras con tiene_prueba_tecnica = TRUE)
    puntaje_tecnico             SMALLINT        CHECK (puntaje_tecnico BETWEEN 0 AND 100),
    tecnico_completado_at       TIMESTAMP,

    -- Prueba 4: Proyectiva
    puntaje_proyectivo          SMALLINT        CHECK (puntaje_proyectivo BETWEEN 0 AND 100),
    proyectivo_completado_at    TIMESTAMP,

    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  resultados_pruebas IS 'Puntajes de las 4 baterías de pruebas. Un único registro por alumno. Las pruebas son irrepetibles y se aplican al momento del registro.';
COMMENT ON COLUMN resultados_pruebas.puntaje_tecnico IS 'NULL si la carrera del alumno no tiene prueba técnica implementada (solo Admin=01 y TI=05 en esta fase).';


-- ============================================================
-- 6. POSTULACIONES
-- ============================================================
CREATE TABLE postulaciones (
    postulacion_id              SERIAL          PRIMARY KEY,
    alumno_id                   INTEGER         NOT NULL REFERENCES alumnos(alumno_id) ON DELETE CASCADE,
    vacante_id                  INTEGER         NOT NULL REFERENCES vacantes(vacante_id) ON DELETE CASCADE,

    -- Motor de coincidencia
    porcentaje_coincidencia     NUMERIC(5,2)    NOT NULL DEFAULT 0.00
                                    CHECK (porcentaje_coincidencia BETWEEN 0 AND 100),

    -- Flujo de selección
    estatus                     VARCHAR(20)     NOT NULL DEFAULT 'postulado'
                                    CHECK (estatus IN (
                                        'postulado','en_revision','seleccionado',
                                        'descartado','contratado'
                                    )),

    -- Confirmación de contratación (activa flujo de convenio para empresas externas)
    contratado_confirmado       BOOLEAN         NOT NULL DEFAULT FALSE,
    contratado_confirmado_at    TIMESTAMP,

    -- Comunicación
    mensaje_inicial             TEXT,           -- Primer mensaje al postularse

    fecha_postulacion           TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_alumno_vacante UNIQUE (alumno_id, vacante_id)
);

COMMENT ON TABLE  postulaciones IS 'Registro de cada postulación de un egresado a una vacante. Incluye el % de coincidencia calculado al momento de postularse.';
COMMENT ON COLUMN postulaciones.porcentaje_coincidencia IS 'Calculado comparando los 4 puntajes del alumno contra los 4 benchmarks de la vacante. Umbral de relevancia: 80%.';
COMMENT ON COLUMN postulaciones.contratado_confirmado IS 'TRUE cuando el egresado confirma en la plataforma que fue contratado. Esto activa la lógica de convenio pendiente si la empresa es nacional.';


-- ============================================================
-- 7. MENSAJES (comunicación bidireccional)
-- ============================================================
CREATE TABLE mensajes (
    mensaje_id                  SERIAL          PRIMARY KEY,
    postulacion_id              INTEGER         NOT NULL REFERENCES postulaciones(postulacion_id) ON DELETE CASCADE,

    -- Emisor: puede ser alumno o empresa
    emisor_tipo                 VARCHAR(10)     NOT NULL CHECK (emisor_tipo IN ('alumno','empresa')),
    emisor_alumno_id            INTEGER         REFERENCES alumnos(alumno_id)  ON DELETE SET NULL,
    emisor_empresa_id           INTEGER         REFERENCES empresas(empresa_id) ON DELETE SET NULL,

    contenido                   TEXT            NOT NULL,
    leido                       BOOLEAN         NOT NULL DEFAULT FALSE,
    leido_at                    TIMESTAMP,

    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_emisor_coherente CHECK (
        (emisor_tipo = 'alumno'  AND emisor_alumno_id  IS NOT NULL AND emisor_empresa_id IS NULL) OR
        (emisor_tipo = 'empresa' AND emisor_empresa_id IS NOT NULL AND emisor_alumno_id  IS NULL)
    )
);

COMMENT ON TABLE mensajes IS 'Mensajes de la comunicación bidireccional dentro de una postulación. Empresa puede contactar egresado y viceversa.';


-- ============================================================
-- 8. CERTIFICADOS DEL ALUMNO
-- ============================================================
CREATE TABLE certificados_alumno (
    certificado_id              SERIAL          PRIMARY KEY,
    alumno_id                   INTEGER         NOT NULL REFERENCES alumnos(alumno_id) ON DELETE CASCADE,

    nombre_certificado          VARCHAR(120)    NOT NULL,
    institucion_emisora         VARCHAR(120),
    fecha_emision               DATE,
    archivo_drive_url           TEXT            NOT NULL,  -- URL en Google Drive
    validado                    BOOLEAN         NOT NULL DEFAULT FALSE,
    validado_at                 TIMESTAMP,

    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  certificados_alumno IS 'Certificaciones y títulos del egresado. Los archivos se almacenan en Google Drive, la BD solo guarda la URL.';


-- ============================================================
-- 9. HISTORIAL DE CONVENIOS
-- ============================================================
CREATE TABLE historial_convenios (
    convenio_id                 SERIAL          PRIMARY KEY,
    empresa_id                  INTEGER         NOT NULL REFERENCES empresas(empresa_id) ON DELETE CASCADE,

    tipo_origen                 VARCHAR(30)     NOT NULL
                                    CHECK (tipo_origen IN (
                                        'automatico_zona_norte',
                                        'contratacion_egresado',
                                        'gestion_manual'
                                    )),
    postulacion_id              INTEGER         REFERENCES postulaciones(postulacion_id) ON DELETE SET NULL,

    estatus                     VARCHAR(30)     NOT NULL DEFAULT 'pendiente_formalizacion'
                                    CHECK (estatus IN (
                                        'activo','vencido',
                                        'pendiente_formalizacion','rechazado'
                                    )),

    fecha_inicio                DATE,
    fecha_vencimiento           DATE,

    -- Administrador que gestionó el convenio
    gestionado_por_admin        VARCHAR(80),
    notas                       TEXT,

    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_convenio_fechas CHECK (
        fecha_vencimiento IS NULL OR
        fecha_vencimiento > fecha_inicio
    )
);

COMMENT ON TABLE  historial_convenios IS 'Registro de todos los eventos de convenio. automatico_zona_norte: empresa zona norte Nayarit. contratacion_egresado: egresado marcó contratación en empresa nacional. gestion_manual: la administración UT lo gestionó directamente.';


-- ============================================================
-- 10. SESIONES / TOKENS (recuperación de contraseña y 2FA)
-- ============================================================
CREATE TABLE tokens_acceso (
    token_id                    SERIAL          PRIMARY KEY,
    tipo                        VARCHAR(20)     NOT NULL
                                    CHECK (tipo IN (
                                        'recuperacion_password',
                                        'verificacion_2fa',
                                        'verificacion_correo'
                                    )),

    -- El token aplica a alumno O empresa (nunca ambos)
    alumno_id                   INTEGER         REFERENCES alumnos(alumno_id)   ON DELETE CASCADE,
    empresa_id                  INTEGER         REFERENCES empresas(empresa_id) ON DELETE CASCADE,

    token_hash                  VARCHAR(255)    NOT NULL UNIQUE,
    expira_at                   TIMESTAMP       NOT NULL,
    usado                       BOOLEAN         NOT NULL DEFAULT FALSE,
    usado_at                    TIMESTAMP,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_token_un_propietario CHECK (
        (alumno_id IS NOT NULL AND empresa_id IS NULL) OR
        (alumno_id IS NULL AND empresa_id IS NOT NULL)
    )
);

COMMENT ON TABLE tokens_acceso IS 'Tokens temporales para recuperación de contraseña, verificación de correo y segundo factor de autenticación.';


-- ============================================================
-- ÍNDICES
-- ============================================================

-- alumnos
CREATE INDEX idx_alumnos_carrera       ON alumnos(carrera_id);
CREATE INDEX idx_alumnos_periodo       ON alumnos(periodo_egreso);
CREATE INDEX idx_alumnos_disponibilidad ON alumnos(disponibilidad);

-- empresas
CREATE INDEX idx_empresas_zona         ON empresas(zona_norte_nayarit);
CREATE INDEX idx_empresas_convenio     ON empresas(estatus_convenio);
CREATE INDEX idx_empresas_estado       ON empresas(estado);

-- vacantes
CREATE INDEX idx_vacantes_empresa      ON vacantes(empresa_id);
CREATE INDEX idx_vacantes_estatus      ON vacantes(estatus);
CREATE INDEX idx_vacantes_fuente       ON vacantes(fuente);
CREATE INDEX idx_vacantes_carrera      ON vacantes(carrera_preferente);
CREATE INDEX idx_vacantes_estado       ON vacantes(ubicacion_estado);

-- postulaciones
CREATE INDEX idx_postulaciones_alumno  ON postulaciones(alumno_id);
CREATE INDEX idx_postulaciones_vacante ON postulaciones(vacante_id);
CREATE INDEX idx_postulaciones_estatus ON postulaciones(estatus);
CREATE INDEX idx_postulaciones_coinc   ON postulaciones(porcentaje_coincidencia DESC);

-- mensajes
CREATE INDEX idx_mensajes_postulacion  ON mensajes(postulacion_id);
CREATE INDEX idx_mensajes_leido        ON mensajes(leido);

-- resultados_pruebas
CREATE INDEX idx_pruebas_alumno        ON resultados_pruebas(alumno_id);

-- certificados
CREATE INDEX idx_cert_alumno           ON certificados_alumno(alumno_id);
CREATE INDEX idx_cert_validado         ON certificados_alumno(validado);

-- historial_convenios
CREATE INDEX idx_conv_empresa          ON historial_convenios(empresa_id);
CREATE INDEX idx_conv_estatus          ON historial_convenios(estatus);
CREATE INDEX idx_conv_tipo             ON historial_convenios(tipo_origen);

-- tokens
CREATE INDEX idx_tokens_hash           ON tokens_acceso(token_hash);
CREATE INDEX idx_tokens_expira         ON tokens_acceso(expira_at);


-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================

-- Trigger: updated_at automático
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_alumnos_updated_at
    BEFORE UPDATE ON alumnos
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_empresas_updated_at
    BEFORE UPDATE ON empresas
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_vacantes_updated_at
    BEFORE UPDATE ON vacantes
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_postulaciones_updated_at
    BEFORE UPDATE ON postulaciones
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_convenios_updated_at
    BEFORE UPDATE ON historial_convenios
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_pruebas_updated_at
    BEFORE UPDATE ON resultados_pruebas
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();


-- Función: calcular % de coincidencia entre alumno y vacante
-- Considera solo dimensiones con benchmark > 0 para no penalizar
-- dimensiones no requeridas por la empresa.
CREATE OR REPLACE FUNCTION fn_calcular_coincidencia(
    p_alumno_id  INTEGER,
    p_vacante_id INTEGER
)
RETURNS NUMERIC AS $$
DECLARE
    v_prueba        resultados_pruebas%ROWTYPE;
    v_vacante       vacantes%ROWTYPE;
    total_peso      NUMERIC := 0;
    total_puntaje   NUMERIC := 0;
BEGIN
    SELECT * INTO v_prueba  FROM resultados_pruebas WHERE alumno_id  = p_alumno_id;
    SELECT * INTO v_vacante FROM vacantes            WHERE vacante_id = p_vacante_id;

    IF NOT FOUND THEN RETURN 0; END IF;

    -- Psicométrica
    IF v_vacante.benchmark_psicometrico > 0 THEN
        total_peso    := total_peso + 1;
        total_puntaje := total_puntaje +
            LEAST(COALESCE(v_prueba.puntaje_psicometrico, 0)::NUMERIC / v_vacante.benchmark_psicometrico, 1);
    END IF;

    -- Cognitiva
    IF v_vacante.benchmark_cognitivo > 0 THEN
        total_peso    := total_peso + 1;
        total_puntaje := total_puntaje +
            LEAST(COALESCE(v_prueba.puntaje_cognitivo, 0)::NUMERIC / v_vacante.benchmark_cognitivo, 1);
    END IF;

    -- Técnica
    IF v_vacante.benchmark_tecnico > 0 THEN
        total_peso    := total_peso + 1;
        total_puntaje := total_puntaje +
            LEAST(COALESCE(v_prueba.puntaje_tecnico, 0)::NUMERIC / v_vacante.benchmark_tecnico, 1);
    END IF;

    -- Proyectiva
    IF v_vacante.benchmark_proyectivo > 0 THEN
        total_peso    := total_peso + 1;
        total_puntaje := total_puntaje +
            LEAST(COALESCE(v_prueba.puntaje_proyectivo, 0)::NUMERIC / v_vacante.benchmark_proyectivo, 1);
    END IF;

    IF total_peso = 0 THEN RETURN 0; END IF;

    RETURN ROUND((total_puntaje / total_peso) * 100, 2);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_calcular_coincidencia IS 'Calcula el porcentaje de coincidencia entre un egresado y una vacante comparando sus 4 puntajes contra los benchmarks. Solo considera dimensiones con benchmark > 0. Retorna 0-100.';


-- Trigger: al confirmar contratación, actualizar convenio de empresa nacional
CREATE OR REPLACE FUNCTION fn_postulacion_contratado()
RETURNS TRIGGER AS $$
DECLARE
    v_empresa empresas%ROWTYPE;
    v_vacante vacantes%ROWTYPE;
BEGIN
    IF NEW.contratado_confirmado = TRUE AND OLD.contratado_confirmado = FALSE THEN
        SELECT v.*, e.* INTO v_vacante
        FROM vacantes v
        WHERE v.vacante_id = NEW.vacante_id;

        SELECT * INTO v_empresa
        FROM empresas e
        WHERE e.empresa_id = v_vacante.empresa_id;

        -- Solo activa flujo de convenio para empresas fuera de zona norte
        IF v_empresa.zona_norte_nayarit = FALSE THEN
            UPDATE empresas
               SET estatus_convenio = 'pendiente_formalizacion',
                   updated_at       = NOW()
             WHERE empresa_id = v_empresa.empresa_id
               AND estatus_convenio = 'sin_convenio';

            INSERT INTO historial_convenios (
                empresa_id, tipo_origen, postulacion_id, estatus
            ) VALUES (
                v_empresa.empresa_id,
                'contratacion_egresado',
                NEW.postulacion_id,
                'pendiente_formalizacion'
            );
        END IF;

        -- Actualizar disponibilidad del alumno
        UPDATE alumnos
           SET disponibilidad = 'contratado', updated_at = NOW()
         WHERE alumno_id = NEW.alumno_id;

        NEW.contratado_confirmado_at = NOW();
        NEW.estatus = 'contratado';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_postulacion_contratado
    BEFORE UPDATE ON postulaciones
    FOR EACH ROW EXECUTE FUNCTION fn_postulacion_contratado();

COMMENT ON FUNCTION fn_postulacion_contratado IS 'Al confirmar contratación: si la empresa es nacional (zona_norte_nayarit = FALSE), actualiza su estatus a pendiente_formalizacion e inserta registro en historial_convenios.';


-- Trigger: al registrar empresa en zona norte, activar convenio automáticamente
CREATE OR REPLACE FUNCTION fn_empresa_convenio_automatico()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.zona_norte_nayarit = TRUE AND NEW.estatus_convenio = 'sin_convenio' THEN
        NEW.estatus_convenio            := 'activo';
        NEW.convenio_fecha_inicio       := CURRENT_DATE;
        NEW.convenio_fecha_vencimiento  := CURRENT_DATE + INTERVAL '1 year';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_empresa_convenio_auto
    BEFORE INSERT OR UPDATE OF zona_norte_nayarit ON empresas
    FOR EACH ROW EXECUTE FUNCTION fn_empresa_convenio_automatico();

COMMENT ON FUNCTION fn_empresa_convenio_automatico IS 'Si la empresa está en zona norte de Nayarit, activa el convenio automáticamente al insertar o actualizar la empresa.';


-- Trigger: crear registro vacío de resultados_pruebas al registrar alumno
CREATE OR REPLACE FUNCTION fn_crear_resultados_prueba()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO resultados_pruebas (alumno_id)
    VALUES (NEW.alumno_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crear_resultados_prueba
    AFTER INSERT ON alumnos
    FOR EACH ROW EXECUTE FUNCTION fn_crear_resultados_prueba();

COMMENT ON FUNCTION fn_crear_resultados_prueba IS 'Crea automáticamente el registro de resultados de pruebas cuando se registra un nuevo alumno. Los puntajes quedan en NULL hasta que complete cada prueba.';


-- ============================================================
-- VISTAS ÚTILES
-- ============================================================

-- Vista: perfil completo del egresado con sus puntajes
CREATE OR REPLACE VIEW v_perfil_egresado AS
SELECT
    a.alumno_id,
    a.matricula,
    a.nombre,
    a.apellido_paterno,
    a.apellido_materno,
    CONCAT(a.nombre, ' ', a.apellido_paterno, ' ', COALESCE(a.apellido_materno,'')) AS nombre_completo,
    c.nombre                    AS carrera,
    c.carrera_id,
    a.periodo_egreso,
    a.correo_institucional,
    a.disponibilidad,
    a.foto_url,
    r.puntaje_psicometrico,
    r.puntaje_cognitivo,
    r.puntaje_tecnico,
    r.puntaje_proyectivo,
    -- Pruebas completadas
    (r.psicometrico_completado_at IS NOT NULL) AS psicometrica_completada,
    (r.cognitivo_completado_at    IS NOT NULL) AS cognitiva_completada,
    (r.tecnico_completado_at      IS NOT NULL) AS tecnica_completada,
    (r.proyectivo_completado_at   IS NOT NULL) AS proyectiva_completada,
    -- ¿Completó todas las pruebas que le aplican?
    CASE
        WHEN c.tiene_prueba_tecnica THEN
            (r.psicometrico_completado_at IS NOT NULL AND
             r.cognitivo_completado_at    IS NOT NULL AND
             r.tecnico_completado_at      IS NOT NULL AND
             r.proyectivo_completado_at   IS NOT NULL)
        ELSE
            (r.psicometrico_completado_at IS NOT NULL AND
             r.cognitivo_completado_at    IS NOT NULL AND
             r.proyectivo_completado_at   IS NOT NULL)
    END AS perfil_completo
FROM alumnos a
JOIN catalogo_carreras c  ON c.carrera_id  = a.carrera_id
LEFT JOIN resultados_pruebas r ON r.alumno_id = a.alumno_id
WHERE a.activo = TRUE;

COMMENT ON VIEW v_perfil_egresado IS 'Perfil completo del egresado con sus puntajes de pruebas y flag de si ha completado todas las evaluaciones que le aplican.';


-- Vista: candidatos idóneos por vacante (>= 80% de coincidencia)
CREATE OR REPLACE VIEW v_candidatos_idoneos AS
SELECT
    p.postulacion_id,
    p.vacante_id,
    v.titulo                    AS vacante_titulo,
    v.empresa_id,
    e.nombre                    AS empresa_nombre,
    p.alumno_id,
    a.nombre_completo,
    a.carrera,
    a.puntaje_psicometrico,
    a.puntaje_cognitivo,
    a.puntaje_tecnico,
    a.puntaje_proyectivo,
    p.porcentaje_coincidencia,
    p.estatus                   AS estatus_postulacion,
    p.fecha_postulacion
FROM postulaciones p
JOIN v_perfil_egresado a  ON a.alumno_id  = p.alumno_id
JOIN vacantes v           ON v.vacante_id = p.vacante_id
JOIN empresas e           ON e.empresa_id = v.empresa_id
WHERE p.porcentaje_coincidencia >= 80
  AND p.estatus NOT IN ('descartado','contratado');

COMMENT ON VIEW v_candidatos_idoneos IS 'Postulaciones con >= 80% de coincidencia. Base del dashboard de candidatos idóneos para empresas.';


-- Vista: inserción laboral por carrera (para Administración UT)
CREATE OR REPLACE VIEW v_insercion_laboral AS
SELECT
    c.carrera_id,
    c.nombre                                    AS carrera,
    COUNT(DISTINCT a.alumno_id)                 AS total_registrados,
    COUNT(DISTINCT CASE WHEN a.disponibilidad = 'contratado' THEN a.alumno_id END) AS contratados,
    ROUND(
        COUNT(DISTINCT CASE WHEN a.disponibilidad = 'contratado' THEN a.alumno_id END)::NUMERIC /
        NULLIF(COUNT(DISTINCT a.alumno_id), 0) * 100, 2
    )                                           AS porcentaje_insercion
FROM catalogo_carreras c
LEFT JOIN alumnos a ON a.carrera_id = c.carrera_id AND a.activo = TRUE
GROUP BY c.carrera_id, c.nombre
ORDER BY porcentaje_insercion DESC NULLS LAST;

COMMENT ON VIEW v_insercion_laboral IS 'Indicador de inserción laboral por carrera. Base del reporte RF-26 para la Administración UT.';


-- Vista: convenios por vencer en los próximos 30 días
CREATE OR REPLACE VIEW v_convenios_por_vencer AS
SELECT
    e.empresa_id,
    e.nombre                    AS empresa,
    e.correo,
    e.estado,
    e.municipio,
    e.estatus_convenio,
    e.convenio_fecha_vencimiento,
    (e.convenio_fecha_vencimiento - CURRENT_DATE) AS dias_para_vencer
FROM empresas e
WHERE e.estatus_convenio IN ('activo','por_vencer')
  AND e.convenio_fecha_vencimiento IS NOT NULL
  AND e.convenio_fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY e.convenio_fecha_vencimiento;

COMMENT ON VIEW v_convenios_por_vencer IS 'Empresas cuyo convenio vence en los próximos 30 días. Base del reporte RF-25 de estatus de convenios.';


-- ============================================================
-- DATOS DE PRUEBA (simulación SIEst 2.0)
-- ============================================================

-- 1. ALUMNOS (CORREGIDO)
INSERT INTO alumnos (
    cve_alumno, matricula, nombre, apellido_paterno, apellido_materno,
    carrera_id, periodo_egreso, correo_institucional, correo_alternativo,
    contrasena_hash, disponibilidad
) VALUES
    ('CVE2023001','al05-001-0923','Juan Carlos','Pérez','Ramírez',
     5,'2027-01-01','al05-001-0923@utdelacosta.edu.mx','juan@gmail.com',
     '$2b$12$placeholder_hash_1','activo'),
    ('CVE2023002','al01-002-0923','María Fernanda','González','López',
     1,'2027-01-01','al01-002-0923@utdelacosta.edu.mx','maria@gmail.com',
     '$2b$12$placeholder_hash_2','activo'),
    ('CVE2024001','al05-003-0924','Luis Ángel','Martínez','Soto',
     5,'2027-05-01','al05-003-0924@utdelacosta.edu.mx','luis@gmail.com',
     '$2b$12$placeholder_hash_3','activo'),
    ('CVE2023003','al03-004-0923','Sofía','Hernández','Cruz',
     3,'2027-01-01','al03-004-0923@utdelacosta.edu.mx','sofia@gmail.com',
     '$2b$12$placeholder_hash_4', 'activo'); -- <--- Valor corregido a 'activo'

-- 2. EMPRESAS
INSERT INTO empresas (nombre, correo, rfc, contrasena_hash, estado, municipio, zona_norte_nayarit) VALUES
    ('Tech Solutions Tepic SA de CV','contacto@techsolutions.mx','TST230501AB7',
     '$2b$12$placeholder_empresa_1','Nayarit','Tepic',TRUE),
    ('Innovación Digital Vallarta','hola@innovallarta.mx','IDV210315XY2',
     '$2b$12$placeholder_empresa_2','Jalisco','Puerto Vallarta',FALSE),
    ('Agronegocios Norte SA de CV','rh@agronorte.mx','ANS190820ZZ9',
     '$2b$12$placeholder_empresa_3','Nayarit','Santiago Ixcuintla',TRUE);

-- 3. VACANTES (Usando subconsultas para evitar errores de ID)
INSERT INTO vacantes (
    empresa_id, titulo, descripcion, area_especialidad, carrera_preferente,
    salario_min, salario_max, tipo_contrato, ubicacion_estado, ubicacion_municipio,
    benchmark_psicometrico, benchmark_cognitivo, benchmark_tecnico, benchmark_proyectivo
) VALUES
    ((SELECT empresa_id FROM empresas WHERE rfc = 'TST230501AB7'),
     'Desarrollador Web Full Stack', 'Desarrollo web con Angular.', 'TI', 5,
     12000, 18000,'tiempo_completo','Nayarit','Tepic', 75, 80, 85, 70),
    ((SELECT empresa_id FROM empresas WHERE rfc = 'ANS190820ZZ9'),
     'Coordinador Administrativo', 'Gestión de RH.', 'Admin', 1,
     9000, 13000,'tiempo_completo','Nayarit','Santiago Ixcuintla', 85, 70, 75, 80);

-- 4. ACTUALIZACIÓN DE PRUEBAS
UPDATE resultados_pruebas SET
    puntaje_psicometrico = 85, psicometrico_completado_at = NOW(),
    puntaje_cognitivo = 78, cognitivo_completado_at = NOW(),
    puntaje_tecnico = 90, tecnico_completado_at = NOW(),
    puntaje_proyectivo = 72, proyectivo_completado_at = NOW()
WHERE alumno_id = (SELECT alumno_id FROM alumnos WHERE matricula = 'al05-001-0923');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================