import Orders from './views/Orders';
import AddOrder from './views/add-edit-order';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/my-orders" element={<Orders/>} />
        <Route path="/add-order" element={<AddOrder/>} />
      </Routes>
    </Router>
  );
}

export default App;
