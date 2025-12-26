package controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import repository.RendezVousRepository;
import modeles.RendezVous;
@RestController
@RequestMapping("/api/patients")
@CrossOrigin("*")
public class RendezVousController {
	@Autowired
    private RendezVousRepository repo;

    @GetMapping
    public List<RendezVous> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public RendezVous save(@RequestBody RendezVous rv) {
        return repo.save(rv);
    }

}
