package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`AirBeam2Sensor`")
public class AirBeamSensor2 extends Sensor {

    @Column(name = "`AirBeam2ID`")
    private int airBeam2ID;
}
