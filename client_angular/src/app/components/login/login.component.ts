import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";  // Adjust the import path based on your project structure

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: AuthService, private router: Router) {}

  onLogin($event: SubmitEvent) {
    console.log('Attempting login...'); // Debug log
    this.loginService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Response received from API:', response); // Log response
        localStorage.setItem('user', JSON.stringify(response));
        alert(response.role);
        if(response.role=="ADMIN"){
          this.router.navigate(['/utilisateurs/liste']);
        }
        else if(response.role=="TECHNICIEN"){
          this.router.navigate(['/interventions/taches']);
        }
        else if(response.role=="RESPONSABLE"){
          this.router.navigate(['/equipements/list']);
        }
      },

      error: (error) => {
        console.error('Error occurred during login:', error); // Log error
        this.errorMessage = 'Invalid credentials, please try again.';
      }
    });
  }


}
