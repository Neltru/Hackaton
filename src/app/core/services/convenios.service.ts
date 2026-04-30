import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Convenio, ConveniosStats, EmpresaPendiente, EmpresaPorVencer, ReporteConveniosStats, MapaRegion, MapaStats } from '../models/convenios.models';

@Injectable({
  providedIn: 'root'
})
export class ConveniosService {

  // Mock data as per the mockup
  private mockConvenios: Convenio[] = [
    { id: '1', empresa: 'Grupo Bafar Tepic', zona: 'Norte Nayarit', tipo: 'Automático', estado: 'Activo', fechaVencimiento: null },
    { id: '2', empresa: 'TechnoSoft CDMX', zona: 'Nacional', tipo: 'Contratación', estado: 'Activo', fechaVencimiento: '2026-11-30' },
    { id: '3', empresa: 'Industrias Cañedo', zona: 'Norte Nayarit', tipo: 'Automático', estado: 'Activo', fechaVencimiento: null },
    { id: '4', empresa: 'Constructora Orion', zona: 'Nacional', tipo: 'Contratación', estado: 'Pendiente', fechaVencimiento: null },
    { id: '5', empresa: 'Logística del Pacífico', zona: 'Nacional', tipo: 'Contratación', estado: 'Por vencer', fechaVencimiento: '2026-06-15' }
  ];

  private mockStats: ConveniosStats = {
    activos: 48,
    pendientes: 9,
    porVencer: 5
  };

  private mockReporteStats: ReporteConveniosStats = {
    activas: 48,
    proximosVencer: 5,
    pendientesFormalizacion: 9
  };

  private mockEmpresasPendientes: EmpresaPendiente[] = [
    { empresa: 'Constructora Orion', egresado: 'Luis Pérez', vacante: 'Ing. Civil', diasPendiente: 18 },
    { empresa: 'Distribuidora Norte', egresado: 'Ana Ruiz', vacante: 'Administración', diasPendiente: 32 },
    { empresa: 'Grupo Salinas', egresado: 'Mario León', vacante: 'TI', diasPendiente: 9 }
  ];

  private mockEmpresasPorVencer: EmpresaPorVencer[] = [
    { empresa: 'Logística del Pacífico', fechaVencimiento: '2026-06-15' },
    { empresa: 'TechnoSoft CDMX', fechaVencimiento: '2026-06-28' }
  ];

  private mockMapaStats: MapaStats = {
    zonaNorte: 31,
    nacional: 17
  };

  private mockMapaRegiones: MapaRegion[] = [
    { id: 'nayarit', nombre: 'Nayarit', convenios: 31, tipo: 'automatico', intensidad: 100, size: 'large' },
    { id: 'cdmx', nombre: 'CDMX', convenios: 7, tipo: 'contratacion', intensidad: 40, size: 'medium' },
    { id: 'jal', nombre: 'JAL', convenios: 5, tipo: 'contratacion', intensidad: 30, size: 'medium' },
    { id: 'nl', nombre: 'NL', convenios: 5, tipo: 'contratacion', intensidad: 10, size: 'small' }
  ];

  constructor() { }

  getConvenios(): Observable<Convenio[]> {
    return of(this.mockConvenios).pipe(delay(400));
  }

  getStats(): Observable<ConveniosStats> {
    return of(this.mockStats).pipe(delay(400));
  }

  getReporteStats(): Observable<ReporteConveniosStats> {
    return of(this.mockReporteStats).pipe(delay(400));
  }

  getEmpresasPendientes(): Observable<EmpresaPendiente[]> {
    return of(this.mockEmpresasPendientes).pipe(delay(400));
  }

  getEmpresasPorVencer(): Observable<EmpresaPorVencer[]> {
    return of(this.mockEmpresasPorVencer).pipe(delay(400));
  }

  getMapaStats(): Observable<MapaStats> {
    return of(this.mockMapaStats).pipe(delay(400));
  }

  getMapaRegiones(filtro: string): Observable<MapaRegion[]> {
    // For mockup purposes, returning the same regions
    return of(this.mockMapaRegiones).pipe(delay(400));
  }
}
