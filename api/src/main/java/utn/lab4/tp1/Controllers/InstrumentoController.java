package utn.lab4.tp1.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utn.lab4.tp1.Entity.Categoria;
import utn.lab4.tp1.Entity.Instrumento;
import utn.lab4.tp1.Entity.InstrumentoPrintManager;
import utn.lab4.tp1.Service.CategoriaService;
import utn.lab4.tp1.Service.InstrumentoService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/instrumentos")
@CrossOrigin(origins = "*")
public class InstrumentoController {

    @Autowired
    private final InstrumentoService instrumentoService;
    private final InstrumentoPrintManager printManager;
    private final CategoriaService categoriaService;

    @Autowired
    public InstrumentoController(InstrumentoService instrumentoService, InstrumentoPrintManager printManager, CategoriaService categoriaService) {
        this.instrumentoService = instrumentoService;
        this.printManager = printManager;
        this.categoriaService = categoriaService;
    }

    @GetMapping("/")
    public List<Instrumento> getAll() {
        return instrumentoService.getInstrumentos();
    }

    @GetMapping("/{instrumentoId}")
    public Optional<Instrumento> getById(@PathVariable("instrumentoId") Long instrumentoId) {
        return instrumentoService.getInstrumento(instrumentoId);
    }

    @DeleteMapping("/{instrumentoId}")
    public void saveUpdate(@PathVariable("instrumentoId") Long instrumentoId) {
        instrumentoService.deleteInstrumento(instrumentoId);
    }

    @PostMapping("/")
    public void saveUpdate(@RequestBody Instrumento instrumento) {
        instrumentoService.saveOrUpdateInstrumento(instrumento);
    }

    @PutMapping("/{instrumentoId}")
    public void update(@PathVariable("instrumentoId") Long instrumentoId, @RequestBody Instrumento instrumento) {
        Instrumento instrumentoExistente = instrumentoService.getInstrumento(instrumentoId).orElseThrow(() -> new RuntimeException("Instrumento no encontrado"));
        instrumentoExistente.setCantidad_vendida(instrumento.getCantidad_vendida());
        instrumentoExistente.setCosto_envio(instrumento.getCosto_envio());
        instrumentoExistente.setDescripcion(instrumento.getDescripcion());
        instrumentoExistente.setImagen(instrumento.getImagen());
        instrumentoExistente.setInstrumento(instrumento.getInstrumento());
        instrumentoExistente.setMarca(instrumento.getMarca());
        instrumentoExistente.setModelo(instrumento.getModelo());
        instrumentoExistente.setPrecio(instrumento.getPrecio());

        // Asignar la categoría correctamente
        if (instrumento.getCategoria() != null && instrumento.getCategoria().getId() != null) {
            Categoria categoria = categoriaService.getCategoria(instrumento.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            instrumentoExistente.setCategoria(categoria);
        }

        instrumentoService.updateInstrumento(instrumentoExistente);
    }

    @GetMapping("/generatePDF/{instrumentoId}")
    public ResponseEntity<byte[]> generatePDF(@PathVariable("instrumentoId") Long instrumentoId) {
        try {
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            printManager.generateInstrumentoPDF(instrumentoId, outputStream);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/pdf"));
            headers.setContentDispositionFormData("attachment", "instrumento.pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
