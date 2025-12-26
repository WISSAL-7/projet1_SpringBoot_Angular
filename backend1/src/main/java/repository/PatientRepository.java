package repository;

import org.springframework.data.jpa.repository.JpaRepository;

import modeles.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
	
}
