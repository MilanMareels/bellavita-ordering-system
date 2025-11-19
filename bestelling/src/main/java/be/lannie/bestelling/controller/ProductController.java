package be.lannie.bestelling.controller;

import be.lannie.bestelling.model.Product;
import be.lannie.bestelling.repository.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    // --- AUTH CHECK ---
    @GetMapping("/auth/me")
    public Map<String, String> getCurrentUser(Authentication auth) {
        // Geeft rol terug aan frontend zodat React weet of je Admin bent
        String role = auth.getAuthorities().iterator().next().getAuthority(); // Bv: "ROLE_ADMIN"
        return Map.of("username", auth.getName(), "role", role);
    }

    // --- PRODUCTEN ---

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @GetMapping("/products/{id}")
    public Product getProduct(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    // ALLEEN ADMIN (Geregeld in SecurityConfig)
    @PostMapping("/products")
    public Product createProduct(@RequestBody Product product) {
        return repository.save(product);
    }

    // ALLEEN ADMIN
    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Product product = repository.findById(id).orElseThrow();
        product.setNaam(productDetails.getNaam());
        product.setPrijs(productDetails.getPrijs());
        product.setCategorie(productDetails.getCategorie());
        return repository.save(product);
    }

    // ALLEEN ADMIN
    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        repository.deleteById(id);
    }
}