import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HiringReport {
  id?: string;
  companyName: string;
  location: string;
  isNational: boolean; // true si es fuera del norte de Nayarit
  position: string;
  startDate: Date;
  requiresAgreement: boolean;
  status: 'pending_validation' | 'validated';
}

@Injectable({
  providedIn: 'root'
})
export class HiringService {
  private hiringReports$ = new BehaviorSubject<HiringReport[]>([]);

  constructor() {}

  reportHiring(report: Omit<HiringReport, 'id' | 'requiresAgreement' | 'status'>): void {
    // Lógica de negocio: Si no es en el norte de Nayarit, requiere convenio
    const isNorthNayarit = report.location.toLowerCase().includes('norte de nayarit') || 
                          report.location.toLowerCase().includes('santiago ixcuintla') ||
                          report.location.toLowerCase().includes('ruiz') ||
                          report.location.toLowerCase().includes('tuxpan');

    const newReport: HiringReport = {
      ...report,
      id: Math.random().toString(36).substring(7),
      requiresAgreement: !isNorthNayarit,
      status: 'pending_validation'
    };

    const current = this.hiringReports$.value;
    this.hiringReports$.next([...current, newReport]);

    // Notificar a la administración (Simulado)
    if (newReport.requiresAgreement) {
      console.log('⚠️ ALERTA: Nuevo convenio pendiente detectado para la empresa:', newReport.companyName);
    }
  }

  getHiringReports(): Observable<HiringReport[]> {
    return this.hiringReports$.asObservable();
  }
}
