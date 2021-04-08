package hypermap.entity;

import com.fasterxml.jackson.annotation.*;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class PurpleAirData {
    @Id
    @Column(name = "purpleair_id")
    @JsonProperty("sensor_index")
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

    @JsonSetter("sensor_index")
    public void setPurpleAirID(int purpleAirID) {
        this.purpleAirID = purpleAirID;
    }

    @JsonSetter("last_seen")
    public void setTime(Date time) {
        this.time = time;
    }

    @JsonSetter("pm2.5")
    public void setPm25(double pm25) {
        this.pm25 = pm25;
    }

    @JsonSetter("temperature")
    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    @JsonSetter("humidity")
    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    @JsonSetter("latitude")
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    @JsonSetter("longitude")
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setCorrectedPM25(Double correctedPM25) {
        this.correctedPM25 = correctedPM25;
    }

    public void setCorrectionMethod(String correctionMethod) {
        this.correctionMethod = correctionMethod;
    }

    @Override
    public String toString() {
        return "PurpleAirData{" +
                "purpleAirID=" + purpleAirID +
                ", time=" + time +
                ", pm25=" + pm25 +
                ", temperature=" + temperature +
                ", humidity=" + humidity +
                ", correctedPM25=" + correctedPM25 +
                ", correctionMethod='" + correctionMethod + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
