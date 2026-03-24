package com.profilebuilder.service;

import com.profilebuilder.model.entity.CrawledJob;
import com.profilebuilder.model.entity.TelegramConfig;
import com.profilebuilder.repository.CrawledJobRepository;
import com.profilebuilder.repository.TelegramConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Sends Telegram notifications for new crawled jobs using the shared app bot.
 * Bot token is injected from environment; users only provide their chat_id.
 */
@Service
public class TelegramNotificationService {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotificationService.class);
    private static final int BATCH_SIZE = 5;
    private static final int MAX_RETRIES = 2;
    private static final long RETRY_DELAY_MS = 3000;
    private static final long BATCH_DELAY_MS = 1000;

    private final TelegramConfigRepository telegramConfigRepository;
    private final CrawledJobRepository crawledJobRepository;
    private final RestTemplate restTemplate;

    @Value("${app.telegram.api-base-url}")
    private String apiBaseUrl;

    @Value("${app.telegram.bot-token}")
    private String botToken;

    public TelegramNotificationService(TelegramConfigRepository telegramConfigRepository,
                                       CrawledJobRepository crawledJobRepository,
                                       RestTemplate restTemplate) {
        this.telegramConfigRepository = telegramConfigRepository;
        this.crawledJobRepository = crawledJobRepository;
        this.restTemplate = restTemplate;
    }

    /**
     * Sends a test message to verify the user's chat_id works with the app bot.
     * @return true if message sent successfully
     */
    public boolean sendTestMessage(String chatId) {
        String text = "<b>Profile Builder Connected!</b>\n\n"
                + "You will receive job notifications here when new jobs are found.";
        return sendMessage(chatId, text);
    }

    /**
     * Sends notifications for new jobs to the user's Telegram chat.
     * Jobs are batched (5 per message) to avoid spam. Non-blocking on failure.
     */
    public void notifyNewJobs(Long userId, List<CrawledJob> jobs) {
        TelegramConfig config = telegramConfigRepository.findByUserId(userId).orElse(null);
        if (config == null || !config.getEnabled() || !config.getVerified()) {
            log.debug("Telegram not configured/enabled/verified for user {}, skipping", userId);
            return;
        }

        for (int i = 0; i < jobs.size(); i += BATCH_SIZE) {
            List<CrawledJob> batch = jobs.subList(i, Math.min(i + BATCH_SIZE, jobs.size()));
            String message = formatJobBatch(batch, i + 1);

            if (sendMessage(config.getChatId(), message)) {
                batch.forEach(job -> {
                    job.setIsNotified(true);
                    crawledJobRepository.save(job);
                });
            }

            // Delay between batches to respect Telegram rate limits
            if (i + BATCH_SIZE < jobs.size()) {
                sleep(BATCH_DELAY_MS);
            }
        }
    }

    // ── Private helpers ──────────────────────────────────────

    /** Sends an HTML message to a Telegram chat with retry logic. */
    boolean sendMessage(String chatId, String htmlText) {
        String url = String.format("%s/bot%s/sendMessage", apiBaseUrl, botToken);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "chat_id", chatId,
                "text", htmlText,
                "parse_mode", "HTML",
                "disable_web_page_preview", true
        );

        for (int attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
                var response = restTemplate.postForEntity(url, request, Map.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    return true;
                }
                log.warn("Telegram API returned {}", response.getStatusCode());
            } catch (Exception e) {
                log.warn("Telegram send attempt {} failed: {}", attempt + 1, e.getMessage());
                if (attempt < MAX_RETRIES) {
                    sleep(RETRY_DELAY_MS);
                }
            }
        }
        log.error("Failed to send Telegram message to chat {} after {} retries", chatId, MAX_RETRIES);
        return false;
    }

    /** Formats a batch of jobs as an HTML Telegram message. */
    private String formatJobBatch(List<CrawledJob> jobs, int startIndex) {
        StringBuilder sb = new StringBuilder("<b>New Jobs Found!</b>\n\n");
        for (int i = 0; i < jobs.size(); i++) {
            CrawledJob job = jobs.get(i);
            sb.append(startIndex + i).append(". <b>").append(escapeHtml(job.getTitle())).append("</b>\n");
            if (job.getCompany() != null) {
                sb.append("   <i>").append(escapeHtml(job.getCompany())).append("</i>");
                if (job.getLocation() != null) {
                    sb.append(" - ").append(escapeHtml(job.getLocation()));
                }
                sb.append("\n");
            }
            if (job.getSalaryInfo() != null) {
                sb.append("   ").append(escapeHtml(job.getSalaryInfo())).append("\n");
            }
            String sourceLine = formatSourceLine(job);
            if (!sourceLine.isEmpty()) {
                sb.append("   ").append(sourceLine).append("\n");
            }
            sb.append("   <a href=\"").append(escapeHtml(job.getSourceUrl())).append("\">View Job</a>\n\n");
        }
        return sb.toString().trim();
    }

    /**
     * Builds the source site + date posted line, e.g. "📼 LinkedIn | Posted: Jan 15, 2026".
     * Returns empty string if both source site and date are absent.
     */
    private String formatSourceLine(CrawledJob job) {
        StringBuilder line = new StringBuilder();
        if (job.getSourceSite() != null) {
            line.append(job.getSourceSite().getEmoji())
                .append(" ")
                .append(job.getSourceSite().getDisplayName());
        }
        String dateStr = formatDate(job.getDatePosted());
        if (!dateStr.isEmpty()) {
            if (line.length() > 0) {
                line.append(" | ");
            }
            line.append("Posted: ").append(dateStr);
        }
        return line.toString();
    }

    /** Formats a LocalDateTime as "MMM d, yyyy", returns empty string for null. */
    private String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
    }

    /** Escapes HTML special characters for Telegram HTML parse mode. */
    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }

    private void sleep(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
