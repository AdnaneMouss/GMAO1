import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatMessage } from '../models/ChatMessage';
import { ChatService } from '../services/ChatService';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common'; // <- pour les pipes slice, uppercase, date
import { ReactiveFormsModule } from '@angular/forms'; // <- pour formGroup
import { MatFormFieldModule } from '@angular/material/form-field'; // <- pour mat-form-field
import { MatInputModule } from '@angular/material/input'; // <- pour input matInput
import { Router } from '@angular/router';
import { WebSocketService } from '../services/WebSocketService';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [MatIconModule,CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
],
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
  showNotificationBadge = false;
notificationCount = 0;
  

  username: string = '';
  receiver: string = '';
  showSearch = false;
  searchQuery = '';
  // Ajoutez ces propriétés à votre classe
unreadMessagesCount: number = 0;
showNotification: boolean = false;
notificationMessage: string = '';
private unreadMessages: {[key: string]: number} = {};

  
  originalMessages: ChatMessage[] = []; // Sauvegarde des messages initiaux

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private webSocketService: WebSocketService
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
      this.webSocketService.connect();

      this.webSocketService.onMessage().subscribe((newMessage: ChatMessage) => {
        // Ajoute TOUJOURS dans tous les messages
        this.messages.push(newMessage);
      
        // Si le nouveau message concerne la conversation ouverte
        if (newMessage.receiver === this.username) {
          // Si ce n'est pas la conversation active ou si l'expéditeur est différent
          if (this.receiver !== newMessage.sender) {
            this.incrementUnreadCount(newMessage.sender);
            this.showNewMessageNotification(newMessage);
          }
        }
       // if (
         // (newMessage.sender === this.username && newMessage.receiver === this.receiver) ||
          //(newMessage.sender === this.receiver && newMessage.receiver === this.username)
        //) {
          //this.filteredMessages.push(newMessage);
          //this.scrollToBottom();
          //this.cdr.detectChanges();
        //}
      }); 
      

    } else {
      console.error('Aucun utilisateur connecté');
      // Redirection éventuelle vers login
      return;
    }
    // Dans votre ngOnInit
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    this.clearNotifications();
  }
});
    

    this.loadUsers();
    this.loadMessages();
    this.originalMessages = [...this.filteredMessages];
    
  }
  public clearNotifications(): void {
    this.notificationCount = 0;
    this.showNotificationBadge = false;
    this.unreadMessages = {};
  }
  navigateToChat() {
    this.router.navigate(['/CHAT']);
  }

  private incrementUnreadCount(sender: string): void {
    if (!this.unreadMessages[sender]) {
      this.unreadMessages[sender] = 0;
    }
    this.unreadMessages[sender]++;
    this.updateTotalUnreadCount();
  }
  
  private updateTotalUnreadCount(): void {
    this.unreadMessagesCount = Object.values(this.unreadMessages).reduce((a, b) => a + b, 0);
    this.cdr.detectChanges();
  }
  private showNewMessageNotification(message: ChatMessage): void {
    this.notificationMessage = `Nouveau message de ${message.sender}: ${message.content.slice(0, 30)}...`;
    this.showNotification = true;
    
    // Masquer la notification après 5 secondes
    setTimeout(() => {
      this.showNotification = false;
      this.cdr.detectChanges();
    }, 5000);
  }  
  onSearchInput(query: string) {
    this.searchQuery = query;
    this.filterMessages();
  }
  

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchQuery = '';
      this.resetMessages();
    }
  }
  
  filterMessages() {
    if (!this.searchQuery.trim()) {
      this.filteredMessages = [...this.originalMessages];
      return;
    }
  
    const query = this.searchQuery.toLowerCase();
    this.filteredMessages = this.originalMessages.filter(msg =>
      msg.content.toLowerCase().includes(query)
    );
  }
  
  resetMessages() {
    if (this.originalMessages.length > 0) {
      this.filteredMessages = [...this.originalMessages];
    }
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
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
    if (this.unreadMessages[user.username]) {
      delete this.unreadMessages[user.username];
      this.updateTotalUnreadCount();
    }
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
  getAvatarColor(username: string): string {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#F333FF', 
      '#33FFF5', '#FF33A8', '#FFC733', '#33FFBD'
    ];
    const hash = username.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  }
  showDateSeparator(index: number, msg: ChatMessage): void {
    if (index === 0)  false;
    
    const prevMsg = this.filteredMessages[index - 1];
   // const prevDate = new Date(prevMsg.timestamp).toDateString();
    //const currentDate = new Date(msg.timestamp).toDateString();
    
    //return prevDate !== currentDate;
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
      this.webSocketService.sendPrivateMessage(message);
  
      // Enregistre dans la BDD via REST
      this.chatService.sendChatMessage(message).subscribe(savedMessage => {
        this.messages.push(savedMessage);
  
        // ⚡ Ajoute aussi dans les messages affichés directement
        if (
          (savedMessage.sender === this.username && savedMessage.receiver === this.receiver) ||
          (savedMessage.sender === this.receiver && savedMessage.receiver === this.username)
        ) {
          this.filteredMessages.push(savedMessage);
        }
  
        this.chatForm.reset();
        this.scrollToBottom();
        this.cdr.detectChanges(); 
      });
    }
  }
  
}
