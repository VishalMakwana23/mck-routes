import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-app-bg">
      <nav className="relative z-10 flex w-full items-center justify-between border-b border-stroke-soft bg-[rgba(255,255,255,0.78)] px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3 shrink-0">
          <img src="/ziing-logo.png" alt="ziing.ai" className="h-9 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-stroke-soft bg-white px-4 py-2.5 text-sm font-semibold text-ink-base shadow-soft transition hover:-translate-y-0.5 hover:border-danger hover:text-danger focus:outline-none focus:ring-4 focus:ring-brand-ring cursor-pointer"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <div className="min-h-0 flex-1 overflow-hidden">
        <iframe
          src="/mckesson.html"
          title="McKesson Optimizer Dashboard"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
};

export default Dashboard;
