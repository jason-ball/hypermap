package entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Inheritance
@Table(name = "`MapLayer`")
public class MapLayer {

    @Id
    @GeneratedValue
    @Column(name = "`LayerID`")
    private int layerID;


    @Column(name = "`DisplayName`")
    private int displayName;
}
