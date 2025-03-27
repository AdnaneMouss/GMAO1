import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false; // Added loading state

  constructor(private loginService: AuthService, private router: Router) {}

  onLogin(event: SubmitEvent) {
    event.preventDefault();
    this.errorMessage = '';  // Clear previous errors
    this.loading = true;  // Start loading

    this.loginService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.loading = false;  // Stop loading

        if (!response.actif) {
          this.errorMessage = "Votre compte est désactivé. Veuillez contacter l'administrateur.";
          return;
        }

        localStorage.setItem('user', JSON.stringify(response));

        switch (response.role) {
          case "ADMIN":
            this.router.navigate(['/utilisateurs/liste']);
            break;
          case "TECHNICIEN":
            this.router.navigate(['/interventions/taches']);
            break;
          case "RESPONSABLE":
            this.router.navigate(['/equipements/list']);
            break;
          default:
            this.errorMessage = "Rôle non reconnu.";
        }
      },

      error: (error) => {
        this.loading = false;  // Stop loading on error
        console.error('Login error:', error);
        this.errorMessage = 'Identifiants incorrects, veuillez réessayer.';
      }
    });
  }

}
