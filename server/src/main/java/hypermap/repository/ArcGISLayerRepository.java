package hypermap.repository;

import hypermap.entity.ArcGISLayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArcGISLayerRepository extends JpaRepository<ArcGISLayer, Integer> {
}
