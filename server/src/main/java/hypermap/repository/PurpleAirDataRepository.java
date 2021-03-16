package hypermap.repository;

import hypermap.entity.PurpleAirAverage;
import hypermap.entity.PurpleAirData;
import hypermap.entity.PurpleAirDataPrimaryKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurpleAirDataRepository extends JpaRepository<PurpleAirData, PurpleAirDataPrimaryKey> {
    @Query(value = "SELECT * FROM latest_purpleair_data", nativeQuery = true)
    List<PurpleAirData> getLatest();

    List<PurpleAirAverage> getByPurpleAirID(int id);

    @Query(value = "SELECT purpleair_id, date_trunc('day', purpleair_history.time) AS time, ROUND(AVG(corrected_pm2_5), 2) as corrected_pm2_5\n" +
            "FROM purpleair_history\n" +
            "WHERE purpleair_id = :id\n" +
            "GROUP BY date_trunc('day', purpleair_history.time), purpleair_id\n" +
            "ORDER BY time", nativeQuery = true)
    List<Object[]> getDailyDataByID(@Param("id") int id);

    @Query(value = "SELECT *\n" +
            "FROM (SELECT purpleair_id, date_trunc('hour', purpleair_history.time) AS time, ROUND(AVG(corrected_pm2_5), 2) as corrected_pm2_5\n" +
            "FROM purpleair_history\n" +
            "WHERE purpleair_id = :id\n" +
            "GROUP BY date_trunc('hour', purpleair_history.time), purpleair_id\n" +
            "ORDER BY time DESC\n" +
            "LIMIT 24) a\n" +
            "ORDER BY time ASC;", nativeQuery = true)
    List<Object[]> getHourlyDataByID(@Param("id") int id);

    @Query(value = "SELECT *\n" +
            "FROM (SELECT purpleair_id, date_trunc('hour', purpleair_history.time) AS time, ROUND(AVG(corrected_pm2_5), 2) as corrected_pm2_5\n" +
            "FROM purpleair_history\n" +
            "WHERE purpleair_id = :id\n" +
            "GROUP BY date_trunc('hour', purpleair_history.time), purpleair_id\n" +
            "ORDER BY time DESC\n" +
            "LIMIT 8) a\n" +
            "ORDER BY time ASC;", nativeQuery = true)
    List<Object[]> getEightHourDataByID(@Param("id") int id);

    @Query(value = "SELECT *\n" +
            "FROM (SELECT purpleair_id, date_trunc('minute', purpleair_history.time) AS time, ROUND(AVG(corrected_pm2_5), 2) as corrected_pm2_5\n" +
            "FROM purpleair_history\n" +
            "WHERE purpleair_id = :id AND time > current_timestamp - interval '1 hour'\n" +
            "GROUP BY date_trunc('minute', purpleair_history.time), purpleair_id\n" +
            "ORDER BY time DESC\n" +
            "LIMIT 12) a\n" +
            "ORDER BY time ASC;", nativeQuery = true)
    List<Object[]> getLastHourDataByID(@Param("id") int id);
}
