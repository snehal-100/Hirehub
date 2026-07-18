package com.hirehub.backend.service;

import com.hirehub.backend.dto.auth.NotificationDto;
import com.hirehub.backend.entity.User;

import java.util.List;

public interface NotificationService {
    void sendNotification(User user, String title, String message);
    List<NotificationDto> getUserNotifications(String email);
    void markAsRead(Long id, String email);
    void markAllAsRead(String email);
    long getUnreadCount(String email);
}
