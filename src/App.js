import React from 'react';
import FormScreen from './components/FormScreen';
import CarouselController from './components/CarouselController';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={1000} position='bottom-center'/>
      <FormScreen />
      <CarouselController />
    </div>
  );
}

export default App;
