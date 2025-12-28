package com.example.furniture.JWT;

import com.example.furniture.ENUMS.Role;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {
    private SecretKey SECRET_KEY = Keys.hmacShaKeyFor("MySuperSecretKey123456789012345678901234".getBytes());

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + 10 * 60 * 2000)) // 10 min
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean isTokenValid(String token) {
        return extractEmail(token) != null &&
                !Jwts.parser().setSigningKey(SECRET_KEY)
                        .parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }
}

