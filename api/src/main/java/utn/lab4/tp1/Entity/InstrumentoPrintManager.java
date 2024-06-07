package utn.lab4.tp1.Entity;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.draw.SolidLine;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.property.HorizontalAlignment;
import com.itextpdf.layout.property.UnitValue;
import com.itextpdf.barcodes.Barcode128;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.lab4.tp1.Service.InstrumentoService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@Component
public class InstrumentoPrintManager {

    // Inyección del servicio de instrumentos
    private final InstrumentoService instrumentoService;

    // Constructor que inyecta el servicio de instrumentos
    @Autowired
    public InstrumentoPrintManager(InstrumentoService instrumentoService) {
        this.instrumentoService = instrumentoService;
    }

    // Método principal para generar el PDF de un instrumento
    public void generateInstrumentoPDF(Long instrumentoId, ByteArrayOutputStream outputStream) throws IOException {
        // Crea un escritor para el PDF y un documento PDF
        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdf = new PdfDocument(writer)) {
            // Crear un nuevo documento con tamaño de página A4
            Document document = new Document(pdf, PageSize.A4);

            // Añadir el encabezado al documento
            addHeader(document);

            // Obtener el instrumento por su ID
            Optional<Instrumento> optionalInstrumento = instrumentoService.getInstrumento(instrumentoId);
            if (optionalInstrumento.isPresent()) {
                Instrumento instrumento = optionalInstrumento.get();
                // Añadir la información del instrumento al documento
                addInstrumentoInfo(document, instrumento);

                // Añadir el código de barras al final del documento
                addBarcode(document, instrumentoId.toString());
            } else {
                // Mostrar un mensaje si el instrumento no se encuentra
                document.add(new Paragraph("Instrumento no encontrado"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Método para añadir el encabezado al documento
    private void addHeader(Document document) {
        try {
            // Cargar las imágenes desde URLs
            Image imgCabeceraLeft = new Image(ImageDataFactory.create("https://t4.ftcdn.net/jpg/01/06/47/61/360_F_106476142_zMZkkTkhMeq0DIjV20oJI00e3QXLYIGN.jpg"));
            Image imgCabeceraRight = new Image(ImageDataFactory.create("https://upload.wikimedia.org/wikipedia/commons/6/67/UTN_logo.jpg"));

            // Escalar las imágenes
            imgCabeceraLeft.scaleAbsolute(90f, 90f);
            imgCabeceraRight.scaleAbsolute(90f, 90f);

            // Alinear las imágenes y agregarlas al documento en posiciones fijas
            imgCabeceraLeft.setFixedPosition(50, 750);
            document.add(imgCabeceraLeft);

            imgCabeceraRight.setFixedPosition(500, 750);
            document.add(imgCabeceraRight);

            // Añadir espacio después de las imágenes
            addEmptyLine(document, 4);  // Ajustar la cantidad de líneas en blanco según sea necesario

            // Añadir una línea divisoria
            setLineaReporte(document);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Método para añadir la información del instrumento al documento
    private void addInstrumentoInfo(Document document, Instrumento instrumento) {
        // Crear la tabla con tres columnas (50%, 25%, 25%)
        float[] columnWidths = {50, 25, 25};
        Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();

        try {
            // Cargar la imagen del instrumento desde la URL
            Image imgInstrumento = new Image(ImageDataFactory.create(instrumento.getImagen()));

            // Ajustar la imagen para que ocupe seis filas
            imgInstrumento.setAutoScale(true);

            // Crear una celda para la imagen que ocupa seis filas y añadirla a la tabla
            Cell imgCell = new Cell(6, 1).add(imgInstrumento).setBorder(Border.NO_BORDER);
            table.addCell(imgCell);

            // Añadir filas con la información del instrumento
            addInfoRowToTable(table, "Instrumento:", instrumento.getInstrumento());
            addInfoRowToTable(table, "Marca:", instrumento.getMarca());
            addInfoRowToTable(table, "Modelo:", instrumento.getModelo());
            addInfoRowToTable(table, "Costo de envío:", instrumento.getCosto_envio());
            addInfoRowToTable(table, "Precio:", String.valueOf(instrumento.getPrecio()));

        } catch (Exception e) {
            e.printStackTrace();
        }

        // Añadir la tabla al documento
        document.add(table);

        // Añadir la descripción en una fila que ocupa toda la tabla
        try {
            Table descriptionTable = new Table(1).useAllAvailableWidth();
            Cell descriptionCell = new Cell().add(new Paragraph("Descripción: " + instrumento.getDescripcion())).setBorder(Border.NO_BORDER);
            descriptionTable.addCell(descriptionCell);
            document.add(descriptionTable);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Método para añadir una fila de información a la tabla
    private void addInfoRowToTable(Table table, String attribute, String value) {
        Cell attributeCell = new Cell().add(new Paragraph(attribute)).setBorder(Border.NO_BORDER);
        Cell valueCell = new Cell().add(new Paragraph(value)).setBorder(Border.NO_BORDER);

        table.addCell(attributeCell);
        table.addCell(valueCell);
    }

    // Método para añadir líneas en blanco al documento
    private void addEmptyLine(Document document, int lines) {
        for (int i = 0; i < lines; i++) {
            document.add(new Paragraph("\n"));
        }
    }

    // Método para añadir una línea divisoria al documento
    private void setLineaReporte(Document document) {
        document.add(new LineSeparator(new SolidLine()));
        addEmptyLine(document, 2);
    }

    // Método para añadir un código de barras al documento
    private void addBarcode(Document document, String text) {
        // Crear un código de barras de tipo 128
        Barcode128 barcode = new Barcode128(document.getPdfDocument());
        barcode.setCode(text);

        // Convertir el código de barras a una imagen
        Image barcodeImage = new Image(barcode.createFormXObject(document.getPdfDocument()));

        // Escalar la imagen del código de barras
        barcodeImage.scaleAbsolute(200, 100); // Ajusta el tamaño según tus necesidades

        // Añadir espacios en blanco para empujar el código de barras hacia abajo
        addEmptyLine(document, 10); // Ajusta la cantidad de líneas en blanco según sea necesario

        // Añadir la imagen del código de barras al documento
        barcodeImage.setHorizontalAlignment(HorizontalAlignment.CENTER);
        document.add(barcodeImage);
    }
}
