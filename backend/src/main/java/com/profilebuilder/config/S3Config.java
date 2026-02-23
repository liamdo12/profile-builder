package com.profilebuilder.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

/**
 * AWS S3 configuration. Creates S3Client bean only when app.s3.bucket-name is set.
 * When not set (local dev), DocumentService falls back to local filesystem.
 */
@Configuration
public class S3Config {

    @Value("${app.s3.region:us-east-1}")
    private String region;

    @Bean
    @ConditionalOnProperty(name = "app.s3.bucket-name", matchIfMissing = false)
    public S3Client s3Client() {
        return S3Client.builder()
                .region(Region.of(region))
                .build();
    }
}
