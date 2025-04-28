package com.huir.GmaoApp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Permet aux clients de se connecter à WebSocket via /ws-chat
        registry.addEndpoint("/ws-chat").withSockJS();  // SockJS pour la compatibilité avec les anciens navigateurs
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // <--- Ajoute "/queue"
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // <--- Important pour @SendToUser
    }

}
