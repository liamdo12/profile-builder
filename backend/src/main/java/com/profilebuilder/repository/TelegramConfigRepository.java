package com.profilebuilder.repository;

import com.profilebuilder.model.entity.TelegramConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for per-user Telegram notification configuration.
 */
@Repository
public interface TelegramConfigRepository extends JpaRepository<TelegramConfig, Long> {

    Optional<TelegramConfig> findByUserId(Long userId);
}
