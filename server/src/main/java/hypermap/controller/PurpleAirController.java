package hypermap.controller;

import hypermap.entity.PurpleAirHistory;
import hypermap.repository.PurpleAirHistoryRepository;
import io.swagger.annotations.Api;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.geojson.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purpleair")
@Api(tags = "PurpleAir")
@CrossOrigin
public class PurpleAirController {
    private PurpleAirHistoryRepository purpleAirHistoryRepository;

    @Autowired
    public void setPurpleAirHistoryRepository(PurpleAirHistoryRepository purpleAirHistoryRepository) {
        this.purpleAirHistoryRepository = purpleAirHistoryRepository;
    }

    @GetMapping("history")
    public ResponseEntity<List<PurpleAirHistory>> getHistory() {
        List<PurpleAirHistory> sensors = purpleAirHistoryRepository.findAll();
        return ResponseEntity.ok(sensors);
    }

    @GetMapping("geojson")
    public ResponseEntity<FeatureCollection> getGeoJSON() {
        List<PurpleAirHistory> sensors = purpleAirHistoryRepository.findAll();
        List<Feature> features = new ArrayList<>();
        for (PurpleAirHistory sensor : sensors) {
            Feature f = new Feature();
            Point p = new Point(sensor.getLongitude(), sensor.getLatitude());
            Map<String, Object> properties = new HashMap<>();
            f.setGeometry(p);
            properties.put("purpleair_id", sensor.getPurpleAirID());
            properties.put("time", sensor.getTime());
            properties.put("pm2_5", sensor.getPm25());
            properties.put("temperature", sensor.getTemperature());
            properties.put("humidity", sensor.getHumidity());
            properties.put("corrected_pm2_5", sensor.getCorrectedPM25());
            properties.put("correction_method", sensor.getCorrectionMethod());
            f.setProperties(properties);
            features.add(f);
        }
        FeatureCollection featureCollection = new FeatureCollection();
        featureCollection.setFeatures(features);
        return ResponseEntity.ok(featureCollection);
    }
}
