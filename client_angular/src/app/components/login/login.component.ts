import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import {PasswordService} from "../../services/password-change.service";

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
  resetStep: number = 1;
  resetEmail: string = '';
  resetCode: string = '';
  newPassword: string = '';
  resetMessage: string = '';
  resetError: string = '';
  loading: boolean = false; // Added loading state
  forgottenPasswordForm: boolean = false;
  isLoading: boolean = false;
  constructor(private loginService: AuthService, private router: Router, private passwordService: PasswordService) {}

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

  motDepasseOublie(): void{
    this.forgottenPasswordForm=true;
  }

  goBack(): void{
    this.forgottenPasswordForm=false;
  }

  sendResetCode() {
    this.resetMessage = '';
    this.resetError = '';
    this.isLoading = true;
    this.passwordService.sendVerificationCode(this.resetEmail).subscribe({
      next: () => {
        this.resetMessage = 'Un code de vérification a été envoyé.';
        this.resetStep = 2;
        this.isLoading = false;
      },
      error: err => {
        this.resetError = 'Email introuvable ou erreur lors de l’envoi du code.';
        this.isLoading = false;
      }
    });
  }

  verifyCode() {
    this.resetError = '';
    this.isLoading = true;
    this.passwordService.verifyCode(this.resetEmail, this.resetCode).subscribe({
      next: () => {
        this.resetStep = 3;
        this.isLoading = false;
      },
      error: err => {
        this.resetError = 'Code invalide ou expiré.';
        this.isLoading = false;
      }
    });
  }

  resetPasswordFinal() {
    this.resetError = '';
    this.isLoading = true;
    this.passwordService.resetPassword(this.resetEmail, this.resetCode, this.newPassword).subscribe({
      next: () => {
        this.resetMessage = 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.';
        this.forgottenPasswordForm = false;
        this.resetStep = 1;
        this.isLoading=false;
      },
      error: err => {
        this.resetError = 'Veuillez vérifier votre adresse e-mail et réesayer';
        this.isLoading = false;
      }
    });
  }




}
