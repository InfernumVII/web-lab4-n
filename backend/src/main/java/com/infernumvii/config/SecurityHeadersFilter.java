package com.infernumvii.config;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class SecurityHeadersFilter implements ContainerRequestFilter {

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        requestContext.getHeaders().putSingle("X-Content-Type-Options", "nosniff");
        requestContext.getHeaders().putSingle("X-Frame-Options", "DENY");
        requestContext.getHeaders().putSingle("X-XSS-Protection", "1; mode=block");
        requestContext.getHeaders().putSingle("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        requestContext.getHeaders().putSingle("Content-Security-Policy", "default-src 'self'");
    }
}
