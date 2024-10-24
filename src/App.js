import React, {useEffect} from 'react';
import FormScreen from './components/FormScreen';
import CarouselController from './components/CarouselController';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addScreenOffReceiver, removeScreenOffReceiver } from './LouieSDK/utils/ScreenOffReceiver';

function App() {
  useEffect(() => {
    //wakeLockManager.requestWakeLock();
    addScreenOffReceiver();
    return () => {
      //wakeLockManager.releaseWakeLock();
       removeScreenOffReceiver();
    };
  }, []);
  return (
    <div className="App">
      <ToastContainer autoClose={1000} position='bottom-center'/>
      <FormScreen />
      <CarouselController />
    </div>
  );
}

export default App;
