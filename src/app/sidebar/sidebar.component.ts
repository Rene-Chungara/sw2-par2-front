import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core'; // Removed @Input, @Output, EventEmitter
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @ViewChild('sidebarElement') sidebarElement!: ElementRef;

  isSidebarOpen: boolean = false; // Internal state for sidebar visibility
  windowRef: Window = window; // Reference to window object for width checks

  constructor() { }

  ngOnInit(): void {
    // Set initial sidebar state based on screen size on component load
    if (this.windowRef.innerWidth >= 768) {
      this.isSidebarOpen = true;
    }
  }

  ngOnDestroy(): void {
    // Cleanup if any manual event listeners were added
  }

  // Method to toggle sidebar visibility
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Close sidebar on click outside on mobile
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    // Only close if on a mobile view (less than md breakpoint) AND sidebar is open
    // AND the click was outside the sidebar element itself AND not on the hamburger button
    if (this.windowRef.innerWidth < 768 && this.isSidebarOpen) {
      const targetElement = event.target as HTMLElement;
      const hamburgerButton = document.getElementById('menuButton'); // Ensure this ID is used for the button

      if (this.sidebarElement && !this.sidebarElement.nativeElement.contains(targetElement) &&
          (!hamburgerButton || !hamburgerButton.contains(targetElement))) {
        this.isSidebarOpen = false; // Directly close the sidebar
      }
    }
  }

  // Handle sidebar visibility on resize
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.windowRef.innerWidth >= 768) { // md breakpoint
      this.isSidebarOpen = true; // Ensure sidebar is visible on desktop
    } else {
      this.isSidebarOpen = false; // Hide sidebar on smaller screens
    }
  }
}