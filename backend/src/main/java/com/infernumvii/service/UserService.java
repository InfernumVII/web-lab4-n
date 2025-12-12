package com.infernumvii.service;

import com.infernumvii.dto.LoginRequest;
import com.infernumvii.dto.LoginResponse;
import com.infernumvii.dto.UserDTO;
import com.infernumvii.entity.User;
import com.infernumvii.security.SecurityService;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Stateless
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    @PersistenceContext(unitName = "WeblabPU")
    private EntityManager em;

    @EJB
    private SecurityService securityService;

    public LoginResponse login(LoginRequest loginRequest) throws Exception {
        if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            throw new Exception("Invalid login request");
        }

        User user = findUserByUsername(loginRequest.getUsername());
        if (user == null) {
            LOGGER.warn("Login attempt with non-existent username: {}", loginRequest.getUsername());
            throw new Exception("Invalid credentials");
        }

        if (!user.getEnabled()) {
            LOGGER.warn("Login attempt with disabled user: {}", loginRequest.getUsername());
            throw new Exception("User account is disabled");
        }

        if (!securityService.verifyPassword(loginRequest.getPassword(), user.getPassword())) {
            LOGGER.warn("Failed login attempt for user: {}", loginRequest.getUsername());
            throw new Exception("Invalid credentials");
        }

        String token = securityService.generateToken(user.getId(), user.getUsername());
        UserDTO userDTO = mapToUserDTO(user);

        LOGGER.info("Successful login for user: {}", user.getUsername());
        return new LoginResponse(token, userDTO);
    }

    public User findUserByUsername(String username) {
        try {
            Query query = em.createQuery("SELECT u FROM User u WHERE u.username = :username");
            query.setParameter("username", username);
            return (User) query.getSingleResult();
        } catch (Exception e) {
            return null;
        }
    }

    public User findUserById(Long id) {
        try {
            return em.find(User.class, id);
        } catch (Exception e) {
            return null;
        }
    }

    public User registerUser(User user) throws Exception {
        if (user == null || user.getUsername() == null || user.getPassword() == null) {
            throw new Exception("Invalid user data");
        }

        User existingUser = findUserByUsername(user.getUsername());
        if (existingUser != null) {
            throw new Exception("Username already exists");
        }

        user.setPassword(securityService.hashPassword(user.getPassword()));
        user.setEnabled(true);

        em.persist(user);
        em.flush();

        LOGGER.info("New user registered: {}", user.getUsername());
        return user;
    }

    public UserDTO register(LoginRequest loginRequest) throws Exception {
        if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            throw new IllegalArgumentException("Username and password are required");
        }

        User existingUser = findUserByUsername(loginRequest.getUsername());
        if (existingUser != null) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (loginRequest.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }

        User newUser = new User();
        newUser.setUsername(loginRequest.getUsername());
        newUser.setPassword(securityService.hashPassword(loginRequest.getPassword()));
        newUser.setEmail(loginRequest.getUsername() + "@example.com");
        newUser.setFirstName("User");
        newUser.setLastName(loginRequest.getUsername());
        newUser.setEnabled(true);
        newUser.setCreatedAt(System.currentTimeMillis());
        newUser.setUpdatedAt(System.currentTimeMillis());

        em.persist(newUser);
        em.flush();

        LOGGER.info("New user registered: {}", newUser.getUsername());
        return mapToUserDTO(newUser);
    }

    public UserDTO verifyToken(String token) {
        if (!securityService.validateToken(token)) {
            return null;
        }

        Long userId = securityService.getUserIdFromToken(token);
        User user = findUserById(userId);

        if (user != null && user.getEnabled()) {
            return mapToUserDTO(user);
        }

        return null;
    }

    private UserDTO mapToUserDTO(User user) {
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName()
        );
    }
}
