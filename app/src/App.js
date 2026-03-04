import {Route, Routes} from 'react-router-dom';
import LoginMain from './components/login/LoginMain';
import RegisterMain from './components/register/RegisterMain';
import  Context  from './components/utils/UserContext';
import Home from './components/Home';
import NavMain from './components/nav/NavMain';

function App() {
  return (
    <div className="App">
  <Context>
    <NavMain />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<LoginMain />} />
<Route path="/register" element={<RegisterMain />} />
</Routes>
  </Context>
    </div>
  );
}

export default App;
