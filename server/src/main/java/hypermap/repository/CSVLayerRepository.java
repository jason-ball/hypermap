package hypermap.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import hypermap.entity.CSVLayer;
import org.springframework.stereotype.Repository;

@Repository
public interface CSVLayerRepository extends JpaRepository<CSVLayer,Integer>{

}
