package com.example.manufacturing.controller;

import com.example.manufacturing.model.Workcenter;
import com.example.manufacturing.repository.WorkCenterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workcenters")
public class WorkCenterController {
    private final WorkCenterRepository repo;
    public WorkCenterController(WorkCenterRepository repo){ this.repo = repo; }

    @PostMapping("/create")
    public ResponseEntity<Workcenter> create(@RequestBody Workcenter wc){
        return ResponseEntity.ok(repo.save(wc));
    }

    @GetMapping
    public ResponseEntity<List<Workcenter>> list(){ return ResponseEntity.ok(repo.findAll()); }
}

