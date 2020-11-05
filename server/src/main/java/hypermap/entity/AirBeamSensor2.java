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
@Table(name = "`AirBeam2Sensor`")
public class AirBeamSensor2 extends Sensor {

    @Id
    @Column(name = "`AirBeam2ID`")
    private int airBeam2ID;
}
