package com.huir.GmaoApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.huir.GmaoApp.model.InterventionPreventive;
import com.huir.GmaoApp.model.PieceDetachee;

public interface InterventionPreventiveRepository  extends JpaRepository<InterventionPreventive, Long> {
    List<InterventionPreventive> findByTechnicienId(Long id);
    @Query("SELECT ipd.pieceDetachee FROM InterventionPieceDetachee ipd WHERE ipd.intervention.id = :interventionId")
    List<PieceDetachee> findPiecesByInterventionId(@Param("interventionId") Long interventionId);
}