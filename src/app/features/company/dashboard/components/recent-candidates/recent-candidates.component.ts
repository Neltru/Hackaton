import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Candidate {
  id: string;
  initials: string;
  name: string;
  job: string;
  stage: string;
  stageColor: string;
  date: string;
}

@Component({
  selector: 'app-recent-candidates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-candidates.component.html',
  styleUrl: './recent-candidates.component.scss'
})
export class RecentCandidatesComponent {
  candidates: Candidate[] = [
    { id: '01', initials: 'AG', name: 'Alicia García', job: 'Desarrollador Full Stack', stage: 'Entrevista técnica', stageColor: 'warning', date: '28 abr 2026' },
    { id: '02', initials: 'RM', name: 'Rodrigo Mena', job: 'Gerente de Marketing', stage: 'Revisión CV', stageColor: 'info', date: '27 abr 2026' },
    { id: '03', initials: 'LT', name: 'Luisa Torres', job: 'Desarrollador Full Stack', stage: 'Oferta enviada', stageColor: 'success', date: '26 abr 2026' },
    { id: '04', initials: 'JP', name: 'Jorge Peña', job: 'UX / UI Designer', stage: 'Revisión CV', stageColor: 'info', date: '25 abr 2026' },
    { id: '05', initials: 'SC', name: 'Sandra Cruz', job: 'Analista de Datos', stage: 'Descartado', stageColor: 'neutral', date: '24 abr 2026' }
  ];
}
