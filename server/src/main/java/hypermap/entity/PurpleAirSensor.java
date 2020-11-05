package entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`PurpleAirSensor`")
public class PurpleAirSensor extends Sensor {

    @Column(name = "`PurpleAirID`")
    private int purpleAirID;
}
