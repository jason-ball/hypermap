package hypermap.repository;

import hypermap.entity.PurpleAirHistory;
import hypermap.entity.PurpleAirHistoryPrimaryKey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurpleAirHistoryRepository extends JpaRepository<PurpleAirHistory, PurpleAirHistoryPrimaryKey> {
}
