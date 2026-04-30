import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CompanyRegistrationData {
  name: string;
  rfc: string;
  email: string;
  location: string;
  // ... other fields
}

export interface CompanyRegistrationResult {
  success: boolean;
  status: 'Con convenio' | 'Sin convenio';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyRegistrationService {

  // Lista de municipios considerados "Zona Norte" del estado de Nayarit
  private readonly ZONA_NORTE = [
    'Acaponeta', 
    'Tecuala', 
    'Huajicori', 
    'Tuxpan', 
    'Ruiz', 
    'Rosamorada', 
    'Santiago Ixcuintla'
  ];

  constructor() { }

  /**
   * Simula el registro de una empresa y determina automáticamente su estado de convenio.
   */
  registerCompany(data: CompanyRegistrationData): Observable<CompanyRegistrationResult> {
    // Lógica geográfica: Si la ubicación de la empresa está en la Zona Norte, obtiene convenio automático
    const isZonaNorte = this.ZONA_NORTE.some(municipio => 
      data.location.toLowerCase().includes(municipio.toLowerCase())
    );

    let status: 'Con convenio' | 'Sin convenio' = 'Sin convenio';
    let message = 'Empresa registrada exitosamente. Estatus: Sin convenio (hasta confirmación de contratación).';

    if (isZonaNorte) {
      status = 'Con convenio';
      message = 'Empresa registrada exitosamente. Estatus: Con convenio (asignado automáticamente por zona geográfica).';
    }

    // Aquí iría la llamada HTTP real al backend
    console.log(`[Sistema UT] Registrando empresa ${data.name} en ${data.location}. Resultado: ${status}`);

    return of({
      success: true,
      status: status,
      message: message
    });
  }
}
