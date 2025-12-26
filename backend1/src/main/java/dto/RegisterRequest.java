package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import modeles.Role;

@Data
public class RegisterRequest {
    
    @NotBlank(message = "Email est obligatoire")
    @Email(message = "Email invalide")
    private String email;
    
    public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getNom() {
		return nom;
	}

	public void setNom(String nom) {
		this.nom = nom;
	}

	public String getSpecialite() {
		return specialite;
	}

	public void setSpecialite(String specialite) {
		this.specialite = specialite;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	@NotBlank(message = "Mot de passe est obligatoire")
    @Size(min = 6, message = "Mot de passe doit avoir au moins 6 caractères")
    private String password;
    
    @NotBlank(message = "Username est obligatoire")
    private String username;
    
    private String phone;
    private Role role;
    
    // Champs spécifiques pour Medecin
    private String nom;
    private String specialite;
    
    // Champs spécifiques pour Patient
    private String telephone; // Si différent du phone général
}