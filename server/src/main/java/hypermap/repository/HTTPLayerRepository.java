package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.HTTPLayer;
import org.springframework.stereotype.Repository;

@Repository
public interface HTTPLayerRepository extends JpaRepository<HTTPLayer,Integer>{

}
