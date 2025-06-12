import { Link, Outlet } from 'react-router-dom';
import { FaPills, FaPlusCircle, FaMinusCircle, FaHistory, FaHome,FaBox } from 'react-icons/fa';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-md z-10">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">PharmaStock</h1>
          <p className="text-xs text-gray-500">Inventory Management System</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaHome className="mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/medicines"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaPills className="mr-3" />
                <span>Medicine Inventory</span>
              </Link>
            </li>
            <li>
              <Link
                to="/equipment"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaBox className="mr-3" />
                <span>Equipment Inventory</span>
              </Link>
</li>
            <li>
              <Link
                to="/consume"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaMinusCircle className="mr-3" />
                <span>Consume Stock</span>
              </Link>
            </li>
            <li>
              <Link
                to="/restock"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaPlusCircle className="mr-3" />
                <span>Restock</span>
              </Link>
            </li>
            <li>
              <Link
                to="/logs"
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <FaHistory className="mr-3" />
                <span>Inventory Logs</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;