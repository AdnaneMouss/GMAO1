import { Component, OnInit } from '@angular/core';
import { PasswordService } from "../../../services/password-change.service";
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent implements OnInit {

  email: string = '';
  currentPassword: string = '';  // Add currentPassword field
  newPassword: string = '';
  verificationCode: string = '';
  isCodeSent: boolean = false;
  isPasswordChanged: boolean = false;
  errorMessage: string = '';
  showCurrentPassword: boolean = false;
  successMessage: string = '';
  isLoading = false;
  passwordInvalid: boolean = false;
  currentPasswordIncorrect=false;
  constructor(private passwordService: PasswordService, private router: Router) {}

  ngOnInit() {
    // Retrieve user object from localStorage and extract the email
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.email = user.email;

    if (!this.email) {
      // Handle the case if the email is not found in the user object
      this.errorMessage = 'Email not found. Please log in again.';
    }
  }

  sendVerificationCode() {
    console.log('📨 Email entered:', this.email);


    this.isLoading = true;
    this.errorMessage='';
    if (this.email && this.currentPassword && this.newPassword) {
      this.passwordService.checkCurrentPassword(this.currentPassword, this.email).subscribe({
        next: (response) => {
          if (response === 'Mot de passe vérifié avec succès.') {
            console.log('✅ Current password is correct, sending verification code.');

            this.passwordService.sendVerificationCode(this.email).subscribe({
              next: (verificationResponse) => {
                console.log('📩 Verification code sent:', verificationResponse);
                this.currentPasswordIncorrect=false;
                this.isCodeSent = true;
                this.errorMessage = '';
                this.isLoading = false;
                this.passwordInvalid=false;
              },
              error: (verificationError: HttpErrorResponse) => {
                console.error('❌ Error while sending verification code:', verificationError);
                this.isLoading = false; // Stop loader
                if (verificationError.status && verificationError.error) {
                  this.errorMessage = `Error: ${verificationError.status} - ${verificationError.error.message || verificationError.message}`;
                } else {
                  this.errorMessage = 'An error occurred while sending the verification code.';
                }
              }
            });
          } else {
            this.isLoading = false;
            this.currentPasswordIncorrect = true;
            this.errorMessage = response || 'Le mot de passe actuel est incorrect.';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error while checking the current password:', error);
          this.isLoading = false; // Stop loader
          if (error.status && error.error) {
            this.errorMessage = `Error: ${error.status} - ${error.error.message || error.message}`;
          } else {
            this.errorMessage = 'An error occurred while verifying the current password.';
          }
        }
      });
    } else {
      this.isLoading = false; // Stop loader
      this.errorMessage = 'Please enter your email, current password, and new password before requesting the verification code.';
    }
  }

  changePassword() {

    if ( this.email && this.currentPassword && this.newPassword) {
      this.passwordService.verifyCodeAndChangePassword(
        this.email,
        this.verificationCode,
        this.currentPassword,
        this.newPassword
      ).subscribe({
        next: (response) => {
          console.log('🔒 Password changed successfully:', response);
          this.isPasswordChanged = true;
          this.successMessage = 'Votre mot de passe a été mis à jour avec succès.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
          this.errorMessage = '';
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error while verifying code/changing password:', error);
          if (error.status === 400 && error.error) {
            this.errorMessage = error.error.message || 'Code de vérification invalide ou échec de la modification.';
          } else {
            this.errorMessage = 'Une erreur est survenue lors du changement de mot de passe.';
          }
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs avant de soumettre.';
    }
  }

  validatePassword(password: string) {

    const passwordRegex = /^(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      this.passwordInvalid = true;
      this.errorMessage = "Le mot de passe doit contenir 8 caractères, dont un caractère spécial et un chiffre.";
    } else {
      this.passwordInvalid = false;
    }
  }


}
