package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PurpleAirChartData {
    private List<PurpleAirAverage> week;
    private List<PurpleAirAverage> hourly;
    private List<PurpleAirAverage> eightHours;
    private List<PurpleAirAverage> hour;
}
