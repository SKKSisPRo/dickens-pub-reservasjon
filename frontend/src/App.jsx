import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicBooking from './components/PublicBooking';
import AdminLayout from './components/admin/AdminLayout';
import ReservationsView from './components/admin/ReservationsView';
import TableMap from './components/admin/TableMap';
import Login from './components/admin/Login';
import RequireAuth from './components/admin/RequireAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicBooking />} />
        <Route path="/admin/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ReservationsView />} />
            <Route path="map" element={<TableMap />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
