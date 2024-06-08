package utn.lab4.tp1.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import utn.lab4.tp1.Entity.Categoria;
import utn.lab4.tp1.Entity.Instrumento;
import utn.lab4.tp1.Entity.Pedido;
import utn.lab4.tp1.Entity.PedidoDetalle;
import utn.lab4.tp1.Repository.InstrumentoRepository;
import utn.lab4.tp1.Repository.PedidoDetalleRepository;
import utn.lab4.tp1.Repository.PedidoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PedidoService {
    @Autowired
    PedidoRepository pedidoRepository;
    @Autowired
    private PedidoDetalleService pedidoDetalleService;
    @Autowired
    private PedidoDetalleRepository pedidoDetalleRepository;
    @Autowired
    private InstrumentoRepository instrumentoRepository;


    public List<Map<String, Object>> getInstrumentosMasPedidos() {
        List<Pedido> pedidos = getPedidos();
        List<Instrumento> instrumentos = instrumentoRepository.findAll();

        Map<String, Integer> conteoInstrumentos = new HashMap<>();
        pedidos.forEach(pedido -> {
            pedido.getDetalles().forEach(detalle -> {
                Instrumento instrumento = detalle.getInstrumento();
                                        //nombre del instrumento(key)     si encuentra el instrumento trae el value, sino 0           y luego le sumo la cantidad
                conteoInstrumentos.put(instrumento.getInstrumento(), conteoInstrumentos.getOrDefault(instrumento.getInstrumento(), 0) + detalle.getCantidad());
            });
        });

        return conteoInstrumentos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("Instrumento", entry.getKey());
                    map.put("Cantidad", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getInstrumentosPorCategoria() {
        List<Pedido> pedidos = getPedidos();
        List<Instrumento> instrumentos = instrumentoRepository.findAll();

        Map<String, Integer> conteoCategorias = new HashMap<>();
        pedidos.forEach(pedido -> {
            pedido.getDetalles().forEach(detalle -> {
                Instrumento instrumento = detalle.getInstrumento();
                String categoria = instrumento.getCategoria().getDenominacion();
                conteoCategorias.put(categoria,
                        conteoCategorias.getOrDefault(categoria, 0) + detalle.getCantidad());
            });
        });

        return conteoCategorias.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("Categoría", entry.getKey());
                    map.put("Cantidad", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getPedidosPorFecha() {
        List<Pedido> pedidos = getPedidos();

        Map<String, Long> conteoPedidos = pedidos.stream()
                .collect(Collectors.groupingBy(pedido -> {
                    LocalDate fecha = pedido.getFechaPedido().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    return fecha.toString();
                }, Collectors.counting()));

        return conteoPedidos.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("Fecha", entry.getKey());
                    map.put("Cantidad", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getVentasPorTiempo() {
        List<Pedido> pedidos = getPedidos();

        Map<String, Double> ventasPorFecha = pedidos.stream()
                .collect(Collectors.groupingBy(pedido -> {
                    LocalDate fecha = pedido.getFechaPedido().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    return fecha.toString();
                }, Collectors.summingDouble(Pedido::getTotalPedido)));

        return ventasPorFecha.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("Fecha", entry.getKey());
                    map.put("Ventas", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }












    public List<Pedido> getPedidosByDateRange(Date fechaInicio, Date fechaFin) {
        // Convertir las fechas a LocalDateTime para ajustarlas a la precisión del almacenamiento de fecha en la base de datos
        LocalDateTime inicio = LocalDateTime.ofInstant(fechaInicio.toInstant(), ZoneId.systemDefault());
        LocalDateTime fin = LocalDateTime.ofInstant(fechaFin.toInstant(), ZoneId.systemDefault());

        // Ajustar la hora de inicio al comienzo del día y la hora de fin al final del día
        inicio = inicio.with(LocalTime.MIN);
        fin = fin.with(LocalTime.MAX);

        // Realizar la consulta utilizando las fechas ajustadas
        return pedidoRepository.findByFechaPedidoBetween(inicio, fin);
    }
    public List<Pedido> getPedidos(){
        List<Pedido> pedidos = pedidoRepository.findAll();
        return pedidos;
    }
    public Optional<Pedido> getPedido(Long id){
        return pedidoRepository.findById(id);

    }
    public void deletePedido(Long id){
        pedidoRepository.deleteById(id);
    }

    public void saveOrUpdatePedido(Pedido pedido){

        pedidoRepository.save(pedido);
    }
    public void UpdatePedido(Pedido pedido){

        pedidoRepository.save(pedido);
    }


    @Transactional
    public Pedido createWithDetails(Pedido dto) {
        // Crear Pedido
        Pedido pedido = new Pedido();
        pedido.setTotalPedido(dto.getTotalPedido());

        // Guardar Pedido
        Pedido savedPedido = pedidoRepository.save(pedido);

        // Crear detalles y asociarlos
        List<PedidoDetalle> detalles = dto.getDetalles().stream().map(detalleDto -> {
            PedidoDetalle detalle = new PedidoDetalle();
            detalle.setCantidad(detalleDto.getCantidad());

            // Obtener el instrumento
            Instrumento instrumento = instrumentoRepository.findById(detalleDto.getId())
                    .orElseThrow(() -> new RuntimeException("Instrumento no encontrado para el ID: " + detalleDto.getId()));

            detalle.setInstrumento(instrumento); // Asignar el instrumento
            detalle.setPedido(savedPedido);
            return detalle;
        }).collect(Collectors.toList());

        // Guardar detalles
        pedidoDetalleRepository.saveAll(detalles);

        return savedPedido;
    }
    /*
    @Transactional
    public Pedido createWithDetails(Pedido dto) {
        // Crear detalles
        Set<PedidoDetalle> detalles = dto.getDetalles().stream().map(detalleDto -> {
            PedidoDetalle detalle = new PedidoDetalle();
            detalle.setCantidad(detalleDto.getCantidad());

            // Obtener el instrumento
            Instrumento instrumento = instrumentoRepository.findById(detalleDto.getId())
                    .orElseThrow(() -> new RuntimeException("Instrumento no encontrado para el ID: " + detalleDto.getId()));

            detalle.setInstrumento(instrumento); // Asignar el instrumento
            return detalle;
        }).collect(Collectors.toSet());

        // Crear Pedido
        Pedido pedido = new Pedido();
        pedido.setTotalPedido(dto.getTotalPedido());
        pedido.setDetalles(detalles); // Aquí se pasa el Set<PedidoDetalle>

        // Guardar Pedido
        Pedido savedPedido = pedidoRepository.save(pedido);
        return savedPedido;
    }*/

}
