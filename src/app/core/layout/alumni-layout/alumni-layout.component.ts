import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlumniSidebarComponent } from '../components/alumni-sidebar/alumni-sidebar.component';

@Component({
  selector: 'app-alumni-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AlumniSidebarComponent],
  templateUrl: './alumni-layout.component.html',
  styleUrl: './alumni-layout.component.scss'
})
export class AlumniLayoutComponent {

}
