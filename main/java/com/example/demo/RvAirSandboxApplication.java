package com.example.demo;

import controller.SensorController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
@EnableJpaRepositories("repository")
@EntityScan("entity")
@ComponentScan(basePackageClasses = SensorController.class)
public class TheSandboxApplication {


	public static void main(String[] args) {
		SpringApplication.run(TheSandboxApplication.class, args);
	}

}
