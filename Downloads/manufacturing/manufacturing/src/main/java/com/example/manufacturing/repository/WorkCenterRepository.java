package com.example.manufacturing.repository;



import com.example.manufacturing.model.Workcenter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkCenterRepository extends JpaRepository<Workcenter, Long> {}
