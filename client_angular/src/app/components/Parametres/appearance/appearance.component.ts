import { Component } from '@angular/core';
import {ThemeService} from "../../../services/theme.service";

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrl: './appearance.component.css'
})
export class AppearanceComponent {
  isDark = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDark = this.themeService.isDarkMode();
  }

  toggleDarkMode(event: any) {
    this.isDark = event.target.checked;
    this.themeService.toggleTheme(this.isDark);
  }
}
