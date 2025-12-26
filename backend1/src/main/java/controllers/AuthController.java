package controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import dto.RegisterRequest;
import config.JwtUtil;
import dto.JwtRequest;
import dto.JwtResponse;
import modeles.User;
import services.UserService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")

public class AuthController {

	 @Autowired
	    private AuthenticationManager authenticationManager;
	    
	    @Autowired
	    private JwtUtil jwtUtil;
	    
	    @Autowired
	    private UserService userService;
	    
	    @PostMapping("/login")
	    public ResponseEntity<?> login(@Valid @RequestBody JwtRequest request) {
	        try {
	            // Authentifier l'utilisateur
	            Authentication authentication = authenticationManager.authenticate(
	                new UsernamePasswordAuthenticationToken(
	                    request.getEmail(),
	                    request.getPassword()
	                )
	            );
	        
	         // Générer le token JWT
	            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
	            String token = jwtUtil.generateToken(userDetails);
	            
	            // Récupérer l'utilisateur complet
	            User user = userService.findByEmail(request.getEmail());
	            // Déterminer le nom complet
	            String nomComplet = user.getUsername(); // Par défaut
	            if (user instanceof modeles.Medecin) {
	                nomComplet = ((modeles.Medecin) user).getNom();
	            } else if (user instanceof modeles.Patient) {
	                nomComplet = ((modeles.Patient) user).getNom();
	            }
	            
	            return ResponseEntity.ok(new JwtResponse(
	                token,
	                user.getId(),
	                user.getEmail(),
	                user.getRole().toString(),
	                nomComplet
	            ));
	        } catch (Exception e) {
	            Map<String, String> error = new HashMap<>();
	            error.put("error", "Email ou mot de passe incorrect");
	            return ResponseEntity.status(401).body(error);
	        }
	    }
	    @PostMapping("/register")
	    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
	        try {
	            // Vérifier si l'email existe déjà
	            if (userService.existsByEmail(request.getEmail())) {
	                Map<String, String> error = new HashMap<>();
	                error.put("error", "Email déjà utilisé");
	                return ResponseEntity.badRequest().body(error);
	            }
	         // Créer l'objet User à partir de la requête
	            User user = new User();
	            user.setEmail(request.getEmail());
	            user.setPassword(request.getPassword()); // Sera encodé dans le service
	            user.setUsername(request.getUsername());
	            user.setPhone(request.getPhone());
	            user.setRole(request.getRole() != null ? request.getRole() : modeles.Role.PATIENT);
	            
	            // Sauvegarder l'utilisateur
	            User savedUser = userService.registerUser(user);
	            // Pour Medecin/Patient, mettre à jour les attributs spécifiques si fournis
	            if (savedUser instanceof modeles.Medecin && request.getNom() != null) {
	                modeles.Medecin medecin = (modeles.Medecin) savedUser;
	                medecin.setNom(request.getNom());
	                if (request.getSpecialite() != null) {
	                    medecin.setSpecialite(request.getSpecialite());
	                }
	                savedUser = userService.updateMedecin(medecin.getId(), 
	                    Map.of("nom", request.getNom(), "specialite", request.getSpecialite()));
	            } else if (savedUser instanceof modeles.Patient && request.getNom() != null) {
	                modeles.Patient patient = (modeles.Patient) savedUser;
	                patient.setNom(request.getNom());
	                if (request.getTelephone() != null) {
	                    patient.setTelephone(request.getTelephone());
	                }
	                savedUser = userService.updatePatient(patient.getId(),
	                    Map.of("nom", request.getNom(), "telephone", request.getTelephone()));
	            }
	            
	            // Générer le token JWT
	            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole().toString());
	            
	            // Déterminer le nom complet
	            String nomComplet = savedUser.getUsername();
	            if (savedUser instanceof modeles.Medecin) {
	                nomComplet = ((modeles.Medecin) savedUser).getNom();
	            } else if (savedUser instanceof modeles.Patient) {
	                nomComplet = ((modeles.Patient) savedUser).getNom();
	            }
	            
	            return ResponseEntity.ok(new JwtResponse(
	                token,
	                savedUser.getId(),
	                savedUser.getEmail(),
	                savedUser.getRole().toString(),
	                nomComplet
	            ));
	            
	        } catch (Exception e) {
	            Map<String, String> error = new HashMap<>();
	            error.put("error", "Erreur lors de l'inscription: " + e.getMessage());
	            return ResponseEntity.badRequest().body(error);
	        }
	    }
	}
	        