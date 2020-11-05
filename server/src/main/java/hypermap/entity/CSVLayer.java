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
@Table(name = "`CSVLayer`")
public class CSVLayer extends MapLayer {

    @Column(name = "`CSVFile`")
    private String csvFile;
}
