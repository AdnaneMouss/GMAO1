import { Component } from '@angular/core';
import { PasswordService } from "../../../services/password-change.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  verificationCode: string = ''; // Added for verification code
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isCodeSent: boolean = false; // Track if the code has been sent

  constructor(private passwordService: PasswordService) {}

  // Send verification code to user's email
  sendVerificationCode() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  // Retrieve user object from localStorage
    const email = user?.email;  // Get the email from the user object

    console.log('User from localStorage:', user); // Log the full user object
    console.log('Email retrieved:', email);  // Log the email to verify it's being fetched

    if (email) {
      this.passwordService.sendVerificationCode(email).subscribe({
        next: (res) => {
          console.log('Response from backend:', res);  // Log the response from backend for better debugging
          this.successMessage = 'Code envoyé à votre email!';
          this.isCodeSent = true;
        },
        error: (err) => {
          this.isCodeSent = true;
          console.error('Error while sending code:', err);  // Log the error if any
          this.errorMessage = err.error || "Une erreur s'est produite.";
        },
      });
    } else {
      console.error('Utilisateur introuvable.');  // If email is not found, log an error
      this.errorMessage = 'Utilisateur introuvable.';
    }
  }


  // Change password after verifying the code
  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword || !this.verificationCode) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.isLoading = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const email = user?.email;

    if (email) {
      this.passwordService
        .verifyCodeAndChangePassword(email, this.verificationCode, this.newPassword)
        .subscribe({
          next: (res) => {
            this.successMessage = res.message;
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
            this.verificationCode = '';
          },
          error: (err) => {
            this.errorMessage = err.error || "Une erreur s'est produite.";
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.errorMessage = 'Utilisateur introuvable.';
    }
  }

}
