package com.example.furniture.JWT;

import com.example.furniture.ENUMS.Role;
import com.example.furniture.model.SignupRequest;
import com.example.furniture.model.User;
import com.example.furniture.repository.UserRepository;
import com.example.furniture.service.UserService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth")
public class AuthController {
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
        Optional<User> user = userRepository.findUserByEmail(request.getEmail());
        if (!user.isEmpty()) {
            if (passwordEncoder.matches(request.getPassword(), user.get().getPassword())){
                String token = jwtUtil.generateToken(request.getEmail(),user.get().getRole().name());
                Map<String,String> response= new HashMap<>();
                if (user.get().getRole()== Role.ADMIN||user.get().getRole()== Role.EXECUTIVE){
                    response.put("Role",user.get().getRole().toString());
                }
                response.put("message","success");
                response.put("token",token);
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }
        @PostMapping("/signup")
        public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
            String message = userService.register(request);
            if (message.equals("success")){
                String token = jwtUtil.generateToken(request.getEmail(),request.getRole().name());
                Map<String,String> response= new HashMap<>();
                response.put("message","success");
                response.put("token",token);
                if(request.getRole()!=null){
                    response.put("Role",request.getRole().toString());
                }
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.badRequest().body(message);
        }

}



