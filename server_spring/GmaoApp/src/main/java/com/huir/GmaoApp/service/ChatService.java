package com.huir.GmaoApp.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.model.ChatMessage;

import com.huir.GmaoApp.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;


    
   

@Service
@RequiredArgsConstructor
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public ChatMessage saveMessage(ChatMessage message) {
        // Sauvegarder le message et le retourner
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getRecentMessages() {
        return chatMessageRepository.findTop100ByOrderByTimestampDesc();
    }
    
     

}
