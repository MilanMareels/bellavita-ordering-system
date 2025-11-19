package be.lannie.pos_solution_backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import be.lannie.pos_solution_backend.model.Product;
import be.lannie.pos_solution_backend.repository.ProductRepository;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/auth/me")
    public Map<String, String> getCurrentUser(Authentication auth) {
        // Geeft rol terug aan frontend zodat React weet of je Admin bent
        String role = auth.getAuthorities().iterator().next().getAuthority(); // Bv: "ROLE_ADMIN"
        return Map.of("username", auth.getName(), "role", role);
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product) {
        return repository.save(product);
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = repository.findById(id).orElseThrow();
        product.setNaam(productDetails.getNaam());
        product.setPrijs(productDetails.getPrijs());
        product.setCategorie(productDetails.getCategorie());
        return repository.save(product);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        repository.deleteById(id);
    }
}