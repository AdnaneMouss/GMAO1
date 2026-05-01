package com.huir.GmaoApp.repository;

import com.fasterxml.jackson.datatype.jdk8.OptionalSerializer;
import com.huir.GmaoApp.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ServicesRepository extends JpaRepository<Services, Long> {
    Services findByNom(String nom);
    boolean existsByNom(String nom);

    boolean existsByNom(Services service);

    boolean existsByNomAndActifTrue(String nom);

    List<Services> findByActifTrue();

    List<Services> findByActifFalse();

}
