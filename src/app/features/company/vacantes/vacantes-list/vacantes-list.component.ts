import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyVacantesService, CompanyVacante } from '../../services/company-vacantes.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-company-vacantes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vacantes-list.component.html',
  styleUrl: './vacantes-list.component.scss'
})
export class VacantesListComponent implements OnInit {
  vacantes$!: Observable<CompanyVacante[]>;

  constructor(private vacantesService: CompanyVacantesService) {}

  ngOnInit(): void {
    this.vacantes$ = this.vacantesService.getVacantes();
  }

  darDeBaja(id: string): void {
    if(confirm('¿Estás seguro de que quieres dar de baja esta vacante?')) {
      this.vacantesService.updateVacante(id, { status: 'Cerrada' });
    }
  }

  pausar(id: string): void {
    this.vacantesService.updateVacante(id, { status: 'Pausada' });
  }
}
