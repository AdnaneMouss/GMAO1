package com.huir.GmaoApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.model.ChatMessage;
import com.huir.GmaoApp.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {
    
    private final ChatService chatService;

    // Constructeur pour l'injection de dépendance
    @Autowired
    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ChatMessage sendMessage(@RequestBody ChatMessage message) {
        return chatService.saveMessage(message);
    }


    @GetMapping("/history")
    public List<ChatMessage> getHistory() {
        return chatService.getRecentMessages();
    }
}
