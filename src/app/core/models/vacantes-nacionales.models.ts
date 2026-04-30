export interface VacanteNacional {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string; // Estado de la república fuera de Nayarit
  salario: string;
  modalidad: 'Presencial' | 'Remoto' | 'Híbrido';
  fecha_publicacion: string;
  link_externo: string; // Link a la API original (Indeed, LinkedIn, etc.)
  es_nacional: boolean;
}

export interface AlertaConvenio {
  id: string;
  egresado_nombre: string;
  empresa_nacional: string;
  fecha_contratacion: string;
  estatus: 'Pendiente' | 'En Proceso' | 'Formalizado';
}
