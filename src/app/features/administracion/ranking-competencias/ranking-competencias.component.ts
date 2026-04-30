import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompetenciasService } from '../../../core/services/competencias.service';
import { CompetenciasRanking } from '../../../core/models/competencias.models';

@Component({
  selector: 'app-ranking-competencias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ranking-competencias.component.html',
  styleUrl: './ranking-competencias.component.scss'
})
export class RankingCompetenciasComponent implements OnInit {
  isLoading = true;
  ranking: CompetenciasRanking | null = null;
  selectedCarrera = 'Todas las carreras';

  constructor(private competenciasService: CompetenciasService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.competenciasService.getRanking(this.selectedCarrera).subscribe(data => {
      this.ranking = data;
      this.isLoading = false;
    });
  }

  onFilterChange(): void {
    this.loadData();
  }
}
