-- ============================================================
--  BOLSA DE TRABAJO UT DE LA COSTA
--  Base de datos PostgreSQL 16 — v2
--  Hackathon DITI 2026
--  Cambios v2:
--    · Tabla usuarios centraliza autenticación (contrasena_hash,
--      2FA, email_verificado). Se elimina de alumnos y empresas.
--    · Tabla roles define los 3 actores del sistema.
--    · Tabla api_config almacena configuración de APIs externas.
--    · RF-32b: API de validación RFC añadida.
--    · 2FA diferenciado: egresado solo en registro, admin en
--      cada sesión, empresa según flujo de alta.
-- ============================================================
 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
 
-- ============================================================
-- 1. ROLES
-- ============================================================
CREATE TABLE roles (
    rol_id      SMALLINT     PRIMARY KEY,
    nombre      VARCHAR(30)  NOT NULL UNIQUE,
    descripcion VARCHAR(120)
);
 
COMMENT ON TABLE roles IS '1=egresado, 2=empresa, 3=administrador_ut';
 
INSERT INTO roles (rol_id, nombre, descripcion) VALUES
    (1, 'egresado',          'Alumno egresado de la UT de la Costa'),
    (2, 'empresa',           'Empresa con o sin convenio institucional'),
    (3, 'administrador_ut',  'Personal administrativo de la UT de la Costa');
 
 
-- ============================================================
-- 2. USUARIOS (autenticación centralizada)
-- ============================================================
CREATE TABLE usuarios (
    usuario_id          SERIAL          PRIMARY KEY,
    rol_id              SMALLINT        NOT NULL REFERENCES roles(rol_id),
 
    -- Credenciales
    email               VARCHAR(120)    NOT NULL UNIQUE,
    contrasena_hash     VARCHAR(255)    NOT NULL,
 
    -- Verificación de correo y 2FA
    -- momento_2fa:
    --   'ninguno'   → empresa dada de alta por admin (ya verificada)
    --   'registro'  → empresa nueva: 2FA solo al registrarse
    --   'siempre'   → administrador UT: 2FA en cada login
    --   'primer_acceso' → egresado: 2FA solo la primera vez
    email_verificado    BOOLEAN         NOT NULL DEFAULT FALSE,
    momento_2fa         VARCHAR(20)     NOT NULL DEFAULT 'primer_acceso'
                            CHECK (momento_2fa IN (
                                'ninguno','registro','primer_acceso','siempre'
                            )),
    primer_acceso       BOOLEAN         NOT NULL DEFAULT TRUE,
 
    -- Vínculos a entidad (solo uno aplica según rol)
    cve_alumno          VARCHAR(30)     UNIQUE,  -- FK lógica a alumnos
    empresa_id          INTEGER,                 -- FK lógica a empresas
    admin_id            INTEGER,                 -- FK lógica a admins_ut
 
    -- Estado
    activo              BOOLEAN         NOT NULL DEFAULT TRUE,
    ultimo_login        TIMESTAMP,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_un_solo_vinculo CHECK (
        (CASE WHEN cve_alumno  IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN empresa_id  IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN admin_id    IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);
 
COMMENT ON TABLE  usuarios IS 'Tabla centralizada de autenticación. Un registro por actor (egresado, empresa, admin). Las credenciales y lógica 2FA viven aquí, no en alumnos/empresas.';
COMMENT ON COLUMN usuarios.momento_2fa IS 'ninguno=empresa alta por admin (sin 2FA). registro=empresa nueva (2FA solo al registrarse). primer_acceso=egresado (2FA solo primer login). siempre=admin UT (2FA en cada sesión).';
COMMENT ON COLUMN usuarios.primer_acceso IS 'TRUE hasta que el usuario completa su primer login exitoso. Controla la lógica de 2FA para egresado y empresa nueva.';
COMMENT ON COLUMN usuarios.cve_alumno IS 'Vincula con alumnos.cve_alumno. Se usa como clave de consulta al endpoint del SIEst.';
 
 
-- ============================================================
-- 3. CATÁLOGO DE CARRERAS
-- ============================================================
CREATE TABLE catalogo_carreras (
    carrera_id              SMALLINT        PRIMARY KEY,
    codigo_correo           CHAR(2)         NOT NULL UNIQUE,
    nombre                  VARCHAR(80)     NOT NULL,
    tiene_prueba_tecnica    BOOLEAN         NOT NULL DEFAULT FALSE,
    activa                  BOOLEAN         NOT NULL DEFAULT TRUE,
    CONSTRAINT chk_carrera_id CHECK (carrera_id BETWEEN 1 AND 99)
);
 
COMMENT ON TABLE  catalogo_carreras IS 'Catálogo de carreras de la UT de la Costa.';
COMMENT ON COLUMN catalogo_carreras.tiene_prueba_tecnica IS 'TRUE solo para 01=Admin y 05=TI en esta fase.';
 
INSERT INTO catalogo_carreras (carrera_id, codigo_correo, nombre, tiene_prueba_tecnica) VALUES
    (1, '01', 'Administración',                    TRUE),
    (2, '02', 'Agrobiotecnología',                 FALSE),
    (3, '03', 'Mercadotecnia',                     FALSE),
    (4, '04', 'Procesos Alimentarios',             FALSE),
    (5, '05', 'Tecnologías de la Información',     TRUE),
    (6, '06', 'Acuicultura',                       FALSE),
    (7, '07', 'Turismo',                           FALSE),
    (8, '08', 'Gastronomía',                       FALSE),
    (9, '09', 'Contaduría',                        FALSE);
 
 
-- ============================================================
-- 4. ALUMNOS (sin credenciales — viven en usuarios)
-- ============================================================
CREATE TABLE alumnos (
    alumno_id                   SERIAL          PRIMARY KEY,
 
    -- Datos del SIEst 2.0 (almacenados localmente para no sobrecargar servidor)
    cve_alumno                  VARCHAR(30)     NOT NULL UNIQUE,
    matricula                   VARCHAR(20)     NOT NULL UNIQUE,
    nombre                      VARCHAR(80)     NOT NULL,
    apellido_paterno            VARCHAR(60)     NOT NULL,
    apellido_materno            VARCHAR(60),
    carrera_id                  SMALLINT        NOT NULL REFERENCES catalogo_carreras(carrera_id),
    periodo_egreso              DATE            NOT NULL,
    foto_url                    TEXT,
 
    -- Contacto (actualizable por el egresado)
    correo_institucional        VARCHAR(120)    NOT NULL UNIQUE,
    correo_alternativo          VARCHAR(120),
    telefono                    VARCHAR(20),
    linkedin_url                VARCHAR(255),
 
    -- Perfil adicional (URLs a Google Drive)
    cv_drive_url                TEXT,
    disponibilidad              VARCHAR(20)     NOT NULL DEFAULT 'activo'
                                    CHECK (disponibilidad IN ('activo','no_disponible','contratado')),
 
    -- Control de sincronización con SIEst
    datos_siest_sync_at         TIMESTAMP,
    perfil_actualizado_at       TIMESTAMP,
 
    activo                      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_correo_institucional
        CHECK (correo_institucional ~ '^al[0-9]{2}-[0-9]{3}-[0-9]{4}@utdelacosta\.edu\.mx$')
);
 
COMMENT ON TABLE  alumnos IS 'Datos del egresado. Sin credenciales — la autenticación vive en usuarios. Se vincula via cve_alumno.';
COMMENT ON COLUMN alumnos.cve_alumno IS 'Clave única del SIEst 2.0. Distinta de la matrícula. Usada para consultas al endpoint del SIEst y como FK en usuarios.';
COMMENT ON COLUMN alumnos.matricula IS 'Nombre de usuario para el login. Formato alXX-XXX-XXXX.';
COMMENT ON COLUMN alumnos.periodo_egreso IS 'Solo hay ingresos el 1 de septiembre. Plan 2023: 3a 8m. Plan 2024+: 3a 4m.';
 
 
-- ============================================================
-- 5. ADMINISTRADORES UT
-- ============================================================
CREATE TABLE admins_ut (
    admin_id        SERIAL          PRIMARY KEY,
    nombre          VARCHAR(80)     NOT NULL,
    apellidos       VARCHAR(120)    NOT NULL,
    email           VARCHAR(120)    NOT NULL UNIQUE,
    cargo           VARCHAR(80),
    activo          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);
 
COMMENT ON TABLE admins_ut IS 'Personal administrativo de la UT de la Costa. Sus credenciales viven en usuarios con momento_2fa=siempre.';
 
 
-- ============================================================
-- 6. EMPRESAS (sin credenciales — viven en usuarios)
-- ============================================================
CREATE TABLE empresas (
    empresa_id                  SERIAL          PRIMARY KEY,
 
    -- Datos de registro (verificación anti-duplicados: RFC + correo)
    nombre                      VARCHAR(120)    NOT NULL,
    correo                      VARCHAR(120)    NOT NULL UNIQUE,
    rfc                         VARCHAR(13)     NOT NULL UNIQUE,
 
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
    -- flujo_alta:
    --   'admin_alta'   → dada de alta por admin UT (convenio activo desde el inicio)
    --   'auto_registro'→ se registró sola (sin convenio hasta validación)
    flujo_alta                  VARCHAR(20)     NOT NULL DEFAULT 'auto_registro'
                                    CHECK (flujo_alta IN ('admin_alta','auto_registro')),
    estatus_convenio            VARCHAR(25)     NOT NULL DEFAULT 'sin_convenio'
                                    CHECK (estatus_convenio IN (
                                        'activo','pendiente_formalizacion',
                                        'por_vencer','sin_convenio','vencido'
                                    )),
    convenio_fecha_inicio       DATE,
    convenio_fecha_vencimiento  DATE,
 
    activo                      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_rfc_formato CHECK (LENGTH(rfc) BETWEEN 12 AND 13),
    CONSTRAINT chk_convenio_fechas CHECK (
        convenio_fecha_vencimiento IS NULL OR
        convenio_fecha_vencimiento > convenio_fecha_inicio
    )
);
 
COMMENT ON TABLE  empresas IS 'Empresas registradas. Sin credenciales — autenticación en usuarios. Dos flujos de alta: admin_alta (ya verificada) o auto_registro (requiere validación RFC + correo).';
COMMENT ON COLUMN empresas.flujo_alta IS 'admin_alta: el admin UT la registró, email_verificado=TRUE en usuarios, momento_2fa=ninguno. auto_registro: se registró sola, momento_2fa=registro.';
COMMENT ON COLUMN empresas.zona_norte_nayarit IS 'TRUE = convenio automático al registrarse. FALSE = sin convenio hasta que un egresado marque contratación.';
 
 
-- ============================================================
-- 7. CONFIGURACIÓN DE APIs EXTERNAS
-- ============================================================
CREATE TABLE api_config (
    api_id          SERIAL          PRIMARY KEY,
    clave           VARCHAR(50)     NOT NULL UNIQUE,
    nombre          VARCHAR(80)     NOT NULL,
    base_url        TEXT            NOT NULL,
    api_key_enc     TEXT,
    descripcion     TEXT,
    activa          BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);
 
COMMENT ON TABLE  api_config IS 'Configuración de APIs externas consumidas por la plataforma. RF-32: vacantes nacionales. RF-32b: validación/consulta de RFC.';
COMMENT ON COLUMN api_config.clave IS 'Identificador interno. Ej: vacantes_nacionales, validacion_rfc.';
COMMENT ON COLUMN api_config.api_key_enc IS 'API key encriptada. NULL si la API es pública/gratuita sin autenticación.';
 
INSERT INTO api_config (clave, nombre, base_url, descripcion) VALUES
    ('vacantes_nacionales',
     'API de Vacantes Nacionales',
     'https://api.example.com/vacantes',
     'RF-32: Servicio externo (versión gratuita) para poblar el catálogo con vacantes fuera de la zona norte de Nayarit.'),
    ('validacion_rfc',
     'API de Consulta y Validación RFC',
     'https://api.example.com/rfc',
     'RF-32b: Valida que el RFC existe a nivel nacional y obtiene datos de la empresa al momento del registro. Evita duplicados y fraudes.');
 
 
-- ============================================================
-- 8. VACANTES
-- ============================================================
CREATE TABLE vacantes (
    vacante_id                  SERIAL          PRIMARY KEY,
    empresa_id                  INTEGER         REFERENCES empresas(empresa_id) ON DELETE SET NULL,
 
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
    ubicacion_estado            VARCHAR(60)     NOT NULL,
    ubicacion_municipio         VARCHAR(80),
 
    -- Perfil idóneo (benchmark por dimensión, 0–100)
    benchmark_psicometrico      SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_psicometrico BETWEEN 0 AND 100),
    benchmark_cognitivo         SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_cognitivo    BETWEEN 0 AND 100),
    benchmark_tecnico           SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_tecnico      BETWEEN 0 AND 100),
    benchmark_proyectivo        SMALLINT        NOT NULL DEFAULT 0 CHECK (benchmark_proyectivo   BETWEEN 0 AND 100),
 
    fuente                      VARCHAR(15)     NOT NULL DEFAULT 'local'
                                    CHECK (fuente IN ('local','api_nacional')),
    ref_api_externa             VARCHAR(100),
 
    estatus                     VARCHAR(15)     NOT NULL DEFAULT 'activa'
                                    CHECK (estatus IN ('activa','cerrada','pausada')),
    fecha_publicacion           DATE            NOT NULL DEFAULT CURRENT_DATE,
    fecha_cierre                DATE,
 
    created_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_salario      CHECK (salario_max IS NULL OR salario_max >= salario_min),
    CONSTRAINT chk_fecha_cierre CHECK (fecha_cierre IS NULL OR fecha_cierre >= fecha_publicacion)
);
 
COMMENT ON TABLE  vacantes IS 'Ofertas laborales: local (empresa registrada) o api_nacional (importada). La empresa define el benchmark al crear/editar la vacante.';
COMMENT ON COLUMN vacantes.ref_api_externa IS 'ID de la vacante en la API nacional. NULL si fuente=local.';
 
 
-- ============================================================
-- 9. RESULTADOS DE PRUEBAS
-- (Una fila por alumno — pruebas irrepetibles)
-- ============================================================
CREATE TABLE resultados_pruebas (
    resultado_id                SERIAL          PRIMARY KEY,
    alumno_id                   INTEGER         NOT NULL UNIQUE REFERENCES alumnos(alumno_id) ON DELETE CASCADE,
 
    puntaje_psicometrico        SMALLINT        CHECK (puntaje_psicometrico BETWEEN 0 AND 100),
    psicometrico_completado_at  TIMESTAMP,
 
    puntaje_cognitivo           SMALLINT        CHECK (puntaje_cognitivo BETWEEN 0 AND 100),
    cognitivo_completado_at     TIMESTAMP,
 
    puntaje_tecnico             SMALLINT        CHECK (puntaje_tecnico BETWEEN 0 AND 100),
    tecnico_completado_at       TIMESTAMP,
 
    puntaje_proyectivo          SMALLINT        CHECK (puntaje_proyectivo BETWEEN 0 AND 100),
    proyectivo_completado_at    TIMESTAMP,
 
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW()
);
 
COMMENT ON TABLE  resultados_pruebas IS 'Un único registro por alumno. Pruebas irrepetibles aplicadas al registrarse. puntaje_tecnico = NULL si carrera no tiene prueba técnica implementada.';
 
 
-- ============================================================
-- 10. POSTULACIONES
-- ============================================================
CREATE TABLE postulaciones (
    postulacion_id              SERIAL          PRIMARY KEY,
    alumno_id                   INTEGER         NOT NULL REFERENCES alumnos(alumno_id) ON DELETE CASCADE,
    vacante_id                  INTEGER         NOT NULL REFERENCES vacantes(vacante_id) ON DELETE CASCADE,
 
    porcentaje_coincidencia     NUMERIC(5,2)    NOT NULL DEFAULT 0.00
                                    CHECK (porcentaje_coincidencia BETWEEN 0 AND 100),
 
    estatus                     VARCHAR(20)     NOT NULL DEFAULT 'postulado'
                                    CHECK (estatus IN (
                                        'postulado','en_revision','seleccionado',
                                        'descartado','contratado'
                                    )),
 
    contratado_confirmado       BOOLEAN         NOT NULL DEFAULT FALSE,
    contratado_confirmado_at    TIMESTAMP,
    mensaje_inicial             TEXT,
 
    fecha_postulacion           TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    CONSTRAINT uq_alumno_vacante UNIQUE (alumno_id, vacante_id)
);
 
COMMENT ON COLUMN postulaciones.porcentaje_coincidencia IS 'Calculado por fn_calcular_coincidencia() al postularse. Umbral de relevancia: 80%.';
COMMENT ON COLUMN postulaciones.contratado_confirmado IS 'El egresado confirma la contratación. Activa flujo de convenio si empresa es nacional (zona_norte_nayarit=FALSE).';
 
 
-- ============================================================
-- 11. MENSAJES (comunicación bidireccional)
-- ============================================================
CREATE TABLE mensajes (
    mensaje_id          SERIAL      PRIMARY KEY,
    postulacion_id      INTEGER     NOT NULL REFERENCES postulaciones(postulacion_id) ON DELETE CASCADE,
 
    emisor_tipo         VARCHAR(10) NOT NULL CHECK (emisor_tipo IN ('alumno','empresa')),
    emisor_alumno_id    INTEGER     REFERENCES alumnos(alumno_id)   ON DELETE SET NULL,
    emisor_empresa_id   INTEGER     REFERENCES empresas(empresa_id) ON DELETE SET NULL,
 
    contenido           TEXT        NOT NULL,
    leido               BOOLEAN     NOT NULL DEFAULT FALSE,
    leido_at            TIMESTAMP,
    created_at          TIMESTAMP   NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_emisor_coherente CHECK (
        (emisor_tipo = 'alumno'  AND emisor_alumno_id  IS NOT NULL AND emisor_empresa_id IS NULL) OR
        (emisor_tipo = 'empresa' AND emisor_empresa_id IS NOT NULL AND emisor_alumno_id  IS NULL)
    )
);
 
 
-- ============================================================
-- 12. CERTIFICADOS DEL ALUMNO
-- ============================================================
CREATE TABLE certificados_alumno (
    certificado_id      SERIAL          PRIMARY KEY,
    alumno_id           INTEGER         NOT NULL REFERENCES alumnos(alumno_id) ON DELETE CASCADE,
    nombre_certificado  VARCHAR(120)    NOT NULL,
    institucion_emisora VARCHAR(120),
    fecha_emision       DATE,
    archivo_drive_url   TEXT            NOT NULL,
    validado            BOOLEAN         NOT NULL DEFAULT FALSE,
    validado_at         TIMESTAMP,
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW()
);
 
COMMENT ON TABLE  certificados_alumno IS 'Los archivos se almacenan en Google Drive. La BD solo guarda la URL.';
 
 
-- ============================================================
-- 13. HISTORIAL DE CONVENIOS
-- ============================================================
CREATE TABLE historial_convenios (
    convenio_id         SERIAL          PRIMARY KEY,
    empresa_id          INTEGER         NOT NULL REFERENCES empresas(empresa_id) ON DELETE CASCADE,
 
    tipo_origen         VARCHAR(30)     NOT NULL
                            CHECK (tipo_origen IN (
                                'automatico_zona_norte',
                                'contratacion_egresado',
                                'gestion_manual'
                            )),
    postulacion_id      INTEGER         REFERENCES postulaciones(postulacion_id) ON DELETE SET NULL,
 
    estatus             VARCHAR(30)     NOT NULL DEFAULT 'pendiente_formalizacion'
                            CHECK (estatus IN (
                                'activo','vencido',
                                'pendiente_formalizacion','rechazado'
                            )),
 
    fecha_inicio                DATE,
    fecha_vencimiento           DATE,
    gestionado_por_admin        VARCHAR(80),
    notas                       TEXT,
 
    created_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP       NOT NULL DEFAULT NOW(),
 
    CONSTRAINT chk_conv_fechas CHECK (
        fecha_vencimiento IS NULL OR fecha_vencimiento > fecha_inicio
    )
);
 
 
-- ============================================================
-- 14. TOKENS DE ACCESO (2FA + recuperación de contraseña)
-- ============================================================
CREATE TABLE tokens_acceso (
    token_id        SERIAL          PRIMARY KEY,
    usuario_id      INTEGER         NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    tipo            VARCHAR(25)     NOT NULL
                        CHECK (tipo IN (
                            'recuperacion_password',
                            'verificacion_2fa',
                            'verificacion_correo'
                        )),
    token_hash      VARCHAR(255)    NOT NULL UNIQUE,
    expira_at       TIMESTAMP       NOT NULL,
    usado           BOOLEAN         NOT NULL DEFAULT FALSE,
    usado_at        TIMESTAMP,
    created_at      TIMESTAMP       NOT NULL DEFAULT NOW()
);
 
COMMENT ON TABLE  tokens_acceso IS 'Tokens temporales vinculados al usuario unificado. Cubre 2FA (siempre/primer_acceso/registro) y recuperación de contraseña.';
 
 
-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_usuarios_email        ON usuarios(email);
CREATE INDEX idx_usuarios_rol          ON usuarios(rol_id);
CREATE INDEX idx_usuarios_cve_alumno   ON usuarios(cve_alumno);
CREATE INDEX idx_usuarios_empresa_id   ON usuarios(empresa_id);
 
CREATE INDEX idx_alumnos_carrera       ON alumnos(carrera_id);
CREATE INDEX idx_alumnos_periodo       ON alumnos(periodo_egreso);
CREATE INDEX idx_alumnos_disponibilidad ON alumnos(disponibilidad);
CREATE INDEX idx_alumnos_cve           ON alumnos(cve_alumno);
 
CREATE INDEX idx_empresas_rfc          ON empresas(rfc);
CREATE INDEX idx_empresas_zona         ON empresas(zona_norte_nayarit);
CREATE INDEX idx_empresas_convenio     ON empresas(estatus_convenio);
CREATE INDEX idx_empresas_flujo        ON empresas(flujo_alta);
 
CREATE INDEX idx_vacantes_empresa      ON vacantes(empresa_id);
CREATE INDEX idx_vacantes_estatus      ON vacantes(estatus);
CREATE INDEX idx_vacantes_fuente       ON vacantes(fuente);
CREATE INDEX idx_vacantes_carrera      ON vacantes(carrera_preferente);
CREATE INDEX idx_vacantes_estado       ON vacantes(ubicacion_estado);
 
CREATE INDEX idx_postulaciones_alumno  ON postulaciones(alumno_id);
CREATE INDEX idx_postulaciones_vacante ON postulaciones(vacante_id);
CREATE INDEX idx_postulaciones_estatus ON postulaciones(estatus);
CREATE INDEX idx_postulaciones_coinc   ON postulaciones(porcentaje_coincidencia DESC);
 
CREATE INDEX idx_mensajes_postulacion  ON mensajes(postulacion_id);
CREATE INDEX idx_mensajes_leido        ON mensajes(leido);
CREATE INDEX idx_pruebas_alumno        ON resultados_pruebas(alumno_id);
CREATE INDEX idx_cert_alumno           ON certificados_alumno(alumno_id);
CREATE INDEX idx_cert_validado         ON certificados_alumno(validado);
CREATE INDEX idx_conv_empresa          ON historial_convenios(empresa_id);
CREATE INDEX idx_conv_estatus          ON historial_convenios(estatus);
CREATE INDEX idx_tokens_hash           ON tokens_acceso(token_hash);
CREATE INDEX idx_tokens_usuario        ON tokens_acceso(usuario_id);
CREATE INDEX idx_tokens_expira         ON tokens_acceso(expira_at);
 
 
-- ============================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================
 
-- updated_at automático
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_alumnos_updated_at
    BEFORE UPDATE ON alumnos FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_empresas_updated_at
    BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_vacantes_updated_at
    BEFORE UPDATE ON vacantes FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_postulaciones_updated_at
    BEFORE UPDATE ON postulaciones FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_convenios_updated_at
    BEFORE UPDATE ON historial_convenios FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_pruebas_updated_at
    BEFORE UPDATE ON resultados_pruebas FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
CREATE TRIGGER trg_api_config_updated_at
    BEFORE UPDATE ON api_config FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
 
 
-- Crear registro vacío de resultados_pruebas al registrar alumno
CREATE OR REPLACE FUNCTION fn_crear_resultados_prueba()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO resultados_pruebas (alumno_id) VALUES (NEW.alumno_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_crear_resultados_prueba
    AFTER INSERT ON alumnos
    FOR EACH ROW EXECUTE FUNCTION fn_crear_resultados_prueba();
 
 
-- Convenio automático para empresas de zona norte de Nayarit
CREATE OR REPLACE FUNCTION fn_empresa_convenio_automatico()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.zona_norte_nayarit = TRUE AND NEW.estatus_convenio = 'sin_convenio' THEN
        NEW.estatus_convenio           := 'activo';
        NEW.convenio_fecha_inicio      := CURRENT_DATE;
        NEW.convenio_fecha_vencimiento := CURRENT_DATE + INTERVAL '1 year';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_empresa_convenio_auto
    BEFORE INSERT OR UPDATE OF zona_norte_nayarit ON empresas
    FOR EACH ROW EXECUTE FUNCTION fn_empresa_convenio_automatico();
 
 
-- Al confirmar contratación: activar flujo de convenio para empresa nacional
CREATE OR REPLACE FUNCTION fn_postulacion_contratado()
RETURNS TRIGGER AS $$
DECLARE
    v_empresa  empresas%ROWTYPE;
    v_vacante  vacantes%ROWTYPE;
BEGIN
    IF NEW.contratado_confirmado = TRUE AND OLD.contratado_confirmado = FALSE THEN
        SELECT * INTO v_vacante FROM vacantes  WHERE vacante_id = NEW.vacante_id;
        SELECT * INTO v_empresa FROM empresas  WHERE empresa_id = v_vacante.empresa_id;
 
        IF v_empresa.zona_norte_nayarit = FALSE THEN
            UPDATE empresas
               SET estatus_convenio = 'pendiente_formalizacion', updated_at = NOW()
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
 
        UPDATE alumnos
           SET disponibilidad = 'contratado', updated_at = NOW()
         WHERE alumno_id = NEW.alumno_id;
 
        NEW.contratado_confirmado_at := NOW();
        NEW.estatus := 'contratado';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
 
CREATE TRIGGER trg_postulacion_contratado
    BEFORE UPDATE ON postulaciones
    FOR EACH ROW EXECUTE FUNCTION fn_postulacion_contratado();
 
 
-- Calcular % de coincidencia candidato-vacante
CREATE OR REPLACE FUNCTION fn_calcular_coincidencia(
    p_alumno_id  INTEGER,
    p_vacante_id INTEGER
)
RETURNS NUMERIC AS $$
DECLARE
    v_prueba    resultados_pruebas%ROWTYPE;
    v_vacante   vacantes%ROWTYPE;
    total_peso  NUMERIC := 0;
    total_pts   NUMERIC := 0;
BEGIN
    SELECT * INTO v_prueba  FROM resultados_pruebas WHERE alumno_id  = p_alumno_id;
    SELECT * INTO v_vacante FROM vacantes            WHERE vacante_id = p_vacante_id;
    IF NOT FOUND THEN RETURN 0; END IF;
 
    IF v_vacante.benchmark_psicometrico > 0 THEN
        total_peso := total_peso + 1;
        total_pts  := total_pts + LEAST(COALESCE(v_prueba.puntaje_psicometrico,0)::NUMERIC / v_vacante.benchmark_psicometrico, 1);
    END IF;
    IF v_vacante.benchmark_cognitivo > 0 THEN
        total_peso := total_peso + 1;
        total_pts  := total_pts + LEAST(COALESCE(v_prueba.puntaje_cognitivo,0)::NUMERIC / v_vacante.benchmark_cognitivo, 1);
    END IF;
    IF v_vacante.benchmark_tecnico > 0 THEN
        total_peso := total_peso + 1;
        total_pts  := total_pts + LEAST(COALESCE(v_prueba.puntaje_tecnico,0)::NUMERIC / v_vacante.benchmark_tecnico, 1);
    END IF;
    IF v_vacante.benchmark_proyectivo > 0 THEN
        total_peso := total_peso + 1;
        total_pts  := total_pts + LEAST(COALESCE(v_prueba.puntaje_proyectivo,0)::NUMERIC / v_vacante.benchmark_proyectivo, 1);
    END IF;
 
    IF total_peso = 0 THEN RETURN 0; END IF;
    RETURN ROUND((total_pts / total_peso) * 100, 2);
END;
$$ LANGUAGE plpgsql;
 
COMMENT ON FUNCTION fn_calcular_coincidencia IS 'Calcula el % de coincidencia egresado vs vacante sobre dimensiones con benchmark > 0. Retorna 0–100.';
 
 
-- ============================================================
-- VISTAS
-- ============================================================
 
CREATE OR REPLACE VIEW v_perfil_egresado AS
SELECT
    a.alumno_id, a.matricula, a.cve_alumno,
    a.nombre, a.apellido_paterno, a.apellido_materno,
    CONCAT(a.nombre,' ',a.apellido_paterno,' ',COALESCE(a.apellido_materno,'')) AS nombre_completo,
    c.nombre           AS carrera,
    c.carrera_id,
    a.periodo_egreso,
    a.correo_institucional,
    a.disponibilidad,
    a.foto_url,
    u.email            AS email_login,
    u.email_verificado,
    u.momento_2fa,
    u.primer_acceso,
    r.puntaje_psicometrico, r.puntaje_cognitivo,
    r.puntaje_tecnico,      r.puntaje_proyectivo,
    (r.psicometrico_completado_at IS NOT NULL) AS psicometrica_completada,
    (r.cognitivo_completado_at    IS NOT NULL) AS cognitiva_completada,
    (r.tecnico_completado_at      IS NOT NULL) AS tecnica_completada,
    (r.proyectivo_completado_at   IS NOT NULL) AS proyectiva_completada,
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
JOIN catalogo_carreras c      ON c.carrera_id = a.carrera_id
JOIN usuarios u               ON u.cve_alumno = a.cve_alumno
LEFT JOIN resultados_pruebas r ON r.alumno_id  = a.alumno_id
WHERE a.activo = TRUE;
 
COMMENT ON VIEW v_perfil_egresado IS 'Perfil completo del egresado incluyendo estado de autenticación (desde usuarios) y puntajes de pruebas.';
 
 
CREATE OR REPLACE VIEW v_candidatos_idoneos AS
SELECT
    p.postulacion_id, p.vacante_id,
    v.titulo           AS vacante_titulo,
    v.empresa_id,
    e.nombre           AS empresa_nombre,
    p.alumno_id,
    a.nombre_completo,
    a.carrera,
    a.puntaje_psicometrico, a.puntaje_cognitivo,
    a.puntaje_tecnico,      a.puntaje_proyectivo,
    p.porcentaje_coincidencia,
    p.estatus          AS estatus_postulacion,
    p.fecha_postulacion
FROM postulaciones p
JOIN v_perfil_egresado a ON a.alumno_id  = p.alumno_id
JOIN vacantes v          ON v.vacante_id = p.vacante_id
JOIN empresas e          ON e.empresa_id = v.empresa_id
WHERE p.porcentaje_coincidencia >= 80
  AND p.estatus NOT IN ('descartado','contratado');
 
 
CREATE OR REPLACE VIEW v_insercion_laboral AS
SELECT
    c.carrera_id, c.nombre AS carrera,
    COUNT(DISTINCT a.alumno_id) AS total_registrados,
    COUNT(DISTINCT CASE WHEN a.disponibilidad = 'contratado' THEN a.alumno_id END) AS contratados,
    ROUND(
        COUNT(DISTINCT CASE WHEN a.disponibilidad = 'contratado' THEN a.alumno_id END)::NUMERIC /
        NULLIF(COUNT(DISTINCT a.alumno_id),0) * 100, 2
    ) AS porcentaje_insercion
FROM catalogo_carreras c
LEFT JOIN alumnos a ON a.carrera_id = c.carrera_id AND a.activo = TRUE
GROUP BY c.carrera_id, c.nombre
ORDER BY porcentaje_insercion DESC NULLS LAST;
 
 
CREATE OR REPLACE VIEW v_convenios_por_vencer AS
SELECT
    e.empresa_id, e.nombre AS empresa,
    e.correo, e.estado, e.municipio,
    e.estatus_convenio, e.flujo_alta,
    e.convenio_fecha_vencimiento,
    (e.convenio_fecha_vencimiento - CURRENT_DATE) AS dias_para_vencer
FROM empresas e
WHERE e.estatus_convenio IN ('activo','por_vencer')
  AND e.convenio_fecha_vencimiento IS NOT NULL
  AND e.convenio_fecha_vencimiento <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY e.convenio_fecha_vencimiento;