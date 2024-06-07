import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './Charts.css';

const Charts = () => {
  const [pedidos, setPedidos] = useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/pedido/');
        setPedidos(response.data);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      }
    };

    const fetchInstrumentos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/instrumentos/');
        setInstrumentos(response.data);
      } catch (error) {
        console.error('Error fetching instrumentos:', error);
      }
    };

    const fetchCategorias = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categorias/');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchPedidos();
    fetchInstrumentos();
    fetchCategorias();
  }, []);

  // Genera el gráfico de instrumentos más pedidos
  const generarGraficoInstrumentosMasPedidos = () => {
    const data = [['Instrumento', 'Cantidad']];
    pedidos.forEach((pedido) => {
      pedido.detalles.forEach((detalle) => {
        const instrumento = instrumentos.find((i) => i.id === detalle.instrumento.id);
        if (instrumento) {
          const index = data.findIndex((row) => row[0] === instrumento.instrumento);
          if (index !== -1) {
            data[index][1] += detalle.cantidad;
          } else {
            data.push([instrumento.instrumento, detalle.cantidad]);
          }
        }
      });
    });
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

  // Genera el gráfico de instrumentos más comprados por categoría
  const generarGraficoInstrumentosPorCategoria = () => {
    const data = [['Categoría', 'Cantidad']];
    pedidos.forEach((pedido) => {
      pedido.detalles.forEach((detalle) => {
        const instrumento = instrumentos.find((i) => i.id === detalle.instrumento.id);
        if (instrumento) {
          const categoria = categorias.find((c) => c.id === instrumento.categoria?.id);
          if (categoria) {
            const index = data.findIndex((row) => row[0] === categoria.denominacion);
            if (index !== -1) {
              data[index][1] += detalle.cantidad;
            } else {
              data.push([categoria.denominacion, detalle.cantidad]);
            }
          }
        }
      });
    });
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

  // Genera el gráfico de pedidos por fecha
  const generarGraficoPedidosPorFecha = () => {
    const pedidosPorFecha = {};
    pedidos.forEach((pedido) => {
      const fechaPedido = new Date(pedido.fechaPedido);
      const key = `${fechaPedido.getFullYear()}-${fechaPedido.getMonth() + 1}`;
      pedidosPorFecha[key] = (pedidosPorFecha[key] || 0) + 1;
    });
    const data = Object.entries(pedidosPorFecha).map(([fecha, cantidad]) => [fecha, cantidad]);
    data.sort((a, b) => new Date(a[0]) - new Date(b[0]));
    return (
      <div className="chart">
        <div className="chart-title">Pedidos por Fecha</div>
        <div className="chart-content">
          <Chart
            width={'800px'}
            height={'400px'}
            chartType="ColumnChart"
            loader={<div>Loading Chart</div>}
            data={[['Fecha', 'Cantidad'], ...data]}
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

  // Genera el gráfico de ventas por tiempo
  const generarGraficoVentasPorTiempo = () => {
    console.log(pedidos)
    const ventasPorFecha = {};
    pedidos.forEach((pedido) => {
      const fechaPedido = new Date(pedido.fechaPedido);
      const key = `${fechaPedido.getFullYear()}-${fechaPedido.getMonth() + 1}`;
      ventasPorFecha[key] = (ventasPorFecha[key] || 0) + pedido.totalPedido;
    });
    const data = Object.entries(ventasPorFecha).map(([fecha, total]) => [fecha, total]);
    data.sort((a, b) => new Date(a[0]) - new Date(b[0]));
    return (
      <div className="chart">
        <div className="chart-title">Evolución de las Ventas $</div>
        <div className="chart-content">
          <Chart
            width={'800px'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={[['Fecha', 'Ventas'], ...data]}
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
