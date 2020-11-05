package entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@Entity
@Table(name = "`HTTPLayer`")
public class HTTPLayer extends MapLayer {

    @Column(name = "`UpdateURL`")
    private String updateURL;

    @Column(name = "`MapLayer`")
    private int updateFrequency;
}
