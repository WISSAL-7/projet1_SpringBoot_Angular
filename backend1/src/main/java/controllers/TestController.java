package controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/public")
    public String publicTest() {
        return "Public endpoint works!";
    }
    
    @GetMapping("/secure")
    public String secureTest() {
        return "Secure endpoint works!";
    }
}

