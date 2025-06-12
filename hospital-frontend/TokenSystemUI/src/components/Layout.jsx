import { Link, Outlet } from 'react-router-dom';LogoutButton
import  LogoutButton from './LogoutButton';
export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white p-4">
  <div className="container mx-auto flex justify-between items-center">
    <h1 className="text-xl font-bold">Hospital Token System</h1>
    <div className="flex items-center gap-6">
      <div className="space-x-4">
        <Link to="/staff" className="hover:underline">
          Token Generator
        </Link>
        <Link to="/doctor" className="hover:underline">
          Doctor Dashboard
        </Link>
        <Link to="/admin" className="hover:underline">
          Admin Dashboard
        </Link>
      </div>
      <LogoutButton />
    </div>
  </div>
</nav>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
