package hypermap.controller;

import hypermap.entity.PurpleAirHistory;
import hypermap.repository.PurpleAirHistoryRepository;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
