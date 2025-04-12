package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.PieceDetachee;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PieceDetacheeRepository extends JpaRepository<PieceDetachee, Long> {

    boolean existsByReference(String reference);
}
