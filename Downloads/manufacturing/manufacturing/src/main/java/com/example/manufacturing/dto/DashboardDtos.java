package com.example.manufacturing.dto;



// This file contains Data Transfer Objects (DTOs) used to shape the JSON
// data specifically for the dashboard's needs.

public class DashboardDtos {

    /**
     * DTO for Key Performance Indicators (KPIs) shown at the top of the dashboard.
     */
    public static class KpiDto {
        private String title;
        private String value;
        private String change;
        private String trend;
        private String icon;
        private String color;

        // Constructor, Getters, and Setters
        public KpiDto(String title, String value, String change, String trend, String icon, String color) {
            this.title = title;
            this.value = value;
            this.change = change;
            this.trend = trend;
            this.icon = icon;
            this.color = color;
        }

        public String getTitle() { return title; }
        public String getValue() { return value; }
        public String getChange() { return change; }
        public String getTrend() { return trend; }
        public String getIcon() { return icon; }
        public String getColor() { return color; }
    }

    /**
     * DTO for displaying component stock availability on the dashboard.
     */
    public static class ComponentAvailabilityDto {
        private String name;
        private int current;
        private int required;
        private String status;

        // Constructor, Getters, and Setters
        public ComponentAvailabilityDto(String name, int current, int required, String status) {
            this.name = name;
            this.current = current;
            this.required = required;
            this.status = status;
        }

        public String getName() { return name; }
        public int getCurrent() { return current; }
        public int getRequired() { return required; }
        public String getStatus() { return status; }
    }
}

