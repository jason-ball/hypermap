package com.example.demo;

import org.springframework.boot.SpringApplication;
import lombok.SneakyThrows;
import repository.SensorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

import entity.Sensor;

import java.util.List;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@RestController
@RequestMapping("/Sensor")
@SpringBootApplication
public class TheSandboxApplication {
	
	@Autowired
    private SensorRepository sensorRepository;
	
	@PostMapping
    public Sensor saveSensor(@RequestBody Sensor sensor) {
        return sensorRepository.save(sensor);
    }

    @GetMapping
    public List<Sensor> findBooks() {
        return sensorRepository.findAll();
    }


    @SneakyThrows
    @GetMapping("/{SensorID}")
    public Sensor findBook(@PathVariable int SensorId) throws Exception {
        Sensor sensor = sensorRepository.findById(SensorId).orElseThrow(() -> new Exception("Sensor not available"));
        		
     
        return sensor;
    }


	public static void main(String[] args) {
		SpringApplication.run(TheSandboxApplication.class, args);
	}

}
