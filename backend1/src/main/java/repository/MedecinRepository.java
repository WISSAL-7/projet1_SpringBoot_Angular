package repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import modeles.Medecin;

public interface MedecinRepository extends JpaRepository<Medecin ,Long> {
    List<Medecin> findBySpecialite(String specialite);

}
