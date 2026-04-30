import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfReportService {

  async generateIdoneidadReport(elementId: string, fileName: string): Promise<void> {
    const data = document.getElementById(elementId);
    if (!data) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    // Configurar el canvas para alta calidad
    const canvas = await html2canvas(data, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${fileName}.pdf`);
  }
}
