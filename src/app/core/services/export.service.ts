import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(private http: HttpClient) { }

  /**
   * Solicita al servidor generar un reporte y dispara la descarga.
   * @param tipo 'alumnos', 'convenios' o 'vacantes'
   */
  exportFromServer(tipo: string): void {
    const url = `${API_CONFIG.baseUrl}/admin/exportar/${tipo}`;
    
    // Usamos HttpClient para manejar posibles errores o autenticación si fuera necesario,
    // pero para una descarga directa simple de archivo a veces basta con window.open o un link.
    // Sin embargo, como requiere JWT (vía interceptor), HttpClient es mejor.
    
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const filename = `reporte_${tipo}_${new Date().getTime()}`;
        // Detectar si el blob es PDF o Excel (si el backend lo envía correctamente)
        // Por ahora asumo PDF por defecto o dejo que el navegador lo maneje.
        this.triggerDownload(blob, `${filename}.pdf`); 
      },
      error: (err) => {
        console.error('Error al exportar reporte desde el servidor', err);
      }
    });
  }

  /**
   * Exporta un arreglo de objetos a un archivo CSV (apertura nativa en Excel).
   * @param data Arreglo de datos (ej. candidatos o plantilla)
   * @param filename Nombre del archivo (sin extensión)
   * @param headers Opcional: Nombres de columnas personalizados
   */
  exportToCsv(data: any[], filename: string, headers?: string[]): void {
    if (!data || !data.length) {
      console.warn('No hay datos para exportar a CSV');
      return;
    }

    // Extraer llaves del primer objeto si no hay headers definidos
    const keys = Object.keys(data[0]);
    const columnHeaders = headers ? headers.join(',') : keys.join(',');

    // Crear filas CSV
    const csvRows = data.map(row => {
      return keys.map(key => {
        let cell = row[key] === null || row[key] === undefined ? '' : row[key];
        
        // Limpiar strings que contengan comas, comillas o saltos de línea
        if (typeof cell === 'string') {
          cell = cell.replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
        }
        return cell;
      }).join(',');
    });

    const csvString = [columnHeaders, ...csvRows].join('\n');
    
    // Agregar BOM para soporte UTF-8 en Excel
    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    
    this.triggerDownload(blob, `${filename}.csv`);
  }

  /**
   * Prepara la interfaz y lanza la ventana de impresión nativa del navegador.
   * La empresa puede guardarlo como PDF desde la ventana de impresión.
   * @param title Título del reporte para el documento impreso
   */
  exportToPdfViaPrint(title: string): void {
    // Cambiar el título temporalmente para que el PDF se guarde con ese nombre por defecto
    const originalTitle = document.title;
    document.title = title;
    
    // Lanzar impresión
    window.print();
    
    // Restaurar título después de imprimir
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
