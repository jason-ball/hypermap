package hypermap.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hypermap.entity.Sensor;
import hypermap.exception.ResourceNotFoundException;
import hypermap.repository.SensorRepository;

import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api")
public class SensorController {

	@Autowired
    private SensorRepository sensorRepository;
	
	@PostMapping("/Sensor")
    public Sensor addSensor(@RequestBody Sensor sensor) {
        return sensorRepository.save(sensor);
    }


    @GetMapping("/Sensor")
    public ResponseEntity<List<Sensor>> getAllSensors() {
        return ResponseEntity.ok(sensorRepository.findAll());
    }

    
    @GetMapping("Sensor/{SensorId}")
    public ResponseEntity<Sensor> findEmployeeById(@PathVariable(value = "SensorId") Integer SensorId) {
        Sensor sensor = sensorRepository.findById(SensorId).orElseThrow(
                () -> new ResourceNotFoundException("Employee not found" + SensorId));
        return ResponseEntity.ok().body(sensor);
    }
    
    @PutMapping("Sensor/{SensorId}")
    public ResponseEntity<Sensor> updateSensor(@PathVariable(value = "SensorId") Integer SensorId,
                                                   @RequestBody Sensor sensorDetails) {
       Sensor sensor = sensorRepository.findById(SensorId)
                .orElseThrow(() -> new ResourceNotFoundException("Sensor not found for this id :: " + SensorId));
        sensor.equals(sensor);
        final Sensor updatedSensor = sensorRepository.save(sensor);
        return ResponseEntity.ok(updatedSensor);

    }
    
    @DeleteMapping("Sensor/{SensorId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable(value = "SensorId") Integer SensorId) {
        Sensor sensor = sensorRepository.findById(SensorId).orElseThrow(
                () -> new ResourceNotFoundException("Employee not found" + SensorId));
        sensorRepository.delete(sensor);
        return ResponseEntity.ok().build();
    }

}
