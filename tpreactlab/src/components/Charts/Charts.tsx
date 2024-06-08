import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './Charts.css';

const Charts = () => {
  const [instrumentosMasPedidos, setInstrumentosMasPedidos] = useState([]);
  const [instrumentosPorCategoria, setInstrumentosPorCategoria] = useState([]);
  const [pedidosPorFecha, setPedidosPorFecha] = useState([]);
  const [ventasPorTiempo, setVentasPorTiempo] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchInstrumentosMasPedidos = async () => {
      const response = await axios.get('http://localhost:8080/pedido/instrumentos-mas-pedidos');
      setInstrumentosMasPedidos(response.data);
    };

    const fetchInstrumentosPorCategoria = async () => {
      const response = await axios.get('http://localhost:8080/pedido/instrumentos-por-categoria');
      setInstrumentosPorCategoria(response.data);
    };

    const fetchPedidosPorFecha = async () => {
      const response = await axios.get('http://localhost:8080/pedido/pedidos-por-fecha');
      setPedidosPorFecha(response.data);
    };

    const fetchVentasPorTiempo = async () => {
      const response = await axios.get('http://localhost:8080/pedido/ventas-por-tiempo');
      setVentasPorTiempo(response.data);
    };

    fetchInstrumentosMasPedidos();
    fetchInstrumentosPorCategoria();
    fetchPedidosPorFecha();
    fetchVentasPorTiempo();
  }, []);

  const generarGraficoInstrumentosMasPedidos = () => {
    const data = [['Instrumento', 'Cantidad'], ...instrumentosMasPedidos.map(item => [item.Instrumento, item.Cantidad])];
    return (
      <div className="chart">
        <div className="chart-title">Instrumentos más pedidos</div>
        <div className="chart-content">
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{ title: 'Instrumentos más pedidos' }}
          />
        </div>
      </div>
    );
  };

  const generarGraficoInstrumentosPorCategoria = () => {
    const data = [['Categoría', 'Cantidad'], ...instrumentosPorCategoria.map(item => [item.Categoría, item.Cantidad])];
    return (
      <div className="chart">
        <div className="chart-title">Instrumentos más comprados por categoría</div>
        <div className="chart-content">
          <Chart
            width={'500px'}
            height={'300px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{ title: 'Instrumentos más comprados por categoría' }}
          />
        </div>
      </div>
    );
  };

  const generarGraficoPedidosPorFecha = () => {
    const data = [['Fecha', 'Cantidad'], ...pedidosPorFecha.map(item => [item.Fecha, item.Cantidad])];
    return (
      <div className="chart">
        <div className="chart-title">Pedidos por Fecha</div>
        <div className="chart-content">
          <Chart
            width={'800px'}
            height={'400px'}
            chartType="ColumnChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
              title: 'Pedidos por Fecha',
              legend: { position: 'none' },
              vAxis: { title: 'Cantidad' },
              hAxis: { title: 'Fecha' },
            }}
          />
        </div>
      </div>
    );
  };

  const generarGraficoVentasPorTiempo = () => {
    const data = [['Fecha', 'Ventas'], ...ventasPorTiempo.map(item => [item.Fecha, item.Ventas])];
    return (
      <div className="chart">
        <div className="chart-title">Evolución de las Ventas $</div>
        <div className="chart-content">
          <Chart
            width={'800px'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
              title: 'Evolución de las Ventas $',
              legend: { position: 'none' },
              vAxis: { title: 'Ventas $' },
              hAxis: { title: 'Fecha' },
            }}
          />
        </div>
      </div>
    );
  };

  // Función para generar y descargar el Excel
  const generarExcel = async () => {
    try {
      const response = await axios.get('http://localhost:8080/pedido/generarExcel', {
        responseType: 'blob',
        params: {
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        }
      });

      if (response.status === 204) {
        alert('No hay pedidos entre las fechas dadas.');
        return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'pedidos.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error('Error generando Excel:', error);
    }
  };

  const handleFechaInicioChange = (event) => {
    setFechaInicio(event.target.value);
  };

  const handleFechaFinChange = (event) => {
    setFechaFin(event.target.value);
  };

  return (
    <div className="charts-container">
      <div className="generar">
        <input type="date" value={fechaInicio} onChange={handleFechaInicioChange} />
        <input type="date" value={fechaFin} onChange={handleFechaFinChange} />
        <button onClick={generarExcel}>Generar Excel</button>
      </div>
      {generarGraficoInstrumentosMasPedidos()}
      {generarGraficoInstrumentosPorCategoria()}
      {generarGraficoPedidosPorFecha()}
      {generarGraficoVentasPorTiempo()}
    </div>
  );
};

export default Charts;
