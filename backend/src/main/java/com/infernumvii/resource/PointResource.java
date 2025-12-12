package com.infernumvii.resource;

import com.infernumvii.dto.ApiResponse;
import com.infernumvii.dto.PointRequest;
import com.infernumvii.dto.PointResponse;
import com.infernumvii.dto.UserDTO;
import com.infernumvii.entity.User;
import com.infernumvii.service.PointService;
import com.infernumvii.service.UserService;
import jakarta.ejb.EJB;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {

    @EJB
    private PointService pointService;

    @EJB
    private UserService userService;

    private User authenticate(String authHeader) throws SecurityException {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new SecurityException("Missing or invalid token");
        }
        String token = authHeader.substring(7);
        UserDTO userDTO = userService.verifyToken(token);
        
        if (userDTO == null) {
            throw new SecurityException("Invalid token");
        }
        
        return userService.findUserByUsername(userDTO.getUsername());
    }

    @POST
    public Response addPoint(@HeaderParam("Authorization") String authHeader, PointRequest request) {
        try {
            User user = authenticate(authHeader);
            PointResponse response = pointService.addPoint(request, user);
            
            return Response.ok()
                .entity(new ApiResponse<>(true, "Point checked successfully", response))
                .build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new ApiResponse<>(false, e.getMessage()))
                .build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST)
                .entity(new ApiResponse<>(false, e.getMessage()))
                .build();
        } catch (jakarta.ejb.EJBException e) {
            if (e.getCausedByException() instanceof IllegalArgumentException) {
                return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ApiResponse<>(false, e.getCausedByException().getMessage()))
                    .build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new ApiResponse<>(false, "EJB Error: " + e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new ApiResponse<>(false, "Internal server error"))
                .build();
        }
    }

    @GET
    public Response getPoints(@HeaderParam("Authorization") String authHeader) {
        try {
            User user = authenticate(authHeader);
            List<PointResponse> points = pointService.getUserPoints(user);
            
            return Response.ok()
                .entity(new ApiResponse<>(true, "Points retrieved successfully", points))
                .build();
        } catch (SecurityException e) {
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new ApiResponse<>(false, e.getMessage()))
                .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(new ApiResponse<>(false, "Internal server error"))
                .build();
        }
    }
}