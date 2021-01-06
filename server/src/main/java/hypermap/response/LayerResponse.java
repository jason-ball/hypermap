package hypermap.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LayerResponse {
    private String name;
    private String type;
    private String path;

    // Backwards compat. for admin-ui
    private String displayName;
    private int layerID;
    private String description;
    private String fileType = "GeoJSON";
    private int size = 0;
}
