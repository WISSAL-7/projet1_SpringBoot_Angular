package services;

import modeles.*;
import repository.*;
import config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MedecinRepository medecinRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Transactional
    public Map<String, Object> register(User user, Map<String, Object> donneesSpecifiques) {
        try {
            // 1. Vérifier email unique
            if (userRepository.existsByEmail(user.getEmail())) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Email déjà utilisé");
                return error;
            }
            
            // 2. Déterminer le rôle (par défaut PATIENT si non spécifié)
            if (user.getRole() == null) {
                user.setRole(Role.PATIENT);
            }
            
            // 3. Encoder le mot de passe
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // 4. Sauvegarder selon le rôle
            if (user.getRole() == Role.MEDECIN) {
                return registerMedecin(user, donneesSpecifiques);
            } else if (user.getRole() == Role.PATIENT) {
                return registerPatient(user, donneesSpecifiques);
            } else {
                // ADMIN ou utilisateur normal
                return registerUserSimple(user);
            }
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Erreur lors de l'inscription: " + e.getMessage());
            return error;
        }
    }
    
    private Map<String, Object> registerMedecin(User user, Map<String, Object> donneesSpecifiques) {
        Medecin medecin = new Medecin();
        
        // Copier attributs User (déjà encodé)
        medecin.setEmail(user.getEmail());
        medecin.setPassword(user.getPassword());
        medecin.setUsername(user.getUsername());
        medecin.setPhone(user.getPhone());
        medecin.setRole(Role.MEDECIN);
        
        // Attributs spécifiques Medecin
        medecin.setNom((String) donneesSpecifiques.get("nom"));
        medecin.setSpecialite((String) donneesSpecifiques.get("specialite"));
        
        Medecin saved = medecinRepository.save(medecin);
        
        // Générer token JWT
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());
        
        return creerReponseInscription(saved, token, "Médecin créé avec succès");
    }
    
    private Map<String, Object> registerPatient(User user, Map<String, Object> donneesSpecifiques) {
        Patient patient = new Patient();
        
        // Copier attributs User (déjà encodé)
        patient.setEmail(user.getEmail());
        patient.setPassword(user.getPassword());
        patient.setUsername(user.getUsername());
        patient.setPhone(user.getPhone());
        patient.setRole(Role.PATIENT);
        
        // Attributs spécifiques Patient
        patient.setNom((String) donneesSpecifiques.get("nom"));
        patient.setTelephone((String) donneesSpecifiques.get("telephone"));
        
        Patient saved = patientRepository.save(patient);
        
        // Générer token JWT
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());
        
        return creerReponseInscription(saved, token, "Patient créé avec succès");
    }
    
    private Map<String, Object> registerUserSimple(User user) {
        User saved = userRepository.save(user);
        
        // Générer token JWT
        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());
        
        return creerReponseInscription(saved, token, "Utilisateur créé avec succès");
    }
    
    public Map<String, Object> login(String email, String password) {
        try {
            // 1. Authentifier
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // 2. Récupérer l'utilisateur
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            // 3. Générer token JWT
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            // 4. Retourner réponse
            return creerReponseLogin(user, token);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Email ou mot de passe incorrect");
            return error;
        }
    }
    
    private Map<String, Object> creerReponseInscription(User user, String token, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        response.put("token", token);
        response.put("type", "Bearer");
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        
        // Info spécifiques
        if (user instanceof Medecin) {
            Medecin medecin = (Medecin) user;
            response.put("nom", medecin.getNom());
            response.put("specialite", medecin.getSpecialite());
        } else if (user instanceof Patient) {
            Patient patient = (Patient) user;
            response.put("nom", patient.getNom());
            response.put("telephone", patient.getTelephone());
        }
        
        return response;
    }
    
    private Map<String, Object> creerReponseLogin(User user, String token) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("token", token);
        response.put("type", "Bearer");
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("phone", user.getPhone());
        
        // Info spécifiques
        if (user instanceof Medecin) {
            Medecin medecin = (Medecin) user;
            response.put("nom", medecin.getNom());
            response.put("specialite", medecin.getSpecialite());
        } else if (user instanceof Patient) {
            Patient patient = (Patient) user;
            response.put("nom", patient.getNom());
            response.put("telephone", patient.getTelephone());
        }
        
        return response;
    }
    
    // Méthode pour récupérer l'utilisateur connecté
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        }
        return null;
    }
}