import { Routes, Route } from 'react-router-dom';
import App from './App';
import UserProfile from './UserProfile';
import Register from './Register';
import Login from './Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="UserProfile" element={<UserProfile />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}