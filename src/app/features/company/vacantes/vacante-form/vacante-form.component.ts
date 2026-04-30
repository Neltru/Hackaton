import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompanyVacantesService } from '../../services/company-vacantes.service';

@Component({
  selector: 'app-company-vacante-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './vacante-form.component.html',
  styleUrl: './vacante-form.component.scss'
})
export class VacanteFormComponent implements OnInit {
  vacanteForm: FormGroup;
  isEditMode = false;
  vacanteId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vacantesService: CompanyVacantesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.vacanteForm = this.fb.group({
      title: ['', Validators.required],
      area: ['', Validators.required],
      salary: ['', Validators.required],
      description: ['', Validators.required],
      requirements: ['', Validators.required],
      benchmark: this.fb.group({
        psicometrico: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
        cognitivo: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
        tecnico: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
        proyectivo: [50, [Validators.required, Validators.min(0), Validators.max(100)]]
      })
    });
  }

  ngOnInit(): void {
    this.vacanteId = this.route.snapshot.paramMap.get('id');
    if (this.vacanteId) {
      this.isEditMode = true;
      const vacante = this.vacantesService.getVacanteById(this.vacanteId);
      if (vacante) {
        this.vacanteForm.patchValue(vacante);
      } else {
        this.router.navigate(['/company/vacantes']);
      }
    }
  }

  onSubmit(): void {
    if (this.vacanteForm.valid) {
      if (this.isEditMode && this.vacanteId) {
        this.vacantesService.updateVacante(this.vacanteId, this.vacanteForm.value);
      } else {
        this.vacantesService.createVacante({
          ...this.vacanteForm.value,
          status: 'Activa'
        });
      }
      this.router.navigate(['/company/vacantes']);
    }
  }
}
