package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "geojson_layer")
public class GeoJSONLayer extends MapLayer implements MinimalGeoJSONLayer {

    @Column(name = "geojson")
    private String geoJSON;

}
