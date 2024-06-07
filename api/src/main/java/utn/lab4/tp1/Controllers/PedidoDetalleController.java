package utn.lab4.tp1.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import utn.lab4.tp1.Entity.DTO.PedidoDetalleDTO;
import utn.lab4.tp1.Entity.Pedido;
import utn.lab4.tp1.Entity.PedidoDetalle;
import utn.lab4.tp1.Service.PedidoDetalleService;
import utn.lab4.tp1.Service.PedidoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "/pedidoDetalle")
@CrossOrigin(origins = "*")
public class PedidoDetalleController {

    @Autowired
    private final PedidoDetalleService pedidoDetalleService;

    public PedidoDetalleController(PedidoDetalleService pedidoDetalleService) {
        this.pedidoDetalleService = pedidoDetalleService;
    }

    @GetMapping("/")
    public List<PedidoDetalle> getAll(){
        return pedidoDetalleService.getPedidoDetalles();
    }

    @GetMapping("/{PedidoId}")
    public Optional<PedidoDetalle> getById(@PathVariable("PedidoId") Long pedidoDId){
        return pedidoDetalleService.getPedidoDetalle(pedidoDId);
    }

    @DeleteMapping ("/{PedidoId}")
    public void delete(@PathVariable("PedidoId") Long pedidoDId){
        pedidoDetalleService.deletePedidoDetalle(pedidoDId);
    }

    @PostMapping("/")
    public void saveUpdate(@RequestBody PedidoDetalleDTO pedidoDetalleDTO){
        pedidoDetalleService.saveOrUpdatePedidoDetalle(pedidoDetalleDTO);
    }
}