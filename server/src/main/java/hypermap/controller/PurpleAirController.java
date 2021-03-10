package hypermap.controller;

import hypermap.entity.PurpleAirAverage;
import hypermap.entity.PurpleAirChartData;
import hypermap.entity.PurpleAirData;
import hypermap.repository.PurpleAirDataRepository;
import io.swagger.annotations.Api;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.Point;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

@RestController
@RequestMapping("/api/purpleair")
@Api(tags = "PurpleAir")
@CrossOrigin
public class PurpleAirController {
    private PurpleAirDataRepository purpleAirDataRepository;

    @Autowired
    public void setPurpleAirHistoryRepository(PurpleAirDataRepository purpleAirDataRepository) {
        this.purpleAirDataRepository = purpleAirDataRepository;
    }

    @GetMapping("history")
    public ResponseEntity<List<PurpleAirData>> getHistory() {
        List<PurpleAirData> sensors = purpleAirDataRepository.findAll();
        return ResponseEntity.ok(sensors);
    }

    @GetMapping("history/{id}")
    public ResponseEntity<List<PurpleAirAverage>> getHistoryForSensor(@PathVariable int id) {
        List<PurpleAirAverage> data = purpleAirDataRepository.getByPurpleAirID(id);
        return ResponseEntity.ok(data);
    }

    @GetMapping("history/chart/{id}")
    public ResponseEntity<PurpleAirChartData> getChartDataForSensor(@PathVariable int id) {
        List<Object[]> weekData = purpleAirDataRepository.getDailyDataByID(id);
        List<Object[]> hourlyData = purpleAirDataRepository.getHourlyDataByID(id);
        List<Object[]> eightHourData = purpleAirDataRepository.getEightHourDataByID(id);
        List<Object[]> hourData = purpleAirDataRepository.getLastHourDataByID(id);

        PurpleAirChartData chartData = new PurpleAirChartData(fixDBOutput(weekData), fixDBOutput(hourlyData), fixDBOutput(eightHourData), fixDBOutput(hourData));

        return ResponseEntity.ok(chartData);
    }

    @GetMapping("geojson")
    public ResponseEntity<FeatureCollection> getGeoJSON() {
        List<PurpleAirData> sensors = purpleAirDataRepository.getLatest();
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
            // properties.put("time", sensor.getTime().getTime());
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

    private List<PurpleAirAverage> fixDBOutput(List<Object[]> data) {
        // JPA made me do this. -Jason
        List<PurpleAirAverage> averages = new ArrayList<>();
        for (Object[] o : data) {
            if (o.length == 3 && o[0] instanceof Integer && o[1] instanceof Timestamp && o[2] instanceof BigDecimal) {
                Integer purpleAirID = (Integer) o[0];
                Timestamp timestamp = (Timestamp) o[1];
                Double pm25 = ((BigDecimal) o[2]).doubleValue();
                averages.add(new PurpleAirAverage(purpleAirID, timestamp, pm25));
            }
        }
        return averages;
    }
}
