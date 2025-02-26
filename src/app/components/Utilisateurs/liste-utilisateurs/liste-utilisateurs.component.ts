import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-liste-utilisateurs',
  templateUrl: './liste-utilisateurs.component.html',
  styleUrl: './liste-utilisateurs.component.css'
})

export class ListeUtilisateursComponent implements OnInit {
  users: User[] = [];
  selectedFilter: string = '';
  isSortedAZ: boolean = true;
  errorMessage: string = '';
  isSearchOpen = false;
  searchTerm = '';
  filteredUsers = [...this.users];

  newUser: User = {
    actif: true,  // Set actif to true by default when adding new user
    civilite: 'M',
    dateInscription: new Date().toISOString(),  // Set current timestamp in ISO format
    gsm: '',
    id: 0,
    nom: '',
    username: '',
    email: '',
    password: '',
    role: 'ADMIN',
    image: ''
  };
  passwordVisible = false;
  showPanel = false; // Controls the panel visibility
  searchVisible: boolean = false;
  usernameTaken = false;
  gsmError = false;
  emailError = false;
  passwordError = false;
  existingUsernames: string[] = []; 

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users';
      }
    });
  }
  checkUsername(): void {
    this.usernameTaken = this.existingUsernames.includes(this.newUser.username);
  }
  

  addUser(): void {
    // Vérification si le nom d'utilisateur est déjà pris
    this.usernameTaken = this.existingUsernames.includes(this.newUser.username);
    
  
    // Validation du numéro de téléphone (doit contenir exactement 10 chiffres)
    this.gsmError = !/^\d{10}$/.test(this.newUser.gsm);
  
    // Validation de l'email (doit se terminer par @huir.ma)
    this.emailError = !this.newUser.email.endsWith('@huir.ma');
  
    // Validation du mot de passe (doit contenir des caractères spéciaux)
    this.passwordError = !/[!@#$%^&*(),.?":{}|<>]/.test(this.newUser.password);
  
    // Si une des validations échoue, ne pas soumettre le formulaire
    if (this.usernameTaken || this.gsmError || this.emailError || this.passwordError) {
      return; // Sortir de la fonction et ne pas envoyer de requête
    }
  
    // Si les validations passent, procéder à la création de l'utilisateur
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        alert('User added successfully.');
        this.fetchUsers();  // Rafraîchir la liste des utilisateurs
        this.resetNewUser(); // Réinitialiser le formulaire
        this.showPanel = false; // Masquer le panneau après l'ajout
      },
      error: (err) => {
        console.error('Error adding user:', err); // Affiche toute l'erreur dans la console
        if (err && err.error) {
          // Si err.error existe, vous pouvez l'inspecter en profondeur
          console.error('Error details:', err.error);
          this.errorMessage = `Failed to add user: ${err.error.message || 'No specific error message'}`
        } else if (err && err.status) {
          // Si un code de statut HTTP est renvoyé
          this.errorMessage = `Failed to add user: HTTP status ${err.status} - ${err.statusText}`;
        } else {
          this.errorMessage = 'Failed to add user: Unknown error';
        }
      }
      
    });
  }
  

  resetNewUser(): void {
    this.newUser = {
      actif: true,
      civilite: 'M',
      dateInscription: new Date().toISOString(),
      gsm: '',
      id: 0,
      nom: '',
      username: '',
      email: '',
      password: '',
      role: 'ADMIN',
      image: ''
    };
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordField = document.getElementById('password') as HTMLInputElement;
    if (passwordField) {
      passwordField.type = this.passwordVisible ? 'text' : 'password';
    }
  }

  togglePanel(): void {
    this.showPanel = !this.showPanel; // Toggle the panel visibility
  }

  deleteUser(id: number): void {
    if (confirm(`Are you sure you want to delete the user with ID ${id}?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.fetchUsers();
          alert('User deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.errorMessage = 'Failed to delete user';
        }
      });
    }
  }

  filterByType(): void {
    if (this.selectedFilter) {
      this.filteredUsers = this.users.filter(user => user.role === this.selectedFilter);
    } else {
      this.filteredUsers = this.users;
    }
  }

  sortByName(): void {
    this.isSortedAZ = !this.isSortedAZ;
    this.filteredUsers.sort((a, b) => this.isSortedAZ
      ? a.nom.localeCompare(b.nom)
      : b.nom.localeCompare(a.nom)
    );
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
 