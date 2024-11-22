package com.ahmedosamaft.notificationsdemo.controllers;

import com.ahmedosamaft.notificationsdemo.models.Notification;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("broadcast")
    public HttpStatusCode broadcast(@RequestBody Notification msg) {
        messagingTemplate.convertAndSend("/topic/notification.all", msg);
        return HttpStatus.OK;
    }

    @PostMapping("send/{userId}")
    public Notification send(@PathVariable String userId,@RequestBody Notification msg) {
        messagingTemplate.convertAndSend("/topic/notification.%s".formatted(userId), msg);
        return msg;
    }
}
