package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Table(name = "`MapLayer`")
public abstract class MapLayer {

    @Id
    @GeneratedValue
    @Column(name = "`LayerID`")
    private int layerID;


    @Column(name = "`DisplayName`")
    private int displayName;
}
