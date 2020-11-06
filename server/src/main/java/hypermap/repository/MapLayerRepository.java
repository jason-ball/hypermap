package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.MapLayer;
import org.springframework.stereotype.Repository;

@Repository
public interface MapLayerRepository extends JpaRepository<MapLayer,Integer>{

}
