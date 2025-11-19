package be.lannie.bestelling;

import be.lannie.bestelling.model.AppUser;
import be.lannie.bestelling.model.Product;
import be.lannie.bestelling.repository.AppUserRepository;
import be.lannie.bestelling.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepo;
    private final AppUserRepository userRepo;
    private final PasswordEncoder encoder;

    public DatabaseSeeder(ProductRepository productRepo, AppUserRepository userRepo, PasswordEncoder encoder) {
        this.productRepo = productRepo;
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepo.count() == 0) {
            System.out.println("Geen users gevonden. Demo accounts aanmaken...");
            
            // Admin met rol 'ADMIN'
            userRepo.save(new AppUser("admin", encoder.encode("1234"), "ADMIN"));
            
            // User met rol 'USER'
            userRepo.save(new AppUser("user", encoder.encode("1234"), "USER"));
            
            System.out.println("USERS AANGEMAAKT: admin/1234 en user/1234");
        }

        if (productRepo.count() == 0) {
            productRepo.save(new Product("Pizza Margherita", 12.50, "Eten"));
            productRepo.save(new Product("Pizza Salami", 14.00, "Eten"));
            productRepo.save(new Product("Cola", 3.00, "Drinken"));
            productRepo.save(new Product("Fanta", 3.00, "Drinken"));
            productRepo.save(new Product("Tiramisu", 6.00, "Dessert"));

            System.out.println("PRODUCTEN AANGEMAAKT");
        }
    }
}