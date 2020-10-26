package com.example.demo.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Product") //Table name or create table name using class



public class Product {
	@Id //whatever attribute name we want
	@GeneratedValue //Value generated given by hibernate
	private int id;
	private String name;
	private int quantity ;
	private double price;
	public Object getName() {
		return name;
		
	}
	public void setName(Object name2) {
		this.name = (String) name2;
		
	}
	
	public Object getQuantity() {
		return quantity;
		
	}
	public void setQuantity(Object quantity2) {
		this.name = (String) quantity2;
		
	}
	public Object getPrice() {
		return price;
	}
	public void setPrice(Object price2) {
		this.price = (double) price2;
		
	}
	public Integer getId() {
		return id;
	}
	

}
