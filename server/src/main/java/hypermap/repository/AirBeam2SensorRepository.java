package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.AirBeamSensor2;
import org.springframework.stereotype.Repository;

@Repository
public interface AirBeam2SensorRepository extends JpaRepository<AirBeamSensor2,Integer>{

}
