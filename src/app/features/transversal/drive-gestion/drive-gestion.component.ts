import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriveService } from '../../../core/services/drive.service';
import { DriveFile, UploadStatus } from '../../../core/models/drive.models';

@Component({
  selector: 'app-drive-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drive-gestion.component.html',
  styleUrl: './drive-gestion.component.scss'
})
export class DriveGestionComponent implements OnInit {
  archivos: DriveFile[] = [];
  loading: boolean = true;
  uploadStatus: UploadStatus | null = null;
  selectedFile: File | null = null;
  selectedTipo: DriveFile['tipo'] = 'CV';

  constructor(private driveService: DriveService) {}

  ngOnInit(): void {
    this.loadArchivos();
  }

  loadArchivos(): void {
    this.loading = true;
    this.driveService.getArchivos().subscribe(data => {
      this.archivos = data;
      this.loading = false;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  subir(): void {
    if (!this.selectedFile) return;

    this.driveService.subirArchivo(this.selectedFile, this.selectedTipo).subscribe(status => {
      this.uploadStatus = status;
      if (status.estado === 'Completado') {
        this.loadArchivos();
        this.selectedFile = null;
        setTimeout(() => this.uploadStatus = null, 3000);
      }
    });
  }

  eliminar(id: string): void {
    if (confirm('¿Estás seguro de eliminar la referencia de este archivo? (No se borrará del Drive físico en esta demo)')) {
      this.driveService.eliminarArchivo(id).subscribe(() => this.loadArchivos());
    }
  }

  getFileIcon(tipo: string): string {
    switch (tipo) {
      case 'CV': return '📄';
      case 'Certificado': return '📜';
      case 'Reporte': return '📊';
      case 'Imagen': return '🖼️';
      default: return '📁';
    }
  }
}
