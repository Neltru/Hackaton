import { AlumniProfile } from '../models/alumni-profile.models';
import { MonitoreoStats, MonitoreoPromedioCarrera, HistogramaDataPoint } from '../models/monitoreo.models';
import { InsercionGlobalStats, InsercionCarrera } from '../models/insercion.models';
import { Vacante, AlumniPostulacion } from '../services/vacantes.service';
import { TestResult } from '../services/tests.service';
import { ResultadoPrueba } from '../models/evaluaciones.models';
import { AlumnoPuntajes, EmpresaBenchmark } from '../models/pruebas-sot.models';

// ─── PERFIL ───────────────────────────────────────────────────────────────────

export const MOCK_ALUMNI_PROFILE: AlumniProfile = {
  alumno_id: 1,
  cve_alumno: 'UAN-2024-001',
  matricula: '22410001',
  nombre: 'Carlos Alejandro',
  apellido_paterno: 'Hernández',
  apellido_materno: 'Morales',
  carrera_id: 3,
  carrera_nombre: 'Ingeniería en Sistemas Computacionales',
  periodo_egreso: '2024-2',
  foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  correo_institucional: 'c.hernandez@uan.edu.mx',
  correo_alternativo: 'carloshm@gmail.com',
  telefono: '311-123-4567',
  linkedin_url: 'https://linkedin.com/in/carloshernandez',
  disponibilidad: 'activo',
  resumen_profesional:
    'Egresado de Ingeniería en Sistemas con experiencia en desarrollo web ' +
    'full-stack. Apasionado por resolver problemas complejos con tecnología. ' +
    'Busco oportunidades en empresas innovadoras donde pueda crecer profesionalmente.',
  experiencias: [
    {
      id: 'exp-001',
      company: 'Soluciones Digitales del Norte',
      role: 'Desarrollador Web Jr.',
      startDate: '2023-08',
      endDate: '2024-05',
      currentlyWorking: false,
      description: 'Desarrollo de aplicaciones web con Angular y Node.js. Integración de APIs REST y bases de datos MySQL.'
    },
    {
      id: 'exp-002',
      company: 'UAN - Departamento de TI',
      role: 'Auxiliar de Desarrollo (Servicio Social)',
      startDate: '2022-08',
      endDate: '2023-02',
      currentlyWorking: false,
      description: 'Mantenimiento del portal universitario y soporte a sistemas internos.'
    }
  ],
  certificados: [
    {
      id: 'cert-001',
      title: 'Angular Developer Certification',
      institution: 'Google',
      issueDate: '2023-11',
      credentialId: 'GCP-ANG-2023-4421'
    },
    {
      id: 'cert-002',
      title: 'Scrum Fundamentals Certified',
      institution: 'SCRUMstudy',
      issueDate: '2024-01',
      credentialId: 'SFC-78452'
    }
  ]
};

// ─── VACANTES ─────────────────────────────────────────────────────────────────

export const MOCK_VACANTES: Vacante[] = [
  {
    id: 'vac-001',
    title: 'Desarrollador Full Stack Angular / Node.js',
    company: 'Softtek',
    employer_logo: null,
    location: 'Tepic, Nayarit',
    type: 'Tiempo completo',
    modality: 'Híbrido',
    description:
      'Buscamos desarrollador con experiencia en Angular 16+ y Node.js para unirse a nuestro equipo de desarrollo de software empresarial. Trabajo en equipo ágil, ambiente dinámico.',
    published_at: '2026-04-28',
    publisher: 'Softtek HR',
    match: 92,
    recommended: true,
    status: 'pendiente',
    category: 'Tecnología',
    apply_link: '#',
    ideal_scores: { psico: 75, cogni: 80, tech: 90, proy: 70 }
  },
  {
    id: 'vac-002',
    title: 'Ingeniero de Software Backend',
    company: 'OXXO Digital',
    employer_logo: null,
    location: 'Monterrey, NL (Remoto)',
    type: 'Tiempo completo',
    modality: 'Remoto',
    description:
      'Posición remota para desarrollo de microservicios en Python y FastAPI. Se requiere experiencia con Docker, Kubernetes y bases de datos NoSQL.',
    published_at: '2026-04-26',
    publisher: 'OXXO Talent',
    match: 85,
    recommended: true,
    status: 'pendiente',
    category: 'Tecnología',
    apply_link: '#',
    ideal_scores: { psico: 70, cogni: 85, tech: 88, proy: 65 }
  },
  {
    id: 'vac-003',
    title: 'Analista de Datos Jr.',
    company: 'BBVA México',
    employer_logo: null,
    location: 'CDMX',
    type: 'Tiempo completo',
    modality: 'Presencial',
    description:
      'Unirse al área de Business Intelligence para análisis de datos financieros. Se trabaja con Power BI, SQL y Python. Excelente ambiente y plan de carrera.',
    published_at: '2026-04-25',
    publisher: 'BBVA Selección',
    match: 79,
    recommended: false,
    status: 'pendiente',
    category: 'Datos',
    apply_link: '#',
    ideal_scores: { psico: 72, cogni: 88, tech: 80, proy: 68 }
  },
  {
    id: 'vac-004',
    title: 'QA Engineer Automatización',
    company: 'GBM Cloud',
    employer_logo: null,
    location: 'Guadalajara, JAL',
    type: 'Tiempo completo',
    modality: 'Híbrido',
    description:
      'Responsable de automatización de pruebas con Selenium, Cypress y Jest. Colaboración estrecha con el equipo de desarrollo en metodología Agile/Scrum.',
    published_at: '2026-04-22',
    publisher: 'GBM Talent',
    match: 74,
    recommended: false,
    status: 'pendiente',
    category: 'QA',
    apply_link: '#',
    ideal_scores: { psico: 68, cogni: 78, tech: 82, proy: 65 }
  },
  {
    id: 'vac-005',
    title: 'DevOps Engineer',
    company: 'Wizeline',
    employer_logo: null,
    location: 'Guadalajara, JAL (Remoto)',
    type: 'Tiempo completo',
    modality: 'Remoto',
    description:
      'Buscamos ingeniero DevOps con experiencia en CI/CD, AWS o GCP, y gestión de infraestructura como código con Terraform. Equipo multicultural e internacional.',
    published_at: '2026-04-20',
    publisher: 'Wizeline Recruiting',
    match: 71,
    recommended: false,
    status: 'pendiente',
    category: 'Infraestructura',
    apply_link: '#',
    ideal_scores: { psico: 70, cogni: 82, tech: 90, proy: 62 }
  }
];

// ─── POSTULACIONES ────────────────────────────────────────────────────────────

export const MOCK_POSTULACIONES: AlumniPostulacion[] = [
  {
    id: 'post-001',
    vacanteId: 'vac-001',
    vacanteTitulo: 'Desarrollador Full Stack Angular / Node.js',
    empresaNombre: 'Softtek',
    fechaPostulacion: '2026-04-29',
    estado: 'En revisión'
  },
  {
    id: 'post-002',
    vacanteId: 'vac-002',
    vacanteTitulo: 'Ingeniero de Software Backend',
    empresaNombre: 'OXXO Digital',
    fechaPostulacion: '2026-04-27',
    estado: 'Entrevista agendada'
  }
];

// ─── TESTS / EVALUACIONES ────────────────────────────────────────────────────

export const MOCK_TESTS: TestResult[] = [
  {
    id: 'psico',
    name: 'Evaluación Psicométrica',
    category: 'Psicométrica',
    completed: true,
    score: 82,
    completedAt: new Date('2026-04-10T14:30:00'),
    description: 'Rasgos de personalidad y trabajo en equipo.'
  },
  {
    id: 'cogni',
    name: 'Prueba Cognitiva',
    category: 'Cognitiva',
    completed: true,
    score: 74,
    completedAt: new Date('2026-04-12T10:15:00'),
    description: 'Potencial de aprendizaje y razonamiento lógico.'
  },
  {
    id: 'tech',
    name: 'Examen Técnico de Carrera',
    category: 'Técnica',
    completed: true,
    score: 91,
    completedAt: new Date('2026-04-14T16:45:00'),
    description: 'Conocimientos específicos de tu área profesional.'
  },
  {
    id: 'proy',
    name: 'Prueba Proyectiva',
    category: 'Proyectiva',
    completed: false,
    description: 'Estabilidad emocional y rasgos profundos de personalidad.'
  }
];

export const MOCK_RESULTADO_PRUEBA: ResultadoPrueba = {
  resultado_id: 1,
  alumno_id: 1,
  puntaje_psicometrico: 82,
  puntaje_cognitivo: 74,
  puntaje_tecnico: 91,
  puntaje_proyectivo: null,
  psicometrico_completado_at: '2026-04-10T14:30:00Z',
  cognitivo_completado_at: '2026-04-12T10:15:00Z',
  tecnico_completado_at: '2026-04-14T16:45:00Z',
  proyectivo_completado_at: null
};

// ─── PRUEBAS SOT ─────────────────────────────────────────────────────────────

export const MOCK_ALUMNOS_PUNTAJES: AlumnoPuntajes[] = [
  {
    alumnoId: 'AL001',
    nombre: 'Carlos Hernández',
    carrera: 'Ingeniería en Sistemas Computacionales',
    puntajes: {
      psicometrica: 82,
      cognitiva: 74,
      tecnica: 91,
      proyectiva: 0,
      promedioGral: 82.33,
      fechaAplicacion: '2026-04-14'
    }
  },
  {
    alumnoId: 'AL002',
    nombre: 'María Fernández López',
    carrera: 'Administración de Empresas',
    puntajes: {
      psicometrica: 90,
      cognitiva: 88,
      tecnica: 76,
      proyectiva: 84,
      promedioGral: 84.5,
      fechaAplicacion: '2026-04-15'
    }
  },
  {
    alumnoId: 'AL003',
    nombre: 'Jorge Santana Ríos',
    carrera: 'Ingeniería Civil',
    puntajes: null
  }
];

export const MOCK_BENCHMARKS: EmpresaBenchmark[] = [
  {
    empresaId: 'EMP001',
    nombre: 'Softtek',
    puesto: 'Desarrollador Full Stack',
    requerimientos: { psicometrica: 72, cognitiva: 78, tecnica: 88, proyectiva: 65 },
    pesos: { psicometrica: 15, cognitiva: 20, tecnica: 50, proyectiva: 15 }
  },
  {
    empresaId: 'EMP002',
    nombre: 'BBVA México',
    puesto: 'Analista de Datos',
    requerimientos: { psicometrica: 75, cognitiva: 85, tecnica: 80, proyectiva: 70 },
    pesos: { psicometrica: 20, cognitiva: 35, tecnica: 30, proyectiva: 15 }
  },
  {
    empresaId: 'EMP003',
    nombre: 'Wizeline',
    puesto: 'DevOps Engineer',
    requerimientos: { psicometrica: 68, cognitiva: 80, tecnica: 92, proyectiva: 60 },
    pesos: { psicometrica: 10, cognitiva: 25, tecnica: 55, proyectiva: 10 }
  }
];

// ─── MONITOREO SOT ───────────────────────────────────────────────────────────

export const MOCK_MONITOREO_STATS: MonitoreoStats = {
  promedioGlobal: 80.4,
  puntajeMin: 42,
  puntajeMax: 97,
  desviacionEstandar: 12.3
};

export const MOCK_PROMEDIOS_CARRERA: MonitoreoPromedioCarrera[] = [
  { carrera: 'Ing. Sistemas',      psicometrica: 82, cognitiva: 79, tecnica: 88, proyectiva: 74 },
  { carrera: 'Administración',     psicometrica: 86, cognitiva: 83, tecnica: 71, proyectiva: 81 },
  { carrera: 'Ing. Civil',         psicometrica: 75, cognitiva: 72, tecnica: 85, proyectiva: 68 },
  { carrera: 'Contaduría',         psicometrica: 80, cognitiva: 77, tecnica: 69, proyectiva: 78 },
  { carrera: 'Medicina',           psicometrica: 88, cognitiva: 91, tecnica: 76, proyectiva: 85 },
  { carrera: 'Derecho',            psicometrica: 84, cognitiva: 80, tecnica: null, proyectiva: 82 },
  { carrera: 'Psicología',         psicometrica: 90, cognitiva: 76, tecnica: null, proyectiva: 88 },
  { carrera: 'Ing. Industrial',    psicometrica: 78, cognitiva: 81, tecnica: 83, proyectiva: 70 }
];

export const MOCK_HISTOGRAMA: HistogramaDataPoint[] = [
  { rango: '40-50', frecuencia: 3,  gaussCurva: 2.1  },
  { rango: '50-60', frecuencia: 8,  gaussCurva: 6.4  },
  { rango: '60-70', frecuencia: 18, gaussCurva: 15.8 },
  { rango: '70-80', frecuencia: 34, gaussCurva: 32.5 },
  { rango: '80-90', frecuencia: 28, gaussCurva: 30.2 },
  { rango: '90-100',frecuencia: 9,  gaussCurva: 13.0 }
];

// ─── INSERCIÓN LABORAL ───────────────────────────────────────────────────────

export const MOCK_INSERCION_STATS: InsercionGlobalStats = {
  totalEgresados: 412,
  contratados: 287,
  porcentajeInsercion: 70
};

export const MOCK_INSERCION_POR_CARRERA: InsercionCarrera[] = [
  { carrera: 'Ing. Sistemas',   porcentaje: 78 },
  { carrera: 'Administración',  porcentaje: 72 },
  { carrera: 'Ing. Civil',      porcentaje: 65 },
  { carrera: 'Contaduría',      porcentaje: 69 },
  { carrera: 'Medicina',        porcentaje: 85 },
  { carrera: 'Derecho',         porcentaje: 61 },
  { carrera: 'Psicología',      porcentaje: 58 },
  { carrera: 'Ing. Industrial', porcentaje: 74 }
];
