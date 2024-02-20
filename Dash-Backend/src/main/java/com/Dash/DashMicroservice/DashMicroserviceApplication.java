package com.Dash.DashMicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class DashMicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DashMicroserviceApplication.class, args);
	}

}
