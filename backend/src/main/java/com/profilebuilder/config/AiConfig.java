package com.profilebuilder.config;

import com.profilebuilder.ai.agent.ResumeGeneratorAgent;
import com.profilebuilder.ai.agent.HrValidatorAgent;
import dev.langchain4j.model.chat.ChatModel;
import org.springframework.beans.factory.annotation.Qualifier;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.service.AiServices;
import dev.langchain4j.web.search.WebSearchEngine;
import dev.langchain4j.web.search.WebSearchTool;
import dev.langchain4j.web.search.tavily.TavilyWebSearchEngine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * LangChain4j AI configuration.
 */
@Configuration
public class AiConfig {

    @Value("${app.tavily.api-key}")
    private String tavilyApiKey;

    @Value("${app.openai.api-key}")
    private String openaiApiKey;

    @Value("${app.ai.main-model.model-name:gpt-4o}")
    private String mainModelName;

    @Value("${app.ai.main-model.temperature:0.5}")
    private double mainTemperature;

    @Value("${app.ai.mini-model.model-name:gpt-5.2}")
    private String miniModelName;

    @Value("${app.ai.mini-model.temperature:0.5}")
    private double miniTemperature;

    @Bean
    WebSearchEngine webSearchEngine() {
        return TavilyWebSearchEngine.builder()
                .apiKey(tavilyApiKey)
                .build();
    }

    @Bean
    WebSearchTool webSearchTool(WebSearchEngine webSearchEngine) {
        return WebSearchTool.from(webSearchEngine);
    }

    @Bean
    @Primary
    ChatModel chatModel() {
        return OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName(mainModelName)
                .temperature(mainTemperature)
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    @Bean("miniChatModel")
    ChatModel miniChatModel() {
        return OpenAiChatModel.builder()
                .apiKey(openaiApiKey)
                .modelName(miniModelName)
                .temperature(miniTemperature)
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    @Bean
    ResumeGeneratorAgent resumeGeneratorAgent(ChatModel chatModel) {
        return AiServices.builder(ResumeGeneratorAgent.class)
                .chatModel(chatModel)
                .build();
    }

    @Bean
    HrValidatorAgent hrValidatorAgent(@Qualifier("miniChatModel") ChatModel miniModel) {
        return AiServices.builder(HrValidatorAgent.class)
                .chatModel(miniModel)
                .build();
    }
}
