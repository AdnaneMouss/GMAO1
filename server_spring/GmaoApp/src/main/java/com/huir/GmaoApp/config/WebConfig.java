package com.huir.GmaoApp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Allow CORS for all API endpoints
                .allowedOrigins("http://localhost:4200")  // Allow requests from this origin
                .allowedMethods("GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS")  // Allow these HTTP methods
                .allowedHeaders("*")
        .allowCredentials(true);// Allow all headers
    }
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:uploads/");
    }


}

