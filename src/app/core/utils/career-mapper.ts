const CAREER_BY_CODE: Record<string, string> = {
  '01': 'Administracion',
  '02': 'Agrobiotecnologia',
  '03': 'Mercadotecnia',
  '04': 'Procesos Alimentarios',
  '05': 'TI',
  '06': 'Acuicultura',
  '07': 'Turismo',
  '08': 'Gastronomia',
  '09': 'Contaduria'
};

export interface InstitutionalEmailInfo {
  isValid: boolean;
  careerCode?: string;
  careerName: string;
  entryYear?: number;
}

export function deriveCareerFromInstitutionalEmail(email: string): InstitutionalEmailInfo {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const regex = /^al(\d{2})-\d{3}-(\d{4})@utdelacosta\.edu\.mx$/;
  const match = normalizedEmail.match(regex);

  if (!match) {
    return {
      isValid: false,
      careerName: 'Carrera no identificada'
    };
  }

  const careerCode = match[1];
  const generationCode = match[2];
  const yearSuffix = generationCode.slice(-2);
  const parsedYear = Number.parseInt(`20${yearSuffix}`, 10);

  return {
    isValid: true,
    careerCode,
    careerName: CAREER_BY_CODE[careerCode] || 'Carrera no identificada',
    entryYear: Number.isNaN(parsedYear) ? undefined : parsedYear
  };
}
