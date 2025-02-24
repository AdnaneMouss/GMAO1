import { Component } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  shouldShowNavbar = true;  // Default to true (show navbar)

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      // Check the current route and decide whether to show the navbar
      this.shouldShowNavbar = this.router.url !== '/login'; // Hide navbar on /login route
    });
  }
}
