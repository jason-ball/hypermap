package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.PurpleAirSensor;
import org.springframework.stereotype.Repository;

@Repository
public interface PurpleAirSensorRepository extends JpaRepository<PurpleAirSensor,Integer>{

}
