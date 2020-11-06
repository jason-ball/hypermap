package hypermap.controller;

import java.util.List;


import hypermap.entity.AirBeamSensor2;
import hypermap.entity.ArcGISOnlineLayer;
import hypermap.entity.PurpleAirSensor;
import hypermap.repository.*;
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

import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api")
public class SensorController {

    @Autowired
    private SensorRepository sensorRepository;
    @Autowired
    private AirBeam2SensorRepository airBeam2SensorRepository;
    @Autowired
    private ArcGISOnlineLayerRepository arcGISOnlineLayerRepository;
    @Autowired
    private CSVLayerRepository csvLayerRepository;
    @Autowired
    private GeoJSONLayerRepository geoJSONLayerRepository;
    @Autowired
    private HTTPLayerRepository httpLayerRepository;
    @Autowired
    private MapLayerRepository mapLayerRepository;
    @Autowired
    private PurpleAirSensorRepository purpleAirSensorRepository;
	
	@PostMapping("/Sensor")
    public Sensor addSensor(@RequestBody Sensor sensor) {
        return sensorRepository.save(sensor);
    }


    @GetMapping("/Sensor")
    public ResponseEntity<List<Sensor>> getAllSensors() {
        return ResponseEntity.ok(sensorRepository.findAll());
    }


    @GetMapping("/Sensor/AirBeam2")
    public ResponseEntity<List<AirBeamSensor2>> getAllAirBeamSensors() {
        return ResponseEntity.ok(airBeam2SensorRepository.findAll());
    }


    @GetMapping("/Sensor/PurpleAir")
    public ResponseEntity<List<PurpleAirSensor>> getAllPurpleAirSensors() {
        return ResponseEntity.ok(purpleAirSensorRepository.findAll());
    }

    
    @GetMapping("Sensor/{SensorId}")
    public ResponseEntity<Sensor> findEmployeeById(@PathVariable(value = "SensorId") Integer SensorId) {
        Sensor sensor = sensorRepository.findById(SensorId).orElseThrow(
                () -> new ResourceNotFoundException("Sensor not found " + SensorId));
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
