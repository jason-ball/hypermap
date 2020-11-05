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
@Table(name = "`ArcGISOnlineLayer`")
public class ArcGISOnlineLayer extends MapLayer {

    @Id
    @Column(name = "`ArcGISOnlineID`")
    private String displayName;
}
