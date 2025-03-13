import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import * as XLSX from 'xlsx';
//@ts-ignore
import { saveAs } from 'file-saver';
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
  imageError: string | null = null;

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
  selectedUser: User | null = null; // Store selected user details
  showPanel2: boolean = false;
  isEditing: boolean = false;
  selectedFile: File | null = null; // To store the selected file for upload
  viewDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.selectedUser = { ...user }; // Clone the object to prevent unwanted changes
        this.showPanel2 = true;
        this.isEditing = false; // Ensure it's in view mode by default
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

// Method to toggle edit mode
  enableEditing(): void {
    this.isEditing = true;
  }

// Method to update user details
  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: (updatedUser) => {
          this.selectedUser = updatedUser;
          this.isEditing = false; // Switch back to view mode
          alert('User updated successfully!');
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('Failed to update user.');
        }
      });
    }
  }

// Method to close the panel
  closePanel(): void {
    this.showPanel2 = false;
  }
  constructor(private userService: UserService) {
  }

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


  onImageSelect(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile && !this.selectedFile.type.startsWith('image/')) {
      this.imageError = 'Please select a valid image file.';
      this.selectedFile = null;
    } else {
      this.imageError = null;
    }
  }

  checkUsernameTaken(username: string): boolean {
    // Add logic to check if the username is already taken, you can make a request to the backend if necessary
    return false; // Simulate that the username is available
  }

  // Method to validate the form and create user
  addUser(): void {
    // Form validation
    this.usernameTaken = this.checkUsernameTaken(this.newUser.username);
    this.gsmError = !/^\d{10}$/.test(this.newUser.gsm);
    this.emailError = !this.newUser.email.endsWith('@huir.ma');
    this.passwordError = !/[!@#$%^&*(),.?":{}|<>]/.test(this.newUser.password);

    // If any validation fails, stop the form submission
    if (this.usernameTaken || this.gsmError || this.emailError || this.passwordError || !this.selectedFile) {
      this.errorMessage = 'Please fix the errors before submitting the form.';
      return;
    }

    // Call the service to create the user and upload the image
    this.userService.createUser(this.newUser, this.selectedFile).subscribe({
      next: () => {
        alert('User added successfully.');
      },
      error: (err) => {
        this.errorMessage = 'Failed to add user. Please try again.';
        console.error(err);
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


exportToExcel()
:
void {
  // Liste des utilisateurs avec leurs attributs
  const worksheetData = this.users.map(user => ({
    'ID': user.id,
    'Nom': user.nom,
    'Username': user.username,
    'Email': user.email,
    'Téléphone': user.gsm,
    'Civilité': user.civilite,
    'Rôle': user.role,
    'Actif': user.actif ? 'Oui' : 'Non',
    'Date Inscription': new Date(user.dateInscription).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // 🎨 Styles pour l'entête (Vert foncé, texte blanc)
  const headerStyle = {
    font: {bold: true, color: {rgb: 'FFFFFF'}},
    fill: {fgColor: {rgb: '2E7D32'}}, // Vert foncé
    alignment: {horizontal: 'center', vertical: 'center'},
    border: {top: {style: 'thin'}, bottom: {style: 'thin'}}
  };

  // 🎨 Couleurs alternées pour les lignes (vert clair)
  const evenRowStyle = {fill: {fgColor: {rgb: 'E8F5E9'}}}; // Vert clair
  const oddRowStyle = {fill: {fgColor: {rgb: 'C8E6C9'}}}; // Vert plus foncé

  // 🎨 Bordures des cellules
  const borderStyle = {
    border: {
      top: {style: 'thin', color: {rgb: '000000'}},
      bottom: {style: 'thin', color: {rgb: '000000'}},
      left: {style: 'thin', color: {rgb: '000000'}},
      right: {style: 'thin', color: {rgb: '000000'}}
    }
  };

  // 🔍 Appliquer les styles
  const range = XLSX.utils.decode_range(worksheet['!ref'] || '');

  for(let col = range.s.c; col <= range.e.c;
col++
)
{
  const headerCell = XLSX.utils.encode_cell({r: 0, c: col});
  if (worksheet[headerCell]) {
    worksheet[headerCell].s = headerStyle;
  }
}

for (let row = 1; row <= range.e.r; row++) {
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = XLSX.utils.encode_cell({r: row, c: col});
    if (worksheet[cell]) {
      worksheet[cell].s = {
        ...borderStyle,
        ...(row % 2 === 0 ? evenRowStyle : oddRowStyle)
      };
    }
  }
}

// 🔧 Ajuster la largeur des colonnes
worksheet['!cols'] = [
  {wch: 5},  // ID
  {wch: 20}, // Nom
  {wch: 20}, // Username
  {wch: 30}, // Email
  {wch: 15}, // Téléphone
  {wch: 10}, // Civilité
  {wch: 15}, // Rôle
  {wch: 10}, // Actif
  {wch: 20}  // Date Inscription
];

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');

const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
const data = new Blob([excelBuffer], {type: 'application/octet-stream'});
saveAs(data, 'utilisateurs.xlsx');
}


}
