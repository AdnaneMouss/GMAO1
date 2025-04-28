package com.huir.GmaoApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.huir.GmaoApp.model.ChatMessage;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop100ByOrderByTimestampDesc();
}