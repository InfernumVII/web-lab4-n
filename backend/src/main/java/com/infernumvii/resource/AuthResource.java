package com.infernumvii.resource;

import com.infernumvii.dto.ApiResponse;
import com.infernumvii.dto.LoginRequest;
import com.infernumvii.dto.LoginResponse;
import com.infernumvii.dto.UserDTO;
import com.infernumvii.service.UserService;
import jakarta.ejb.EJB;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthResource.class);

    @EJB
    private UserService userService;

    @POST
    @Path("/login")
    public Response login(LoginRequest loginRequest) {
        try {
            if (loginRequest == null || loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiResponse<>(false, "Username and password are required"))
                    .build();
            }

            LoginResponse response = userService.login(loginRequest);
            return Response.ok()
                .entity(new ApiResponse<>(true, "Login successful", response))
                .build();

        } catch (Exception e) {
            LOGGER.error("Login error: ", e);
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new ApiResponse<>(false, e.getMessage()))
                .build();
        }
    }

    @POST
    @Path("/register")
    public Response register(LoginRequest registerRequest) {
        try {
            if (registerRequest == null || registerRequest.getUsername() == null || registerRequest.getPassword() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiResponse<>(false, "Username and password are required"))
                    .build();
            }

            UserDTO newUser = userService.register(registerRequest);
            return Response.status(Response.Status.CREATED)
                .entity(new ApiResponse<>(true, "Registration successful", newUser))
                .build();

        } catch (IllegalArgumentException e) {
            LOGGER.warn("Registration validation error: ", e);
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ApiResponse<>(false, e.getMessage()))
                .build();
        } catch (Exception e) {
            LOGGER.error("Registration error: ", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new ApiResponse<>(false, e.getMessage()))
                .build();
        }
    }

    @POST
    @Path("/logout")
    public Response logout() {
        return Response.ok()
            .entity(new ApiResponse<>(true, "Logout successful"))
            .build();
    }

    @POST
    @Path("/verify")
    public Response verifyToken(@HeaderParam("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ApiResponse<>(false, "Missing or invalid token"))
                    .build();
            }

            String token = authHeader.substring(7);
            UserDTO user = userService.verifyToken(token);

            if (user == null) {
                return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new ApiResponse<>(false, "Invalid or expired token"))
                    .build();
            }

            return Response.ok()
                .entity(new ApiResponse<>(true, "Token valid", user))
                .build();

        } catch (Exception e) {
            LOGGER.error("Token verification error: ", e);
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new ApiResponse<>(false, "Token verification failed"))
                .build();
        }
    }
}
