package hypermap.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "arcgis_layer")
public class ArcGISLayer extends MapLayer {

    @Column(name = "arcgis_id")
    @JsonProperty
    private String arcgisID;

}
