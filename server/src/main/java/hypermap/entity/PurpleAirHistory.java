package hypermap.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.sun.istack.Nullable;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "purpleair_history")
@IdClass(PurpleAirHistoryPrimaryKey.class)
@Getter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurpleAirHistory {
    @Id
    @Column(name = "purpleair_id")
    int purpleAirID;

    @Id
    @Column(name = "time")
    Date time;

    @Column(name = "pm2_5")
    double pm25;

    @Column(name = "temperature")
    Integer temperature;

    @Column(name = "humidity")
    Integer humidity;

    @Column(name = "corrected_pm2_5")
    Double correctedPM25;
}
