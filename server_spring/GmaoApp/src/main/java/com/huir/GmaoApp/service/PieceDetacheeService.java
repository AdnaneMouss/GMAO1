package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.repository.PieceDetacheeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PieceDetacheeService {

    @Autowired
    private PieceDetacheeRepository pieceDetacheeRepository;
   
    
    public PieceDetacheeService(PieceDetacheeRepository pieceDetacheeRepository)
    {
    	this.pieceDetacheeRepository= pieceDetacheeRepository;
    }

   
    //add  piece
    @Transactional
    public void addPiece(PieceDetacheeDTO pieceDTO) {
    	 PieceDetachee pieceDetachee = new PieceDetachee();
    	    pieceDetachee.setNom(pieceDTO.getNom());
    	    pieceDetachee.setDescription(pieceDTO.getDescription());
    	    pieceDetachee.setReference(pieceDTO.getReference());
    	    pieceDetachee.setFournisseur(pieceDTO.getFournisseur());
    	    pieceDetachee.setCoutUnitaire(pieceDTO.getCoutUnitaire());
    	    pieceDetachee.setQuantiteStock(pieceDTO.getQuantiteStock());
    	    pieceDetachee.setQuantiteMinimale(pieceDTO.getQuantiteMinimale());
    	    pieceDetachee.setDateAchat(pieceDTO.getDateAchat());
    	    pieceDetachee.setDatePeremption(pieceDTO.getDatePeremption());
    	    pieceDetachee.setHistoriqueUtilisation(pieceDTO.getHistoriqueUtilisation());
    	    
    	    pieceDetacheeRepository.save(pieceDetachee);
    }
    
    
    //trouver piece par id
    public Optional<PieceDetachee> FindPieceById(Long id )
    {
    	return pieceDetacheeRepository.findById(id);
    }
    //mis a jour
    
    @Transactional
    public PieceDetacheeDTO updatePiece(Long id, PieceDetacheeDTO pieceDetacheeDTO) {
    	Optional<PieceDetachee> optionalPieceDetachee  =  pieceDetacheeRepository.findById(id);
    	if(optionalPieceDetachee.isPresent())
    	{
    		PieceDetachee PieceDetachee= optionalPieceDetachee.get();
    	      PieceDetachee.setNom(pieceDetacheeDTO.getNom());
	    	  PieceDetachee.setDescription(pieceDetacheeDTO.getDescription());
	    	  PieceDetachee.setReference(pieceDetacheeDTO.getReference());
	    	  PieceDetachee.setFournisseur(pieceDetacheeDTO.getFournisseur());
	    	  PieceDetachee.setCoutUnitaire(pieceDetacheeDTO.getCoutUnitaire());
	    	  PieceDetachee.setQuantiteStock(pieceDetacheeDTO.getQuantiteStock());
	    	  PieceDetachee.setQuantiteMinimale(pieceDetacheeDTO.getQuantiteMinimale());
	    	  PieceDetachee.setDateAchat(pieceDetacheeDTO.getDateAchat());
	    	  PieceDetachee.setDatePeremption(pieceDetacheeDTO.getDatePeremption());
	    	  PieceDetachee.setHistoriqueUtilisation(pieceDetacheeDTO.getHistoriqueUtilisation());
	    	  pieceDetacheeRepository.save(PieceDetachee);
	    	  return new PieceDetacheeDTO(PieceDetachee);
    		
    		
    	}
 return null;
    }


    // Get all spare parts
    	
    public List<PieceDetachee> findAllPiecesDetachees() {
        return pieceDetacheeRepository.findAll();
    }

    // Delete a spare part
    public void deletePieceDetachee(Long id) {
        pieceDetacheeRepository.deleteById(id);
    }
    public Optional<PieceDetachee> findPieceDetacheeById(Long id) {
        return pieceDetacheeRepository.findById(id);
    }

   
    
}
