export interface BateriaPuntajes {
  psicometrica: number;
  cognitiva: number;
  tecnica: number;
  proyectiva: number;
  promedioGral: number;
  fechaAplicacion: string;
}

export interface AlumnoPuntajes {
  alumnoId: string;
  nombre: string;
  carrera: string;
  puntajes: BateriaPuntajes | null; // null si no ha realizado las pruebas
}

export interface EmpresaBenchmark {
  empresaId: string;
  nombre: string;
  puesto: string;
  requerimientos: {
    psicometrica: number;
    cognitiva: number;
    tecnica: number;
    proyectiva: number;
  };
  pesos: {
    psicometrica: number;
    cognitiva: number;
    tecnica: number;
    proyectiva: number;
  };
}

export interface ComparativaBenchmark {
  alumno: AlumnoPuntajes;
  benchmark: EmpresaBenchmark;
  compatibilidad: number; // Porcentaje de coincidencia
}
