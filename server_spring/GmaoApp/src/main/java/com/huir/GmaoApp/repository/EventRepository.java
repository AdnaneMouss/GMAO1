package com.huir.GmaoApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.huir.GmaoApp.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
}