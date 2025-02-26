import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';  // Adjust if needed
import { User } from '../../../models/user';  // Adjust if needed

@Component({
  selector: 'app-details-utilisateurs',
  templateUrl: './details-utilisateurs.component.html',
  styleUrls: ['./details-utilisateurs.component.css']
})
export class DetailsUtilisateursComponent implements OnInit {
  user: User | undefined;
  errorMessage: string = '';
  isEditMode: boolean = false;  // Toggle edit mode

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router  // To navigate after save
  ) { }

  ngOnInit(): void {
    const userId = +this.route.snapshot.paramMap.get('id')!;  // Get user ID from route params
    this.fetchUserDetails(userId);
  }

  fetchUserDetails(id: number): void {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.user = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.errorMessage = 'Failed to load user details';
      }
    });
  }

  // Toggle to edit mode
  enableEditMode(): void {
    this.isEditMode = true;
  }

  // Update user details
  saveChanges(): void {
    if (this.user) {
      this.userService.updateUser(this.user.id!, this.user).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isEditMode = false;  // Disable edit mode after saving
          this.router.navigate(['/utilisateurs/liste']);  // Redirect after saving
        },
        error: (err) => {
          console.error('Error updating user:', err);
          this.errorMessage = 'Failed to update user details';
        }
      });
    }
  }
}
