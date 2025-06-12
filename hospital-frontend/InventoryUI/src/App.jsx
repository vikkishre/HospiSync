import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Consume from './pages/Consume';
import Restock from './pages/ReStock';
import Logs from './pages/Logs';
import Equipments from './pages/Equipments'

function App() {
  return (
    <Router>
      <Routes>
        {/* Parent route with layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="medicines" element={<Medicines />} />
          <Route path="equipment" element={<Equipments/>}/>
          <Route path="consume" element={<Consume />} />
          <Route path="restock" element={<Restock />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
