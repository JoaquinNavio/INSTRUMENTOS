package utn.lab4.tp1.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import utn.lab4.tp1.Entity.Categoria;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria,Long> {

}

