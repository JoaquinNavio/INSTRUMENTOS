package utn.lab4.tp1.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import utn.lab4.tp1.Entity.User;
import utn.lab4.tp1.Service.UserService;

import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/auth/login")
    public User login(@RequestBody User user) {
        Optional<User> optionalUser = userService.authenticate(user.getNombre(), user.getContraseña());
        return optionalUser.orElse(null);
    }
}
