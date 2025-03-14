package com.huir.GmaoApp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.model.Periodicite;
import com.huir.GmaoApp.repository.PeriodiciteRepository;




@Service
public class PeriodiciteService {

    @Autowired
    private  PeriodiciteRepository   periodiciteRepository ;


    public  Periodicite savePeriodicitePeriodicite(Periodicite periodicite) {
        return periodiciteRepository.save(periodicite);
    }

   

}
