package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.ArcGISOnlineLayer;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

@Repository
@CrossOrigin(origins = "http://localhost:4200")
public interface ArcGISOnlineLayerRepository extends JpaRepository<ArcGISOnlineLayer,Integer>{

}
