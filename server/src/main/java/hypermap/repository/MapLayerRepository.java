package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.MapLayer;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@Repository
@CrossOrigin(origins = "http://localhost:4200")
public interface MapLayerRepository extends JpaRepository<MapLayer,Integer>{

}