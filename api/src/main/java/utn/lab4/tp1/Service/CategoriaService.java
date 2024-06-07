package utn.lab4.tp1.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utn.lab4.tp1.Entity.Categoria;
import utn.lab4.tp1.Entity.Instrumento;
import utn.lab4.tp1.Repository.CategoriaRepository;
import utn.lab4.tp1.Repository.InstrumentoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    @Autowired
    utn.lab4.tp1.Repository.CategoriaRepository CategoriaRepository;

    public List<Categoria> getCategorias(){
        List<Categoria> categorias = CategoriaRepository.findAll();
        return categorias;
    }
    public Optional<Categoria> getCategoria(Long id){
        return CategoriaRepository.findById(id);

    }

}
