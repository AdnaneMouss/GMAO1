package com.huir.GmaoApp;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.huir.GmaoApp.dto.MaintenanceDTO;
import com.huir.GmaoApp.model.*;
import com.huir.GmaoApp.service.*;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootApplication
public class GmaoAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(GmaoAppApplication.class, args);
		
		

		
        // event.setRepetitionType(repetition_type.TOUS_LES_JOURS);

       
      //  assertEquals(LocalDate.of(2023, 10, 2), nextDate, "La prochaine date doit être le jour suivant");
    }

	

		
		
		
	
	
	Equipement equipement = new Equipement();
	EquipementService equipementService = new EquipementService();

	public GmaoAppApplication(EquipementService equipementService) {
		this.equipementService = equipementService;
	}

}
