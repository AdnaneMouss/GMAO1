package com.huir.GmaoApp.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.huir.GmaoApp.model.ChatMessage;
import com.huir.GmaoApp.service.ChatService;
import com.huir.GmaoApp.service.FileStorageService;

@Controller
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatController {
	@Autowired
private   ChatService chatService;
	@Autowired
	private  FileStorageService fileStorageService;
	
	  public ChatController(ChatService chatService, FileStorageService fileStorageService) {
	        this.chatService = chatService;
	        this.fileStorageService = fileStorageService;
	    }
	  
	  @PostMapping("/upload")
	    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
	        try {
	            String fileUrl = fileStorageService.storeFile(file);
	            Map<String, String> response = new HashMap<>();
	            response.put("fileUrl", fileUrl);
	            return ResponseEntity.ok(response);
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	        }
	    }
    // Cette méthode sera appelée lorsque le client envoie un message via /app/chat.sendMessage
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")  // Envoie le message à tous les clients abonnés à /topic/public
    public ChatMessage sendMessage(ChatMessage message) {
        return message;  // Retourner le message reçu pour qu'il soit diffusé à tous les abonnés
    }

    @MessageMapping("/chat.sendPrivateMessage")
    @SendToUser("/queue/private") // <-- Envoie le message à l'utilisateur courant
    public ChatMessage sendPrivateMessage(ChatMessage message) {
        return message;
    }

    
    @GetMapping("/messages")
    public List<ChatMessage> getAllMessages() {
        return chatService.getRecentMessages(); // Ou findAll() selon ton besoin
    }

}
