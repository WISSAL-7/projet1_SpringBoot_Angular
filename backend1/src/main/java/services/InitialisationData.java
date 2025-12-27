package services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import modeles.User;
import modeles.Role;
import repository.UserRepository;
import services.UserService;

import java.util.Map;
import java.util.Optional;
@Component
public class InitialisationData implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Exécuté au démarrage de l'application
        initializeUsers();
    }

    private void initializeUsers() {
        System.out.println("--- Démarrage de l'initialisation des utilisateurs ---");
        
        // 1. Initialisation de l'ADMIN
        createUserIfNotFound("admin@medapp.com", "adminpass", "Admin", "Principal", Role.ADMIN);

        // 2. Initialisation d'un MÉDECIN
        createUserIfNotFound("dr.alice@medapp.com", "medecinpass", "Alice", Role.MEDECIN, "Cardiologie", "0612345678");

        // 3. Initialisation d'un PATIENT
        createUserIfNotFound("patient.bob@mail.com", "patientpass", "Bob", Role.PATIENT, null, "0798765432");

        System.out.println("--- Initialisation des données de base terminée ---");
    }
    
    
    private void createUserIfNotFound(String email, String rawPassword, String firstName, String lastName, Role role) {
        // Surcharge pour les utilisateurs simples (comme ADMIN)
        createUserIfNotFound(email, rawPassword, firstName, role, null, null);
    }

    /**
     * Crée et enregistre un utilisateur (incluant des champs spécifiques si Medecin/Patient).
     */
    private void createUserIfNotFound(String email, String rawPassword, String username, Role role, String specialty, String phone) {
        
        // 1. Vérification d'existence
        if (userService.existsByEmail(email)) {
            System.out.println("-> Utilisateur déjà existant: " + email);
            return;
        }
        
        // 2. Création de l'objet User de base (sera converti en Medecin/Patient dans le Service)
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(rawPassword); // Le PasswordEncoder est appelé dans userService.registerUser
        newUser.setUsername(username); // Utilisation de firstName comme username (ajustez si besoin)
        newUser.setRole(role);
        newUser.setPhone(phone); // Ajout du téléphone

        // 3. Ajout de champs spécifiques non gérés directement par votre 'registerUser' de base
        // Si vous voulez initialiser la spécialité directement, votre 'registerUser' devrait accepter le champ.
        // Sinon, vous devez soit modifier le service pour créer l'entité et définir les champs spécifiques APRES l'appel,
        // soit utiliser un DTO d'enregistrement étendu.

        // Solution simple : si ADMIN, on sauve l'objet User. Si MEDECIN/PATIENT, le service s'occupe de la conversion.
        try {
            userService.registerUser(newUser);
            System.out.println("-> Utilisateur créé: " + email + " (" + role + ")");
            
            // Si c'est un Médecin, vous devez mettre à jour la spécialité APRES l'enregistrement
            // car votre service utilise une valeur par défaut "Généraliste"
            if (role == Role.MEDECIN && specialty != null) {
                // Cette étape est nécessaire car 'registerUser' sauvegarde par défaut 'Généraliste'
                // Et vous ne passez pas de DTO complet ici.
                User savedUser = userService.getUserByEmail(email);
                if (savedUser instanceof modeles.Medecin) {
                    ((modeles.Medecin) savedUser).setSpecialite(specialty);
                    userService.updateMedecinAttributes((modeles.Medecin) savedUser, Map.of("specialite", specialty));
                }
            }

        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'utilisateur " + email + ": " + e.getMessage());
        }
    }
}