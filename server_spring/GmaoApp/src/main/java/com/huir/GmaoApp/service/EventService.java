package com.huir.GmaoApp.service;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.huir.GmaoApp.dto.EventDTO;
import com.huir.GmaoApp.model.Event;
import com.huir.GmaoApp.repository.EventRepository;


import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService {
	 @Autowired
	    private EventRepository eventRepository;

	  @Transactional
	    public List<Event> getAllEvents() {
	        return eventRepository.findAll();
	    }

	    // Récupérer un événement par son ID
	    @Transactional
	    public Event getEventById(Long id) {
	        Optional<Event> event = eventRepository.findById(id);
	        return event.orElse(null); // Retourne null si l'événement n'est pas trouvé
	    }

	    // Créer un nouvel événement
	    @Transactional
	    public Event createEvent(Event event) {
	        return eventRepository.save(event);
	    }

	    // Mettre à jour un événement existant
	    @Transactional
	    public Event updateEvent(Long id, Event eventDetails) {
	        Optional<Event> optionalEvent = eventRepository.findById(id);
	        if (optionalEvent.isPresent()) {
	            Event event = optionalEvent.get();
	            event.setStartDate(eventDetails.getStartDate());
	            event.setEndDate(eventDetails.getEndDate());
	            event.setRepetitionType(eventDetails.getRepetitionType());
	            event.setSelectedDays(eventDetails.getSelectedDays()); 
	            event.setSelectedMonth(eventDetails.getSelectedMonth());
	            return eventRepository.save(event);
	        }
	        return null; // Retourne null si l'événement n'est pas trouvé
	    }

	    // Supprimer un événement
	    @Transactional
	    public void deleteEvent(Long id) {
	        eventRepository.deleteById(id);
	    }
}   