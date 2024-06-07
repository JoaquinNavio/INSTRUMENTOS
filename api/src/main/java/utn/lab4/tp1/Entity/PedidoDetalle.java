package utn.lab4.tp1.Entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@CrossOrigin(origins = "*")
@Getter
@Setter
public class PedidoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int cantidad;

    @ManyToOne
    @JsonIgnore
    private Pedido pedido;

    @ManyToOne
    private Instrumento instrumento;
}
