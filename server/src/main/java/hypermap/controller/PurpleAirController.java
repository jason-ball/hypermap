package hypermap.controller;

import hypermap.entity.PurpleAirData;
import hypermap.repository.PurpleAirHistoryRepository;
import io.swagger.annotations.Api;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
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
    public ResponseEntity<List<PurpleAirData>> getHistory() {
        List<PurpleAirData> sensors = purpleAirHistoryRepository.findAll();
        return ResponseEntity.ok(sensors);
    }

    @GetMapping("geojson")
    public ResponseEntity<FeatureCollection> getGeoJSON() {
        List<PurpleAirData> sensors = purpleAirHistoryRepository.getLatest();
        List<Feature> features = new ArrayList<>();
        for (PurpleAirData sensor : sensors) {
            if (sensor.getPm25() == 0) {
                continue;
            }
            Feature f = new Feature();
            Point p = new Point(sensor.getLongitude(), sensor.getLatitude());
            Map<String, Object> properties = new HashMap<>();
            f.setGeometry(p);
            properties.put("purpleair_id", sensor.getPurpleAirID());
            properties.put("time", sensor.getTime().getTime());
            properties.put("pm2_5", sensor.getPm25());
            properties.put("temperature", sensor.getTemperature());
            properties.put("humidity", sensor.getHumidity());
            properties.put("corrected_pm2_5", sensor.getCorrectedPM25());
            properties.put("correction_method", sensor.getCorrectionMethod());
            properties.put("test", new int[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10});
            f.setProperties(properties);
            features.add(f);
        }
        FeatureCollection featureCollection = new FeatureCollection();
        featureCollection.setFeatures(features);
        return ResponseEntity.ok(featureCollection);
    }
}
