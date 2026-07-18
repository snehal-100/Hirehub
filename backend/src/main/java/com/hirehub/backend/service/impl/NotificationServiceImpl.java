package com.hirehub.backend.service.impl;

import com.hirehub.backend.dto.auth.NotificationDto;
import com.hirehub.backend.entity.Notification;
import com.hirehub.backend.entity.User;
import com.hirehub.backend.exception.BadRequestException;
import com.hirehub.backend.exception.ResourceNotFoundException;
import com.hirehub.backend.repository.NotificationRepository;
import com.hirehub.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void sendNotification(User user, String title, String message) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationDto> getUserNotifications(String email) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(n -> NotificationDto.builder()
                        .id(n.getId())
                        .title(n.getTitle())
                        .message(n.getMessage())
                        .isRead(n.isRead())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void markAsRead(Long id, String email) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to access this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        List<Notification> unread = notificationRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .filter(n -> !n.isRead())
                .collect(Collectors.toList());

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    @Override
    public long getUnreadCount(String email) {
        return notificationRepository.countByUserEmailAndIsReadFalse(email);
    }
}
