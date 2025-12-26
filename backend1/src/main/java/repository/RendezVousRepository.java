package repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import modeles.RendezVous;

public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
	List<RendezVous> findByPatientId(Long patientId);
	List<RendezVous> findByMedecinId(Long medecinId);
	List<RendezVous> findByMedecinIdAndDate(Long medecinId, LocalDateTime date);
}
