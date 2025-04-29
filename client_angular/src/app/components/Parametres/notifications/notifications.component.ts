import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notificationsEnabled: boolean = false; // Controls the TOGGLE
  userId: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
      this.notificationsEnabled = parsedUser.notifications; // 👈 sync toggle ON/OFF
    } else {
      console.warn('No user found in local storage');
    }
  }

  updateNotifications(): void {
    this.userService.updateNotifications(this.userId, this.notificationsEnabled).subscribe(
      (response) => {
        console.log('Notifications updated successfully!');

        // Optional: Update local storage so after refresh it's correct too
        const user = localStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          parsedUser.notifications = this.notificationsEnabled;
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
      },
      (error) => {
        console.error('Failed to update notifications', error);
      }
    );
  }
}
