package hypermap.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "`CSVLayer`")
public class CSVLayer extends MapLayer {

    @Column(name = "`CSVFile`")
    private String csvFile;
}
