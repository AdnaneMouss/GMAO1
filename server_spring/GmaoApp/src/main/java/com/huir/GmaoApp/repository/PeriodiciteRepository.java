




package com.huir.GmaoApp.repository;






import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.huir.GmaoApp.model.Periodicite;

@Repository
public interface PeriodiciteRepository extends JpaRepository<Periodicite, Long> {
    // Vous pouvez définir des méthodes de requête personnalisées ici si nécessaire
}


