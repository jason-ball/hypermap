package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class PurpleAirAverage {
    private Integer purpleAirID;
    private Timestamp time;
    private Double correctedPM25;
}
