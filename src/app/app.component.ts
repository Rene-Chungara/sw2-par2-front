import { Component } from '@angular/core'; // Removed AfterViewInit, ChangeDetectorRef, HostListener, ViewChild
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component'; // Keep this import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent // Keep SidebarComponent here
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend-sw2';

  // No need for isSidebarOpen state or methods here, SidebarComponent manages itself
  // No need for windowRef or HostListener here
  constructor() {}
}