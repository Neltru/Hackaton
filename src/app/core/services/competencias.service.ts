import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompetenciasRanking } from '../models/competencias.models';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CompetenciasService {

  private apiUrl = `${API_CONFIG.baseUrl}/admin/reportes/ranking-competencias`;

  constructor(private http: HttpClient) { }

  getRanking(carreraFiltro: string): Observable<CompetenciasRanking> {
    return this.http.get<CompetenciasRanking>(this.apiUrl);
  }
}
