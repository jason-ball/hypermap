package hypermap.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "`MapLayer`")
@SequenceGenerator(name = "`MapLayer_LayerID_seq`", sequenceName = "`MapLayer_LayerID_seq`", allocationSize = 1)
public abstract class MapLayer  implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "`MapLayer_LayerID_seq`")
    @Column(name = "`LayerID`")
    private int layerID;

    @JsonProperty
    @Column(name = "`DisplayName`")
    private String displayName;
}
