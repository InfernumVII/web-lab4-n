package com.infernumvii.security;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.ejb.Stateless;
import java.util.Base64;

@Stateless
public class SecurityService {

    public String hashPassword(String password) {
        return BCrypt.withDefaults().hashToString(12, password.toCharArray());
    }

    public boolean verifyPassword(String password, String hash) {
        try {
            return BCrypt.verifyer().verify(password.toCharArray(), hash).verified;
        } catch (Exception e) {
            return false;
        }
    }

    public String generateToken(Long userId, String username) {
        String payload = userId + ":" + username + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(payload.getBytes());
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                return false;
            }
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            return parts.length == 3;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            return Long.parseLong(parts[0]);
        } catch (Exception e) {
            return null;
        }
    }

    public String getUsernameFromToken(String token) {
        try {
            String decoded = new String(Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            return parts[1];
        } catch (Exception e) {
            return null;
        }
    }
}
