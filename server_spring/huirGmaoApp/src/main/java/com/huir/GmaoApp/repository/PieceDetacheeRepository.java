package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.PieceDetachee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PieceDetacheeRepository extends JpaRepository<PieceDetachee, Long> {
    PieceDetachee findByNom(String nom);
}
