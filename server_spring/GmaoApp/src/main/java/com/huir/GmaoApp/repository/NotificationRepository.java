package com.huir.GmaoApp.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.huir.GmaoApp.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
