import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-infos-utilisateurs',
  templateUrl: './infos-utilisateurs.component.html',
  styleUrls: ['./infos-utilisateurs.component.css']
})
export class InfosUtilisateursComponent implements OnInit {
  user: User | null = null;
  editingField: keyof User | null = null;
  editedValue: string = '';
  errorMessage: string = '';
  emailInvalid: boolean = false;
  gsmInvalid: boolean = false;
  successMessage: string = "";
  userUpdated: boolean = false;
  deactivated: boolean = false;
  showConfirmationModal: boolean = false; // To control the confirmation modal visibility
  emailTakenError = false;
  usernameTaken = false;
  gsmTakenError = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      console.warn('No user found in local storage');
    }
  }

  getImageUrl(imagePath: string | undefined): string {
    return `${environment.apiUrl}${imagePath}`;
  }

  // Start editing a specific field
  startEditing(field: keyof User): void {
    this.editingField = field;
    this.editedValue = this.user ? this.user[field]?.toString() || '' : '';
  }


  saveEdit(inputRef?: any): void {
    if (!this.user || !this.editingField) return;

    // Reset previous errors
    this.errorMessage = '';
    this.successMessage = '';
    this.emailTakenError = false;
    this.usernameTaken = false;
    this.gsmTakenError = false;

    // General empty check
    if (!this.editedValue || this.editedValue.trim() === '') {
      this.errorMessage = "Le champ ne peut pas être vide.";
      inputRef?.control.markAsTouched();
      return;
    }

    // Specific validations by field
    switch (this.editingField) {
      case 'email':
        this.validateEmail(this.editedValue);
        if (this.emailInvalid) {
          inputRef?.control.markAsTouched();
          return;
        }
        break;

      case 'gsm':
        this.validateGSM(this.editedValue);
        if (this.gsmInvalid) {
          inputRef?.control.markAsTouched();
          return;
        }
        break;

      case 'nom':
        if (this.editedValue.length < 2) {
          this.errorMessage = "Le nom doit contenir au moins 2 caractères.";
          inputRef?.control.markAsTouched();
          return;
        }
        break;

      case 'username':
        if (this.editedValue.length < 4) {
          this.errorMessage = "Le nom d'utilisateur doit contenir au moins 4 caractères.";
          inputRef?.control.markAsTouched();
          return;
        }
        break;
    }


    // Proceed to update
    this.userService.updateField(this.user.id, this.editingField, this.editedValue)
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.userUpdated = true;
          switch (this.editingField) {
            case 'email':
              this.successMessage = "Vous avez modifié votre adresse e-mail avec succès.";
              break;
            case 'username':
              this.successMessage = "Vous avez modifié votre nom d'utilisateur avec succès.";
              break;
            case 'gsm':
              this.successMessage = "Vous avez modifié votre numéro de téléphone avec succès.";
              break;
            case 'nom':
              this.successMessage = "Vous avez modifié votre nom avec succès.";
              break;
          }
          this.editingField = null;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },
        error: (error) => {
          console.error("Update failed:", error);

          if (error.status === 409 && error.error) {
            const field = error.error.field;
            const message = error.error.message;

            switch (field) {
              case 'email':
                this.emailTakenError = true;
                break;
              case 'username':
                this.usernameTaken = true;
                break;
              case 'gsm':
                this.gsmTakenError = true;
                break;
            }

            this.errorMessage = message || 'Un conflit est survenu.';
            inputRef?.control.markAsTouched();

          } else if (error.status === 400) {
            this.errorMessage = 'Données invalides. Veuillez réessayer.';
          } else if (error.status === 404) {
            this.errorMessage = 'Utilisateur non trouvé.';
          } else {
            this.errorMessage = 'Échec de la mise à jour.';
          }
        }
      });
  }

  // Cancel editing and revert to the previous value
  cancelEdit(): void {
    this.editingField = null;
    this.errorMessage='';
  }

  validateEmail(email: string) {
    if (!email.endsWith('@huir.ma')) {
      this.emailInvalid = true;
      this.errorMessage = "L'email doit se terminer par @huir.ma.";
    } else {
      this.emailInvalid = false;
    }
  }

  validateGSM(gsm: string) {
    const gsmRegex = /^\d{10}$/;
    if (!gsmRegex.test(gsm.trim())) {
      this.gsmInvalid = true;
      this.errorMessage = "Le numéro doit contenir exactement 10 chiffres.";
    } else {
      this.gsmInvalid = false;
    }
  }

  formatDateWithIntl(date: string | undefined): string {
    if (!date) {
      return 'Date non disponible'; // Or provide a default string if date is undefined
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date'; // Return fallback if date parsing fails
    }

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    return formatter.format(parsedDate);
  }

  // Open confirmation modal
  openConfirmationModal() {
    this.showConfirmationModal = true;
  }

  // Close the confirmation modal without deactivating
  closeConfirmationModal() {
    this.showConfirmationModal = false;
  }

  // Handle the deactivation confirmation
  onConfirmDeactivate() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userService.deactivateUser(user.id).subscribe(() => {
        this.deactivated = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000); // 4 seconds delay before redirect
      });
    }
    this.showConfirmationModal = false;  // Close the modal after confirming
  }

}
