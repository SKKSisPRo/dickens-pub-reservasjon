import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] font-sans">
      {/* Header */}
      <header className="bg-dickens-green text-white flex items-center justify-between px-6 py-4 shadow-md border-b-4 border-dickens-gold flex-shrink-0">
        <Link to="/">
          <img src="/Dickens_logo (1).png" alt="Dickens Pub" className="h-12 w-auto object-contain drop-shadow-md" />
        </Link>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          Logg ut
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
