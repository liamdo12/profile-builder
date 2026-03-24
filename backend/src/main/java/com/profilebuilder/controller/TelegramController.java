package com.profilebuilder.controller;

import com.profilebuilder.model.dto.TelegramConfigRequest;
import com.profilebuilder.model.dto.TelegramConfigResponse;
import com.profilebuilder.model.entity.User;
import com.profilebuilder.service.TelegramConfigService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Telegram configuration endpoints. Users save their chat_id only;
 * bot token is shared at the app level. Restricted to PREMIUM+ roles.
 */
@RestController
@RequestMapping("/api/telegram")
@PreAuthorize("hasAnyRole('PREMIUM','ADMIN')")
public class TelegramController {

    private final TelegramConfigService service;

    public TelegramController(TelegramConfigService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<TelegramConfigResponse> save(
            @Valid @RequestBody TelegramConfigRequest req,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.save(req, user.getId()));
    }

    @GetMapping
    public ResponseEntity<TelegramConfigResponse> get(@AuthenticationPrincipal User user) {
        TelegramConfigResponse config = service.getByUser(user.getId());
        return config != null ? ResponseEntity.ok(config) : ResponseEntity.noContent().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<TelegramConfigResponse> verify(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.verify(user.getId()));
    }

    @DeleteMapping
    public ResponseEntity<Void> delete(@AuthenticationPrincipal User user) {
        service.delete(user.getId());
        return ResponseEntity.ok().build();
    }
}
