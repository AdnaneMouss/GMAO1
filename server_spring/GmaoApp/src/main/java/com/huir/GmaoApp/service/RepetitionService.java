package com.huir.GmaoApp.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.model.Maintenance;
import com.huir.GmaoApp.model.MaintenanceCorrective;
import com.huir.GmaoApp.model.RepetitionInstance;
import com.huir.GmaoApp.model.Statut;
import com.huir.GmaoApp.repository.RepetitionInstanceRepository;
@Service
public class RepetitionService {
	 @Autowired
	 private  RepetitionInstanceRepository repetitionInstanceRepository ;
	 public RepetitionInstance startTask(Long id) {
	        Optional<RepetitionInstance> Repetition = repetitionInstanceRepository.findById(id);
	        if (Repetition.isPresent()) {
	        	RepetitionInstance maintenance = Repetition.get();
	            if (maintenance.getStatut() == Statut.EN_ATTENTE) {
	                maintenance.setStatut(Statut.EN_COURS);
	                return repetitionInstanceRepository.save(maintenance);
	            }
	        }
	        return null;
	    }
	 
	 public RepetitionInstance markAsCompleted(Long id) {
	        Optional<RepetitionInstance> Repetition = repetitionInstanceRepository.findById(id);
	        if (Repetition.isPresent()) {
	        	RepetitionInstance maintenance = Repetition.get();
	            if (maintenance.getStatut().equals(Statut.EN_COURS)) {
	                maintenance.setStatut(Statut.TERMINEE);
	                return repetitionInstanceRepository.save(maintenance);
	            }
	        }
	        return null;
	    }

	    
	


    
	   

}
