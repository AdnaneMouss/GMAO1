package com.huir.GmaoApp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.huir.GmaoApp.model.ChatMessage;
import com.huir.GmaoApp.service.ChatService;

@Controller
public class ChatController {
	@Autowired
private   ChatService chatService;
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
