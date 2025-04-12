package com.huir.GmaoApp.repository;

import com.huir.GmaoApp.model.Indice;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndiceRepository extends JpaRepository<Indice, Long> {
	Optional<Indice> findByNomIndice(String nomIndice);

   

}
