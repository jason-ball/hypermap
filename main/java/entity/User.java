package entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor
@Table(name ="users")
public class User {
	private @Id long id;
	
	@Column (name ="firstName")
	private String firstName;
	
	@Column (name="lastName")
	private String lastName;
	
	@Column (name="email")
	private String email;
	
	public User(String firstName, String lastName, String email)
	{
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
	}

}
