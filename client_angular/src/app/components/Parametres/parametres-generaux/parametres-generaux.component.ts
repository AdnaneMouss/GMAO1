import { Component } from '@angular/core';

@Component({
  selector: 'app-parametres-generaux',
  templateUrl: './parametres-generaux.component.html',
  styleUrl: './parametres-generaux.component.css'
})
export class ParametresGenerauxComponent {
  selectedSection: string = 'account';
  isEditMode: boolean = false;

  // User Info
  user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    password: '',
    confirmPassword: ''
  };

  // Settings (Notifications, Theme, Language, Security)
  settings = {
    notifications: {
      email: true,
      push: false
    },
    theme: 'light',  // Options: 'light', 'dark'
    language: 'fr',  // Options: 'fr', 'en', 'es'
    security: {
      twoFactor: false
    }
  };

  // Switch between settings sections
  selectSection(section: string) {
    this.selectedSection = section;
  }

  // Toggle between view and edit modes
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  // Save changes (implement actual logic/API calls later)
  saveChanges() {
    console.log('Changes saved!', this.settings, this.user);
  }

  // Check if the form is valid
  get formValid() {
    return this.user.password === this.user.confirmPassword && this.user.email && this.user.name;
  }
}
