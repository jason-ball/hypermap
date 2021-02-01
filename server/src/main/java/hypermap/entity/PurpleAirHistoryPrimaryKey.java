package hypermap.entity;

import lombok.Data;

import javax.persistence.Column;
import java.io.Serializable;
import java.util.Date;

@Data
public class PurpleAirHistoryPrimaryKey implements Serializable {
    @Column(name = "purpleair_id")
    private int purpleAirID;

    @Column(name = "time")
    private Date time;
}
