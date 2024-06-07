import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; 
import axios from 'axios';
import { Chart } from 'react-google-charts';

const Home = () => {
  
  return (
    <div className="home-container">
      <h1 style={{ fontSize: '66px', color: 'blue', textAlign: 'center' }}>Musical Hendrix</h1>

      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://excursionesnuevayork.net/wp-content/uploads/2019/03/Tour-por-Nueva-York.png"
            alt="Instrumento 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://gestion.pe/resizer/onZRxv2tWnpq-JPhX9KTgaueAjI=/580x330/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/CYGBYAO7RVFB5IUSDB54WVH3FE.jpg"
            alt="Instrumento 2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://photo620x400.mnstatic.com/9b58cb8634741177f48a5fddfa900786/tienda-de-instrumentos-musicales-hong-tich.jpg"
            alt="Instrumento 3"
          />
        </Carousel.Item>
      </Carousel>

      <div className="descripcion-tienda">
        <p style={{ fontSize: '26px', textAlign: 'center' }}>
          Musical Hendrix es una tienda de instrumentos musicales con ya más de 15 años de
          experiencia. Tenemos el conocimiento y la capacidad como para informarte acerca de las
          mejores elecciones para tu compra musical.
        </p>
      </div>


    </div>
  );
};

export default Home;
