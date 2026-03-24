package com.profilebuilder.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Per-user Telegram notification configuration.
 * Uses shared app bot (token in .env); users provide their chat_id only.
 */
@Entity
@Table(name = "pb_telegram_configs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TelegramConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "chat_id", nullable = false, length = 100)
    private String chatId;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled = true;

    @Column(name = "verified", nullable = false)
    private Boolean verified = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
