package com.profilebuilder.model.dto;

/**
 * Response DTO for Telegram configuration.
 */
public record TelegramConfigResponse(
        Long id,
        String chatId,
        Boolean enabled,
        Boolean verified
) {}
