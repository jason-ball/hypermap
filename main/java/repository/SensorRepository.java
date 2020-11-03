package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Sensor;

public interface SensorRepository extends JpaRepository<Sensor,Integer>{

}
