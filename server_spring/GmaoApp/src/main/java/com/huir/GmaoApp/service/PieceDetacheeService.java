package com.huir.GmaoApp.service;

import com.huir.GmaoApp.dto.PieceDetacheeDTO;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.model.Services;
import com.huir.GmaoApp.model.User;
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
    public PieceDetachee addPiece(PieceDetachee piece) {
    	  return  pieceDetacheeRepository.save(piece);
    }
    
    
    //trouver piece par id
    public PieceDetachee getPieceDetacheeById(Long id) {
        return pieceDetacheeRepository.findById(id) // ✅ Utilisation correcte de l'instance
            .orElseThrow(() -> new RuntimeException("Pièce détachée non trouvée avec ID " + id));
    }
    

    
    //mis a jour
  /*  @Transactional
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
*/

    // Get all spare parts
    	
    public List<PieceDetachee> findAllPiecesDetachees() {
        return pieceDetacheeRepository.findAll();
    }

    // Delete a spare part
    public void deletePieceDetachee(Long id) {
        pieceDetacheeRepository.deleteById(id);
    }
    public PieceDetachee findPieceDetacheeById(Long id) {
        return pieceDetacheeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pièce détachée non trouvée avec ID " + id));
    }

   
    
}
