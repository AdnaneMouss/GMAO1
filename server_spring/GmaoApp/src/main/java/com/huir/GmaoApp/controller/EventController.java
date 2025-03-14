package com.huir.GmaoApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.huir.GmaoApp.dto.EventDTO;
import com.huir.GmaoApp.model.Event;
import com.huir.GmaoApp.repository.EventRepository;
import com.huir.GmaoApp.service.EventService;


import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

	@Autowired
    private EventRepository eventRepository;

   
  
    
    @Transactional
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Transactional
    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

  

    
}