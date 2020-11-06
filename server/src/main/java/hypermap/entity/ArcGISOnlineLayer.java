package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`ArcGISOnlineLayer`")
public class ArcGISOnlineLayer extends MapLayer {

    @Column(name = "`ArcGISOnlineID`")
    private String arcGISDisplayName;
}
