package services;

import modeles.*;
import repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import modeles.Role;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MedecinRepository medecinRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // === CRUD GÉNÉRAL ===
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Transactional
    public User registerUser(User user) {
        // Vérifier email unique
        if (existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Déterminer le rôle par défaut
        if (user.getRole() == null) {
            user.setRole(Role.PATIENT);
        }
        
        // Sauvegarder selon le rôle
        if (user.getRole() == Role.MEDECIN) {
            Medecin medecin = new Medecin();
            medecin.setEmail(user.getEmail());
            medecin.setPassword(user.getPassword());
            medecin.setUsername(user.getUsername());
            medecin.setPhone(user.getPhone());
            medecin.setRole(Role.MEDECIN);
            medecin.setNom(user.getUsername()); // Par défaut
            medecin.setSpecialite("Généraliste"); // Par défaut
            return medecinRepository.save(medecin);
            
        } else if (user.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setEmail(user.getEmail());
            patient.setPassword(user.getPassword());
            patient.setUsername(user.getUsername());
            patient.setPhone(user.getPhone());
            patient.setRole(Role.PATIENT);
            patient.setNom(user.getUsername()); // Par défaut
            patient.setTelephone(user.getPhone()); // Par défaut
            return patientRepository.save(patient);
            
        } else {
            // ADMIN ou utilisateur normal
            return userRepository.save(user);
        }
    }
    
    public User updateUser(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Mettre à jour les champs de base
        if (updates.containsKey("username")) {
            user.setUsername((String) updates.get("username"));
        }
        if (updates.containsKey("phone")) {
            user.setPhone((String) updates.get("phone"));
        }
        if (updates.containsKey("email")) {
            String newEmail = (String) updates.get("email");
            // Vérifier que l'email n'est pas déjà utilisé
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
                throw new RuntimeException("Email déjà utilisé");
            }
            user.setEmail(newEmail);
        }
        if (updates.containsKey("password")) {
            user.setPassword(passwordEncoder.encode((String) updates.get("password")));
        }
        
        // Mettre à jour les attributs spécifiques selon le type d'utilisateur
        if (user.getRole() == Role.MEDECIN && user instanceof Medecin) {
            updateMedecinAttributes((Medecin) user, updates);
        } else if (user.getRole() == Role.PATIENT && user instanceof Patient) {
            updatePatientAttributes((Patient) user, updates);
        }
        
        return userRepository.save(user);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Supprimer selon le type
        if (user.getRole() == Role.MEDECIN) {
            medecinRepository.deleteById(id);
        } else if (user.getRole() == Role.PATIENT) {
            patientRepository.deleteById(id);
        } else {
            userRepository.deleteById(id);
        }
    }
    
    // === OPÉRATIONS SPÉCIFIQUES MÉDECIN ===
    
    public List<Medecin> getAllMedecins() {
        return medecinRepository.findAll();
    }
    
    public List<Medecin> getMedecinsBySpecialite(String specialite) {
        return medecinRepository.findBySpecialite(specialite);
    }
    
    public Medecin getMedecinById(Long id) {
        return medecinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));
    }
    
    public Medecin updateMedecin(Long id, Map<String, Object> updates) {
        Medecin medecin = getMedecinById(id);
        return updateMedecinAttributes(medecin, updates);
    }
    
    private Medecin updateMedecinAttributes(Medecin medecin, Map<String, Object> updates) {
        if (updates.containsKey("nom")) {
            medecin.setNom((String) updates.get("nom"));
        }
        if (updates.containsKey("specialite")) {
            medecin.setSpecialite((String) updates.get("specialite"));
        }
        return medecinRepository.save(medecin);
    }
    
    // === OPÉRATIONS SPÉCIFIQUES PATIENT ===
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));
    }
    
    public Patient updatePatient(Long id, Map<String, Object> updates) {
        Patient patient = getPatientById(id);
        return updatePatientAttributes(patient, updates);
    }
    
    private Patient updatePatientAttributes(Patient patient, Map<String, Object> updates) {
        if (updates.containsKey("nom")) {
            patient.setNom((String) updates.get("nom"));
        }
        if (updates.containsKey("telephone")) {
            patient.setTelephone((String) updates.get("telephone"));
        }
        return patientRepository.save(patient);
    }
    
    // === UTILITAIRES ===
    
    public boolean userExists(Long id) {
        return userRepository.existsById(id);
    }
    
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
   
    
    // === RECHERCHE ===
    
    public List<User> searchUsers(String keyword) {
        // Recherche par email, username ou nom selon le type
        return userRepository.findAll().stream()
                .filter(user -> {
                    String search = keyword.toLowerCase();
                    boolean matches = user.getEmail().toLowerCase().contains(search) ||
                                     user.getUsername().toLowerCase().contains(search);
                    
                    if (user instanceof Medecin) {
                        matches = matches || ((Medecin) user).getNom().toLowerCase().contains(search);
                    } else if (user instanceof Patient) {
                        matches = matches || ((Patient) user).getNom().toLowerCase().contains(search);
                    }
                    
                    return matches;
                })
                .toList();
    }
    
    // === STATISTIQUES ===
    
    public Map<String, Long> getUserStatistics() {
        long totalUsers = userRepository.count();
        long totalMedecins = medecinRepository.count();
        long totalPatients = patientRepository.count();
        long totalAdmins = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN)
                .count();
        
        return Map.of(
            "totalUsers", totalUsers,
            "medecins", totalMedecins,
            "patients", totalPatients,
            "admins", totalAdmins
        );
    }
    
    // === CHANGEMENT DE RÔLE (admin seulement) ===
    
    @Transactional
    public User changeUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Si le rôle ne change pas, retourner tel quel
        if (user.getRole() == newRole) {
            return user;
        }
        
        // Supprimer l'entité spécifique existante
        if (user.getRole() == Role.MEDECIN) {
            medecinRepository.deleteById(userId);
        } else if (user.getRole() == Role.PATIENT) {
            patientRepository.deleteById(userId);
        }
        
        // Créer la nouvelle entité selon le nouveau rôle
        if (newRole == Role.MEDECIN) {
            Medecin medecin = new Medecin();
            medecin.setId(userId);
            medecin.setEmail(user.getEmail());
            medecin.setPassword(user.getPassword());
            medecin.setUsername(user.getUsername());
            medecin.setPhone(user.getPhone());
            medecin.setRole(Role.MEDECIN);
            medecin.setNom(user.getUsername()); // Par défaut
            medecin.setSpecialite("Généraliste"); // Par défaut
            medecinRepository.save(medecin);
            return medecin;
            
        } else if (newRole == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setId(userId);
            patient.setEmail(user.getEmail());
            patient.setPassword(user.getPassword());
            patient.setUsername(user.getUsername());
            patient.setPhone(user.getPhone());
            patient.setRole(Role.PATIENT);
            patient.setNom(user.getUsername()); // Par défaut
            patient.setTelephone(user.getPhone()); // Par défaut
            patientRepository.save(patient);
            return patient;
            
        } else {
            // ADMIN ou utilisateur normal
            user.setRole(newRole);
            return userRepository.save(user);
        }
    }
}