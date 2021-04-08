package hypermap.support;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class PurpleAirAPIResponse implements Serializable {
    private List<String> fields;
    private List<List<Object>> data;
}
