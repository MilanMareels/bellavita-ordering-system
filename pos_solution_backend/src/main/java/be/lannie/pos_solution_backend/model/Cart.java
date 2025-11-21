package be.lannie.pos_solution_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Product product;

    public Cart() {}

    public Cart(Product product) {
        this.product = product;
    }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }
}
