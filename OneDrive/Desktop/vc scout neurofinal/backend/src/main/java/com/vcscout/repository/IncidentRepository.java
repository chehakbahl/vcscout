package com.vcscout.repository;

import com.vcscout.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByStartupId(Long startupId);
    List<Incident> findAllByOrderByCreatedAtDesc();
}
