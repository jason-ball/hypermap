package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import entity.Sensor;
import org.springframework.stereotype.Repository;

import javax.persistence.Table;

@Repository
public interface SensorRepository extends JpaRepository<Sensor,Integer>{

}
