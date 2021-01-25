package hypermap.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LayerResponse {
    private String name;
    private String type;
    private String path;
    private String arcgis;

    // Backwards compat. for admin-ui
    private String displayName;
    private int layerID;
    private String description;
    private String fileType;
    private int size = 0;
}
