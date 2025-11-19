package be.lannie.pos_solution_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import be.lannie.pos_solution_backend.model.AppUser;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, String> {
}
