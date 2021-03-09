package hypermap.repository;

import hypermap.entity.PurpleAirData;
import hypermap.entity.PurpleAirDataPrimaryKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurpleAirHistoryRepository extends JpaRepository<PurpleAirData, PurpleAirDataPrimaryKey> {
    @Query(value = "SELECT * FROM latest_purpleair_data", nativeQuery = true)
    List<PurpleAirData> getLatest();
}
