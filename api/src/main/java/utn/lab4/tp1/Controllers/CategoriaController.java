package utn.lab4.tp1.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utn.lab4.tp1.Entity.Categoria;
import utn.lab4.tp1.Entity.Instrumento;
import utn.lab4.tp1.Service.CategoriaService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {
    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }
    @GetMapping("/")
    public List<Categoria> getAll(){
        return categoriaService.getCategorias();

    }
    @GetMapping("/{categoriaId}")
    public Optional<Categoria> getById(@PathVariable("categoriaId") Long categoriaId){
        return categoriaService.getCategoria(categoriaId); // Usa la instancia de categoriaService para llamar a getCategoria
    }
}
