import { Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-dashbord',
  imports: [AccordionModule],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.scss',
})
export class TaskDashbordComponent implements OnInit {
  username = localStorage.getItem('username') || 'کاربر';

  constructor(private router: Router) {}

  navigateToRadyabi() {
    this.router.navigate(['/dashbord']);
  }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const map = new google.maps.Map(
      document.getElementById('map-background') as HTMLElement,
      {
        center: { lat: 29.5916, lng: 52.5836 },
        zoom: 12,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ visibility: 'on' }, { color: '#ffffff' }],
          },
        ],
      }
    );
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    this.router.navigate(['/task']);
  }
}
