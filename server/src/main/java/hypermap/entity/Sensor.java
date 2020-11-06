package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;




@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "`Sensor`")
public abstract class Sensor {
	

    @Id
    @GeneratedValue
    @Column(name = "`SensorID`")
    private int SensorId;

    @Column(name = "`DisplayName`")
    private String DisplayName;

	
}