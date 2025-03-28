package com.huir.GmaoApp.controller; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.model.Notification;
import com.huir.GmaoApp.repository.NotificationRepository;
import com.huir.GmaoApp.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private final NotificationService notificationService;
    @Autowired
    private NotificationRepository notificationRepository;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Void> addNotification(@RequestBody Notification notification) {
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }


    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }
}