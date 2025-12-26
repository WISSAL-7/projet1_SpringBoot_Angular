package services;

import modeles.*;
import repository.MedecinRepository;
import repository.PatientRepository;
import repository.RendezVousRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RendezVousService {
    
    @Autowired
    private RendezVousRepository rendezVousRepository;
    
    @Autowired
    private MedecinRepository medecinRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    public RendezVous creerRendezVous(RendezVous rendezVous, Long patientId, Long medecinId) {
        // Vérifier que patient et médecin existent
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
        
        Medecin medecin = medecinRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));
        
        // Vérifier disponibilité
        if (!estDisponible(medecinId, rendezVous.getDate())) {
            throw new RuntimeException("Le médecin n'est pas disponible à cette heure");
        }
        
        rendezVous.setPatient(patient);
        rendezVous.setMedecin(medecin);
        rendezVous.setStatut(StatutRendezVous.PLANIFIE);
        
        return rendezVousRepository.save(rendezVous);
    }
    
    public List<RendezVous> getRendezVousByPatient(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId);
    }
    
    public List<RendezVous> getRendezVousByMedecin(Long medecinId) {
        return rendezVousRepository.findByMedecinId(medecinId);
    }
    
    public RendezVous updateStatut(Long id, StatutRendezVous statut) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        
        rendezVous.setStatut(statut);
        return rendezVousRepository.save(rendezVous);
    }
    
    public void annulerRendezVous(Long id) {
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
        
        rendezVous.setStatut(StatutRendezVous.ANNULE);
        rendezVousRepository.save(rendezVous);
    }
    
    private boolean estDisponible(Long medecinId, LocalDateTime date) {
        // Vérifier si le médecin a déjà un rendez-vous à cette heure
        List<RendezVous> rdvs = rendezVousRepository.findByMedecinIdAndDate(medecinId, date);
        return rdvs.isEmpty();
    }
}