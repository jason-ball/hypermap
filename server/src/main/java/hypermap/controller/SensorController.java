package hypermap.controller;

import java.util.Base64;
import java.util.List;


import hypermap.entity.*;
import hypermap.repository.*;
import hypermap.requestbody.AdminUILayerUploadRequest;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hypermap.exception.ResourceNotFoundException;

import org.springframework.web.bind.annotation.*;




@RestController
@RequestMapping("/api")
@Api(tags = "Sensors")
@CrossOrigin(origins = "http://localhost:5431")
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
	
	@RequestMapping(method = RequestMethod.POST, value = "/Sensor")
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

    @GetMapping("/MapLayer/GeoJSON")
    public ResponseEntity<List<GeoJSONLayer>> getAllGeoJSON() {
        return ResponseEntity.ok(geoJSONLayerRepository.findAll());
    }

    @PostMapping(path = "/MapLayer/GeoJSON")
    public void addGeoJSON(@RequestBody AdminUILayerUploadRequest request) {
	    // Make a new layer object
	    GeoJSONLayer layer = new GeoJSONLayer();

	    // Set the basic properties from the request
	    layer.setDescription(request.getDescription());
	    layer.setDisplayName(request.getDisplayName());

	    // Get the GeoJSON from the request
	    String geoJSON = request.getFile();

	    // Remove the MIME type
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
	    geoJSON = geoJSON.substring(geoJSON.indexOf(",") + 1);

	    // Decode the base64 encoded GeoJSON
	    geoJSON = new String(Base64.getDecoder().decode(geoJSON));

	    // Add the geoJSON to the layer
        layer.setGeoJSON(geoJSON);

        // Save it!
        geoJSONLayerRepository.save(layer);
    }

}
