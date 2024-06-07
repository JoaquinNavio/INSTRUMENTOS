package utn.lab4.tp1.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import utn.lab4.tp1.Entity.DTO.PedidoMP;
import utn.lab4.tp1.Entity.Pedido;
import utn.lab4.tp1.Entity.PedidoPrintManager;
import utn.lab4.tp1.Entity.PreferenceMP;
import utn.lab4.tp1.Service.PedidoService;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping(path = "/pedido")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/")
    public List<Pedido> getAll() {
        return pedidoService.getPedidos();
    }

    @GetMapping("/{PedidoId}")
    public Optional<Pedido> getById(@PathVariable("PedidoId") Long PedidoId) {
        return pedidoService.getPedido(PedidoId);
    }


    @DeleteMapping("/{PedidoId}")
    public void saveUpdate(@PathVariable("PedidoId") Long pedidoId) {
        pedidoService.deletePedido(pedidoId);
    }

    @PostMapping("/createWithDetails")
    public ResponseEntity<Pedido> createWithDetails(@RequestBody Pedido dto) {
        Pedido createdArticuloManufacturado = pedidoService.createWithDetails(dto);
        return new ResponseEntity<>(createdArticuloManufacturado, HttpStatus.CREATED);
    }

    @CrossOrigin(origins = "*")
    @PostMapping("api/create_preference_mp")
    public PreferenceMP crearPreferenciaMercadoPago(@RequestBody PedidoMP pedido) {
        MercadoPagoController cMercadoPago = new MercadoPagoController();
        PreferenceMP preference = cMercadoPago.getPreferenciaIdMercadoPago(pedido);
        return preference;
    }


    @GetMapping("/generarExcel")
    public ResponseEntity<Object> generarExcel(@RequestParam("fechaInicio") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaInicio,
                                               @RequestParam("fechaFin") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fechaFin) {
        try {
            // Obtiene la lista de pedidos en el rango de fechas especificado
            List<Pedido> pedidos = pedidoService.getPedidosByDateRange(fechaInicio, fechaFin);

            // Si no hay pedidos en el rango de fechas, devuelve un estado 204 No Content con un mensaje
            if (pedidos.isEmpty()) {
                return new ResponseEntity<>("No hay pedidos entre las fechas dadas.", HttpStatus.NO_CONTENT);
            }

            // Crea una instancia de PedidoPrintManager para manejar la generación del archivo Excel
            PedidoPrintManager mPrintPedido = new PedidoPrintManager(pedidoService);

            // Genera el archivo Excel con los pedidos
            SXSSFWorkbook libroExcel = mPrintPedido.imprimirExcelPedidos(pedidos);

            // Escribe el contenido del archivo Excel en un ByteArrayOutputStream
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            libroExcel.write(outputStream);

            // Configura los encabezados de la respuesta HTTP
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "pedidos.xlsx");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            // Devuelve el archivo Excel en el cuerpo de la respuesta con estado 200 OK
            return new ResponseEntity<>(outputStream.toByteArray(), headers, HttpStatus.OK);

        } catch (IOException e) {
            // Si ocurre una excepción al generar el archivo Excel, se imprime el stack trace y se devuelve un estado 500 Internal Server Error
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}
