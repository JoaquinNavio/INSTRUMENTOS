package utn.lab4.tp1.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utn.lab4.tp1.Entity.User;
import utn.lab4.tp1.Repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> authenticate(String nombre, String contraseña) {
        return userRepository.findByNombreAndContraseña(nombre, contraseña);
    }
}
