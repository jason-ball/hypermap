package hypermap;

import com.fasterxml.jackson.databind.ObjectMapper;
import hypermap.entity.PurpleAirData;
import hypermap.repository.PurpleAirDataRepository;
import hypermap.support.PurpleAirAPIResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Configuration
public class PurpleAirExecutor {
    private final ScheduledExecutorService executorService;
    private final String url = "https://api.purpleair.com/v1/sensors?fields=sensor_index,name,last_seen,latitude,longitude,pm2.5,temperature,humidity&nwlat=39.515599616919&nwlng=-83.80692410526318&selat=36.487457065348174&selng=-75.71614098105748";
    private final String apiKey = "F6442F88-3E3A-11EB-9893-42010A8001E8";
    private final RestTemplate restTemplate;
    private final HttpHeaders headers;
    private final HttpEntity<?> httpEntity;
    private final ObjectMapper objectMapper;
    private PurpleAirDataRepository purpleAirDataRepository;

    public PurpleAirExecutor() {
        executorService = Executors.newSingleThreadScheduledExecutor();
        restTemplate = new RestTemplate();
        headers = new HttpHeaders();
        headers.add("X-API-KEY", apiKey);
        httpEntity = new HttpEntity<>(headers);
        objectMapper = new ObjectMapper();
    }

    @Autowired
    public void setPurpleAirDataRepository(PurpleAirDataRepository purpleAirDataRepository) {
        this.purpleAirDataRepository = purpleAirDataRepository;
    }

    public void scheduleUpdates() {
        this.executorService.scheduleAtFixedRate(this::fetchPurpleAirData, 0L, 10L, TimeUnit.MINUTES);
    }

    private void fetchPurpleAirData() {
        System.out.println("Updating PurpleAir data...");
        ResponseEntity<PurpleAirAPIResponse> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, PurpleAirAPIResponse.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            List<String> fields = response.getBody().getFields();
            List<List<Object>> responseData = response.getBody().getData();
            List<Map<String, Object>> data = new ArrayList<>();
            for (List<Object> row : responseData) {
                Map<String, Object> sensor = new HashMap<>();
                for (int i = 0; i < row.size(); i++) {
                    sensor.put(fields.get(i), row.get(i));
                }
                data.add(sensor);
            }
            List<PurpleAirData> sensorData = new ArrayList<>();
            for (Map<String, Object> s : data) {
                try {
                    s.computeIfPresent("last_seen", (k, v) -> new Timestamp((int) v * 1000L));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                try {
                    sensorData.add(objectMapper.convertValue(s, PurpleAirData.class));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            correctSensors(sensorData);
            try {
                purpleAirDataRepository.saveAll(sensorData);
            } catch (Exception e) {
                System.out.println("Skipping existing sensors");
            }
        } else {
            System.out.println("Failed to fetch");
        }
    }

    private void correctSensors(List<PurpleAirData> data) {
        // PM2.5 = 0.38*PM2.5 + 2.94
        // PM2.5 = 0.39*PM2.5 + 0.0024*T - 0.050*RH + 5.19
        for (PurpleAirData sensor : data) {
            if (sensor.getTemperature() != null && sensor.getHumidity() != null) {
                sensor.setCorrectedPM25((0.39 * sensor.getPm25()) + (0.0024 * sensor.getTemperature()) - (0.050 * sensor.getHumidity()) + 5.19);
                sensor.setCorrectionMethod("T & RH");
            } else {
                sensor.setCorrectedPM25((0.38 * sensor.getPm25()) + 2.94);
                sensor.setCorrectionMethod("Linear");
            }
            sensor.setCorrectedPM25(Math.round(sensor.getCorrectedPM25() * 100) / 100.0);
        }
    }
}
