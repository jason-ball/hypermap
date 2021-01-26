package hypermap.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;

import javax.persistence.*;
import java.io.Serializable;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "map_layer")
public class MapLayer {

    @Id
    @SequenceGenerator(name="layer_seq", sequenceName="map_layer_layer_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "layer_seq")
    @Column(name = "layer_id")
    private int layerID;

    @JsonProperty
    @Column(name = "display_name")
    private String displayName;

    @JsonProperty
    @Column(name = "description")
    private String description;
}
