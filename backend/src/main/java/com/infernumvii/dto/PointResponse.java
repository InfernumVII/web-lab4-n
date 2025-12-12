package com.infernumvii.dto;

public class PointResponse {
    private Long id;
    private Double x;
    private Double y;
    private Double r;
    private boolean hit;
    private String checkTime;
    private Long executionTime;

    public PointResponse() {}

    public PointResponse(Long id, Double x, Double y, Double r, boolean hit, String checkTime, Long executionTime) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.checkTime = checkTime;
        this.executionTime = executionTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }
    
    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }
    
    public Double getR() { return r; }
    public void setR(Double r) { this.r = r; }
    
    public boolean isHit() { return hit; }
    public void setHit(boolean hit) { this.hit = hit; }
    
    public String getCheckTime() { return checkTime; }
    public void setCheckTime(String checkTime) { this.checkTime = checkTime; }
    
    public Long getExecutionTime() { return executionTime; }
    public void setExecutionTime(Long executionTime) { this.executionTime = executionTime; }
}