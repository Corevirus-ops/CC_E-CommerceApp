import {Route, Routes} from 'react-router-dom';
import LoginMain from './components/login/LoginMain';
import RegisterMain from './components/register/RegisterMain';

function App() {
  return (
    <div className="App">
<Routes>
<Route path="/" element={<h1>Home</h1>} />
<Route path="/login" element={<LoginMain />} />
<Route path="/register" element={<RegisterMain />} />
</Routes>
    </div>
  );
}

export default App;
