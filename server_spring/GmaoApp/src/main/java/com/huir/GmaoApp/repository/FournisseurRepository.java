package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.Fournisseur;

import java.util.List;
import java.util.Optional;

@Repository
public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {
    boolean existsByEmail(String email);

    boolean existsByNom(String nom);

    boolean existsByTelephone(String telephone);

    boolean existsByNomAndActifTrue(String nom);

    boolean existsByTelephoneAndActifTrue(String telephone);

    boolean existsByEmailAndActifTrue(String email);

    List<Fournisseur> findByActifTrue();

    List<Fournisseur> findByActifFalse();
}

