package com.profilebuilder.service;

import com.profilebuilder.model.dto.TelegramConfigRequest;
import com.profilebuilder.model.dto.TelegramConfigResponse;
import com.profilebuilder.model.entity.TelegramConfig;
import com.profilebuilder.repository.TelegramConfigRepository;
import org.springframework.stereotype.Service;

/**
 * Business logic for Telegram config CRUD. One config per user (upsert pattern).
 */
@Service
public class TelegramConfigService {

    private final TelegramConfigRepository repository;
    private final TelegramNotificationService notificationService;

    public TelegramConfigService(TelegramConfigRepository repository,
                                 TelegramNotificationService notificationService) {
        this.repository = repository;
        this.notificationService = notificationService;
    }

    /** Upsert: creates or updates the user's Telegram config. */
    public TelegramConfigResponse save(TelegramConfigRequest req, Long userId) {
        TelegramConfig config = repository.findByUserId(userId).orElse(new TelegramConfig());
        config.setUserId(userId);
        config.setChatId(req.getChatId());
        config.setEnabled(true);
        config.setVerified(false); // Reset verification on chat_id change
        return toResponse(repository.save(config));
    }

    public TelegramConfigResponse getByUser(Long userId) {
        return repository.findByUserId(userId).map(this::toResponse).orElse(null);
    }

    /** Sends a test message via the app bot and marks config as verified on success. */
    public TelegramConfigResponse verify(Long userId) {
        TelegramConfig config = repository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Telegram not configured"));
        boolean sent = notificationService.sendTestMessage(config.getChatId());
        config.setVerified(sent);
        return toResponse(repository.save(config));
    }

    public void delete(Long userId) {
        repository.findByUserId(userId).ifPresent(repository::delete);
    }

    private TelegramConfigResponse toResponse(TelegramConfig config) {
        return new TelegramConfigResponse(
                config.getId(), config.getChatId(), config.getEnabled(), config.getVerified());
    }
}
