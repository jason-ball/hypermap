package hypermap.repository;

import hypermap.entity.LayerIdAndName;
import hypermap.entity.MapLayer;
import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.GeoJSONLayer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Repository
@CrossOrigin(origins = "http://localhost:4200")
public interface SimpleGeoJSONLayerRepository extends org.springframework.data.repository.Repository<MapLayer,Integer> {
    @Query(value = "SELECT \"LayerID\", \"DisplayName\" from \"MapLayer\"", nativeQuery = true)
    List<LayerIdAndName> findAll();
}
