import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Montserrat',sans-serif]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
          <img src="/ziingLogo.png" alt="Ziing Logo" className="h-8 w-auto" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full bg-white relative overflow-hidden">
        <iframe
          src="/mckesson.html"
          title="McKesson Optimizer Dashboard"
          className="w-full h-full border-0 absolute inset-0"
        />
      </main>
    </div>
  );
};

export default Dashboard;
