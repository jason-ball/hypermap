package hypermap.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.File;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`GeoJSONLayer`")
public class GeoJSONLayer extends MapLayer {

    @Column(name = "`GeoJSON`")
    @JsonProperty
    private String geoJSON;


//    @Transient
//    private File file;
}
