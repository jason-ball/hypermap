package entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Sensor")
@Data
@AllArgsConstructor
@NoArgsConstructor

public class Sensor {
	@Id
    @GeneratedValue
    private int SensorId;
    private String DisplayName;

}
