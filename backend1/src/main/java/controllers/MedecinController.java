package controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import repository.MedecinRepository;
import modeles.Medecin;
@RestController
@RequestMapping("/api/medcins")
@CrossOrigin("*")
public class MedecinController {
	  @Autowired
	    private MedecinRepository repo;

	    @GetMapping
	    public List<Medecin> getAll() {
	        return repo.findAll();
	    }

	    @PostMapping
	    public Medecin save(@RequestBody Medecin m) {
	        return repo.save(m);
	    }

}
