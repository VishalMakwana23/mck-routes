import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Montserrat',sans-serif]">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-[#0B3B32]">Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center -mt-20">
        <div className="bg-white p-10 rounded-xl shadow-md border border-gray-100 text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-[#FCEFE5] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold text-[#0B3B32]">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
          <p className="text-gray-500 mb-6">You have successfully logged in.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg inline-block w-full">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
            <p className="font-medium text-gray-800 truncate">{user?.email}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
