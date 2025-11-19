package be.lannie.bestelling.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String naam;
    private double prijs;
    private String categorie;

    public Product() {}

    public Product(String naam, double prijs, String categorie) {
        this.naam = naam;
        this.prijs = prijs;
        this.categorie = categorie;
    }

    public Long getId() { return id; }
    public String getNaam() { return naam; }
    public double getPrijs() { return prijs; }
    public String getCategorie() { return categorie; }

    public void setNaam(String naam) { this.naam = naam; }
    public void setPrijs(double prijs) { this.prijs = prijs; }
    public void setCategorie(String categorie) { this.categorie = categorie; }
}