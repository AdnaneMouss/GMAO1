package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Intervention;
import com.huir.GmaoApp.model.PieceDetachee;
import com.huir.GmaoApp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByTechnicienId(Long id);
    @Query("SELECT ipd.pieceDetachee FROM InterventionPieceDetachee ipd WHERE ipd.intervention.id = :interventionId")
    List<PieceDetachee> findPiecesByInterventionId(@Param("interventionId") Long interventionId);

}
