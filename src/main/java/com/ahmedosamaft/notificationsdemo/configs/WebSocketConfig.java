package com.ahmedosamaft.notificationsdemo.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Use the built-in message broker for subscriptions and broadcasting and
        // route messages whose destination header begins with /topic to the broker
        config.enableSimpleBroker("/topic");
        // STOMP messages whose destination header begins with /notifications are routed to
        // @MessageMapping methods in @Controller classes
        config.setApplicationDestinationPrefixes("/app");
        // To enable ordered publishing
        config.setPreservePublishOrder(true);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //  /ws is the HTTP URL for the endpoint to which a WebSocket (or SockJS)
        //	client needs to connect for the WebSocket handshake
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
