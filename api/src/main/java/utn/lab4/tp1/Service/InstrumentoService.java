package utn.lab4.tp1.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utn.lab4.tp1.Entity.Instrumento;
import utn.lab4.tp1.Repository.InstrumentoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class InstrumentoService {
    @Autowired
    InstrumentoRepository instrumentoRepository;

    public List<Instrumento> getInstrumentos() {
        return instrumentoRepository.findAll();
    }

    public Optional<Instrumento> getInstrumento(Long id) {
        return instrumentoRepository.findById(id);
    }

    public void deleteInstrumento(Long id) {
        instrumentoRepository.deleteById(id);
    }

    public void saveOrUpdateInstrumento(Instrumento instrumento) {
        instrumentoRepository.save(instrumento);
    }

    public void updateInstrumento(Instrumento instrumento) {
        instrumentoRepository.save(instrumento);
    }
}
