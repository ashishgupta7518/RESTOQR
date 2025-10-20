import { Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import RestaurantDashboard from "./Restaurant/RestaurantDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import MenuPublic from "./page/MenuPublic";
import RestaurantQRUI from "./page/Home";


function App() {


  return (
    <Routes>
      <Route path="/" element={<RestaurantQRUI />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/restaurant/dashboard" element={
        <ProtectedRoute allowedRole="restaurant">
          <RestaurantDashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      <Route path="/menu/:id" element={<MenuPublic />} />
    </Routes>
  )
}


export default App
