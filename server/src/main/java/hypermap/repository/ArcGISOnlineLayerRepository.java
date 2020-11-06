package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.ArcGISOnlineLayer;
import org.springframework.stereotype.Repository;

@Repository
public interface ArcGISOnlineLayerRepository extends JpaRepository<ArcGISOnlineLayer,Integer>{

}
