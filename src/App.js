 import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home.jsx'
import EditorPage  from './pages/EditorPage/EditorPage.jsx';
import { Toaster } from 'react-hot-toast';
   
function App() {
  return (
    <>
    <div>
      <Toaster position='top-right' 
      toastOptions={{
        success: {
          theme: {
            primary: '#4aed88',
           }
        } 
      }
       }>

      </Toaster>
    </div>
    <BrowserRouter>
     <Routes>
      <Route path = '/' element={<Home/>} />
      <Route path='/editor/:roomId' element={<EditorPage/>}/>
     </Routes>
    </BrowserRouter>
    </> 
   );
}

export default App;
