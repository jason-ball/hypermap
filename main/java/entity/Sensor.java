package entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;




@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "`Sensor`")
public class Sensor {
	

    @Id
    @GeneratedValue
    @Column(name = "`SensorID`")
    private int SensorId;

    @Column(name = "`DisplayName`")
    private String DisplayName;

	
}