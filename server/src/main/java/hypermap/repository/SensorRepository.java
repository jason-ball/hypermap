package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.Sensor;
import org.springframework.stereotype.Repository;

@Repository
public interface SensorRepository extends JpaRepository<Sensor,Integer>{

}
