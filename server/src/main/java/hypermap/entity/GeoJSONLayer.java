package entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@Entity
@Table(name = "`GeoJSONLayer`")
public class GeoJSONLayer extends MapLayer {

    @Column(name = "`GeoJSON`")
    private String geoJSON;
}
