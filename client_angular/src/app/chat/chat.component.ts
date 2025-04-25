import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatMessage } from '../models/ChatMessage';
import { ChatService } from '../services/ChatService';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
//import { WebSocketService } from '../services/WebSocketService';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [MatIconModule],
  styleUrls: ['./chat.component.css']

})
export class ChatComponent implements OnInit {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  filteredMessages: ChatMessage[] = [];
  messageContent: string = '';
  users: User[] = [];
  selectedUser: User | null = null;
  isSidebarCollapsed = false;
  userSearchText = '';
  activeUsersCount = 0;

  username: string = '';
  receiver: string = '';

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    //private webSocketService: WebSocketService
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;

      // Connexion WebSocket après récupération du user
      //this.webSocketService.connect();

     // this.webSocketService.onMessage().subscribe((newMessage: ChatMessage) => {
        // Ajoute le message si pertinent
       // if (
         // (newMessage.sender === this.username && newMessage.receiver === this.receiver) ||
           //(newMessage.sender === this.receiver && newMessage.receiver === this.username)
         //)   {
          //this.messages.push(newMessage);
          //this.applyMessageFilter();
          //this.scrollToBottom();
        //}
      //});

    } else {
      console.error('Aucun utilisateur connecté');
      // Redirection éventuelle vers login
      return;
    }

    this.loadUsers();
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  get filteredUsers() {
    if (!this.userSearchText) return this.users;
    return this.users.filter(user =>
      user.username.toLowerCase().includes(this.userSearchText.toLowerCase())
    );
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.receiver = user.username;
    this.isSidebarCollapsed = true;
    this.applyMessageFilter();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        console.log('Utilisateurs chargés:', this.users);
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      }
    );
  }

  loadMessages(): void {
    this.chatService.getChatHistory().subscribe(messages => {
      this.messages = messages;
      this.applyMessageFilter();
    });
  }

  applyMessageFilter(): void {
    if (this.username && this.receiver) {
      this.filteredMessages = this.messages.filter(msg =>
        (msg.sender === this.username && msg.receiver === this.receiver) ||
        (msg.sender === this.receiver && msg.receiver === this.username)
      );
    } else {
      this.filteredMessages = [];
    }
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const message: ChatMessage = {
        sender: this.username,
        content: this.chatForm.value.message,
        receiver: this.receiver,
        type: 'CHAT'
      };

      // Envoie en WebSocket
      //this.webSocketService.sendPrivateMessage(message);

      // Enregistre dans la BDD via REST (optionnel si WebSocket le fait déjà)
      this.chatService.sendChatMessage(message).subscribe(savedMessage => {
        this.messages.push(savedMessage);
        this.chatForm.reset();
        this.scrollToBottom();
      });
    }
  }
}
