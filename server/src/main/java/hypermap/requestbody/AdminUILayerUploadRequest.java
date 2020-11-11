package hypermap.requestbody;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUILayerUploadRequest {
    @JsonProperty
    private int layerID;

    @JsonProperty
    private String displayName;

    @JsonProperty
    private String description;

    @JsonProperty
    private String file;

    @JsonProperty
    private String fileType;
}
