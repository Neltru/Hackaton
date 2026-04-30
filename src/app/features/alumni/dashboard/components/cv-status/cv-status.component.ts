import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlumniProfileService } from '../../../../../core/services/alumni-profile.service';

@Component({
  selector: 'app-cv-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cv-status.component.html',
  styleUrl: './cv-status.component.scss'
})
export class CvStatusComponent implements OnInit {
  statusItems: any[] = [];

  constructor(private profileService: AlumniProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(profile => {
      this.statusItems = [
        { 
          label: 'Fotografía de perfil', 
          description: profile.photo ? 'Actualizada' : 'Faltante', 
          incomplete: !profile.photo,
          action: 'Subir',
          route: '/alumni/perfil'
        },
        { 
          label: 'Currículum Vitae (PDF)', 
          description: profile.cv ? 'Subido' : 'Sin registrar', 
          incomplete: !profile.cv,
          action: profile.cv ? 'Actualizar' : 'Agregar',
          route: '/alumni/perfil'
        },
        { 
          label: 'Certificaciones', 
          description: profile.certificates.length > 0 ? `${profile.certificates.length} registradas` : 'Incompleto', 
          incomplete: profile.certificates.length === 0,
          action: 'Agregar',
          route: '/alumni/perfil'
        },
        { 
          label: 'Trayectoria académica', 
          description: 'Validada', 
          incomplete: false,
          action: 'Ver',
          route: '/alumni/perfil'
        }
      ];
    });
  }
}
