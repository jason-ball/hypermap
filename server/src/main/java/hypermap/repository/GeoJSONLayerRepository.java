package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.GeoJSONLayer;
import org.springframework.stereotype.Repository;

@Repository
public interface GeoJSONLayerRepository extends JpaRepository<GeoJSONLayer,Integer>{

}
