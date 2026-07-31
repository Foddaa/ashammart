package com.example.furniture.JWT;

import com.example.furniture.model.SignupRequest;
import com.example.furniture.model.User;
import com.example.furniture.repository.UserRepository;
import com.example.furniture.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());

        Optional<User> userOpt = userRepository.findUserByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            logger.warn("Login failed: user not found for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed: invalid password for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        logger.info("Login successful for email: {}", request.getEmail());

        String accessToken = jwtUtil.generateToken(request.getEmail(), user.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(request.getEmail());

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)                      // HTTPS only — see note below for local dev
                .sameSite("Strict")                // "None" if frontend/backend are different origins
                .path("/api/auth/refresh")         // cookie only sent to the refresh endpoint, not every request
                .maxAge(Duration.ofDays(7))
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(buildResponse(user, accessToken, "success"));
    }
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || !jwtUtil.isValidRefreshToken(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = jwtUtil.extractEmail(refreshToken);
        User user = userRepository.findUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtUtil.generateToken(email, user.getRole().name());
        return ResponseEntity.ok(Map.of("token", newAccessToken));
    }
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        logger.info("Signing up user with email: {}", request.getEmail());
        if (userService.register(request)){
            String token = jwtUtil.generateToken(request.getEmail(),request.getRole().name());
            Map<String,String> response= new HashMap<>();
            response.put("message","success");
            response.put("token",token);
            if(request.getRole()!=null){
                response.put("Role",request.getRole().toString());
            }
            logger.info("User registered with email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body("failed to register");
    }



    ResponseEntity<?> buildResponse(User user, String token, String status) {
        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("role", user.getRole().name());
        response.put("message",status);
        response.put("token",token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth/refresh")
                .maxAge(0) // expires immediately
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }
}



