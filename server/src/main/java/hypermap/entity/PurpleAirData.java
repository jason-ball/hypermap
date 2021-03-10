package hypermap.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "purpleair_history")
@IdClass(PurpleAirDataPrimaryKey.class)
@Getter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurpleAirData {
    @Id
    @Column(name = "purpleair_id")
    private int purpleAirID;

    @Id
    @Column(name = "time")
    private Date time;

    @Column(name = "pm2_5")
    private double pm25;

    @Column(name = "temperature")
    private Integer temperature;    // Nullable

    @Column(name = "humidity")
    private Integer humidity;       // Nullable

    @Column(name = "corrected_pm2_5")
    private Double correctedPM25;   // Nullable

    @Column(name = "correction_method")
    private String correctionMethod;

    @Column(name = "latitude")
    private double latitude;

    @Column(name = "longitude")
    private double longitude;

}
