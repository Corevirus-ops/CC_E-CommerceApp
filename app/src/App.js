import {Route, Routes} from 'react-router-dom';
import LoginMain from './components/login/LoginMain';
import RegisterMain from './components/register/RegisterMain';
import  Context  from './components/utils/UserContext';

function App() {
  return (
    <div className="App">
  <Context>
<Routes>
<Route path="/" element={<h1>Home</h1>} />
<Route path="/login" element={<LoginMain />} />
<Route path="/register" element={<RegisterMain />} />
</Routes>
  </Context>
    </div>
  );
}

export default App;
