package com.infernumvii.service;

import com.infernumvii.dto.PointRequest;
import com.infernumvii.dto.PointResponse;
import com.infernumvii.entity.Point;
import com.infernumvii.entity.User;
import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Stateless
public class PointService {

    @PersistenceContext(unitName = "WeblabPU")
    private EntityManager em;

    public PointResponse addPoint(PointRequest request, User user) throws IllegalArgumentException {
        long startTime = System.nanoTime();

        validate(request);

        boolean isHit = checkArea(request.getX(), request.getY(), request.getR());

        Point point = new Point();
        point.setX(request.getX());
        point.setY(request.getY());
        point.setR(request.getR());
        point.setHit(isHit);
        point.setCheckTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
        point.setExecutionTime((System.nanoTime() - startTime) / 1000); 
        point.setUser(user);

        em.persist(point);
        em.flush();

        return mapToResponse(point);
    }

    public List<PointResponse> getUserPoints(User user) {
        List<Point> points = em.createQuery("SELECT p FROM Point p WHERE p.user.id = :userId ORDER BY p.id DESC", Point.class)
                .setParameter("userId", user.getId())
                .getResultList();

        return points.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private void validate(PointRequest request) {
        if (request.getX() == null || request.getY() == null || request.getR() == null) {
            throw new IllegalArgumentException("Coordinates and radius cannot be null");
        }

        if (request.getX() < -5 || request.getX() > 3) {
            throw new IllegalArgumentException("X must be between -5 and 3");
        }
        if (request.getY() < -5 || request.getY() > 3) {
            throw new IllegalArgumentException("Y must be between -5 and 3");
        }
        if (request.getR() <= 0) {
            throw new IllegalArgumentException("R must be positive");
        }
        if (request.getR() > 3) { 
             throw new IllegalArgumentException("R must be <= 3");
        }
    }

    private boolean checkArea(double x, double y, double r) {
        boolean isCircle = (x >= 0) && (y >= 0) && (x * x + y * y <= (r / 2.0) * (r / 2.0));

        boolean isTriangle = (x >= 0) && (y <= 0) && (y >= x - r);

        boolean isRect = (x <= 0) && (y <= 0) && (x >= -r) && (y >= -r);

        return isCircle || isTriangle || isRect;
    }

    private PointResponse mapToResponse(Point point) {
        return new PointResponse(
            point.getId(),
            point.getX(),
            point.getY(),
            point.getR(),
            point.getHit(),
            point.getCheckTime(),
            point.getExecutionTime()
        );
    }
}