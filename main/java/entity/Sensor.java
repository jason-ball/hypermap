package entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;




@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity


public class Sensor {
	

    @Id
    @GeneratedValue
    private int SensoriId;
    private String DisplayName;
    
    public Sensor() {}
    
    public Sensor(int SensorId, String DisplayName) {
    	this.SensoriId = SensorId;
    	this.DisplayName = DisplayName;
    	
    }

	
}