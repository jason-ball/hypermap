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
@Table(name = "`HTTPLayer`")
public class HTTPLayer extends MapLayer {

    @Column(name = "`UpdateURL`")
    private String updateURL;

    @Column(name = "`MapLayer`")
    private int updateFrequency;
}
