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
}