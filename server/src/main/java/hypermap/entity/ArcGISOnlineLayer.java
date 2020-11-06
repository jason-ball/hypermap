package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@Entity
@Table(name = "`ArcGISOnlineLayer`")
public class ArcGISOnlineLayer extends MapLayer {

    @Column(name = "`ArcGISOnlineID`")
    private String arcGISDisplayName;
}
