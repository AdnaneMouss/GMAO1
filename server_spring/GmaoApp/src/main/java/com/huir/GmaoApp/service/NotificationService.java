package com.huir.GmaoApp.service;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.Notification;
import com.huir.GmaoApp.repository.NotificationRepository;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void saveNotification(String message, Maintenance maintenance) {
        Notification notification = new Notification(message, maintenance);
        notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}
 