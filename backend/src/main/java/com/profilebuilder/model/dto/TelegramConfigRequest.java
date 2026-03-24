package com.profilebuilder.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for saving Telegram chat configuration.
 * Bot token is app-level (shared), so only chat_id is user-provided.
 */
@Data
@NoArgsConstructor
public class TelegramConfigRequest {

    @NotBlank(message = "Chat ID is required")
    private String chatId;
}
