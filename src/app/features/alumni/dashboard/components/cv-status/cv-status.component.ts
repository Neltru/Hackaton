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

  constructor(private profileService: AlumniProfileService) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(profile => {
      this.statusItems = [
        {
          label: 'Fotografía de perfil',
          description: profile.foto_url ? 'Actualizada' : 'Faltante',
          incomplete: !profile.foto_url,
          completed: !!profile.foto_url,
          action: 'Subir',
          route: '/alumni/perfil'
        },
        {
          label: 'Currículum Vitae (Digital)',
          description: profile.cv_drive_url ? 'Enlazado' : 'Sin registrar',
          incomplete: !profile.cv_drive_url,
          completed: !!profile.cv_drive_url,
          action: profile.cv_drive_url ? 'Actualizar' : 'Agregar',
          route: '/alumni/perfil'
        },
        {
          label: 'Certificaciones',
          description: (profile.certificados?.length || 0) > 0 ? `${profile.certificados?.length} registradas` : 'Incompleto',
          incomplete: (profile.certificados?.length || 0) === 0,
          completed: (profile.certificados?.length || 0) > 0,
          action: 'Agregar',
          route: '/alumni/perfil'
        },
        {
          label: 'Trayectoria académica',
          description: 'Validada via SIEst',
          incomplete: false,
          completed: true,
          action: 'Ver',
          route: '/alumni/perfil'
        }
      ];
    });
  }
}
