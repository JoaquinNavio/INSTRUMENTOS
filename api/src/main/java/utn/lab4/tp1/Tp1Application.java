package utn.lab4.tp1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class Tp1Application {

	public static void main(String[] args) {
		SpringApplication.run(Tp1Application.class, args);
		System.out.println("Funcionando");
	}
	@GetMapping("/")
	public String paginaInicio() {
		return "index";
	}
}
