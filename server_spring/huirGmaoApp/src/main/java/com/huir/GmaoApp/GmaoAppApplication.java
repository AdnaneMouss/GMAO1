package com.huir.GmaoApp;

import com.huir.GmaoApp.model.Equipement;
import com.huir.GmaoApp.service.EquipementService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
public class GmaoAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(GmaoAppApplication.class, args);
	}
	Equipement equipement = new Equipement();
	EquipementService equipementService = new EquipementService();

	public GmaoAppApplication(EquipementService equipementService) {
		this.equipementService = equipementService;
	}

}
