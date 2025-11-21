package be.lannie.pos_solution_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.lannie.pos_solution_backend.model.Cart;
import be.lannie.pos_solution_backend.repository.CartRespository;

@RestController
@RequestMapping("/api")
public class CartController {
    private final CartRespository repository;

    public CartController(CartRespository repository) {
        this.repository = repository;
    }

    @GetMapping("/carts")
    public List<Cart> getAllCarts() {
        return repository.findAll();
    }

    @GetMapping("/carts")
    public Cart getCart(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping("/carts")
    public Cart createCart(@RequestBody Cart cart) {
        return repository.save(cart);
    }
}
