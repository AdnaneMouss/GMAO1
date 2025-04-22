import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
})
export class NotificationsComponent implements OnInit {
  notificationsEnabled: boolean = false;
  userId: number = 0;
  notificationValue: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = parsedUser.id;
      this.notificationValue = parsedUser.notifications;
    } else {
      console.warn('No user found in local storage');
    }
  }

  updateNotifications(): void {
    this.userService.updateNotifications(this.userId, this.notificationsEnabled).subscribe(
      (response) => {
        console.log('Notifications updated successfully!');
      },
      (error) => {
        console.error('Failed to update notifications', error);
      }
    );
  }
}
