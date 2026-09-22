import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex flex-col h-dvh bg-[#F9FAFB] font-sans">
      {/* Header */}
      <header className="relative bg-dickens-green text-white flex items-center justify-end px-6 py-4 shadow-md border-b-4 border-dickens-gold flex-shrink-0">
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src="/dickens-logo.png" alt="Dickens Pub" className="h-[68px] w-auto object-contain drop-shadow-md" />
        </Link>

        <button
          onClick={handleLogout}
          className="px-6 py-2.5 rounded-full text-base font-gothic font-bold text-[#2A1D14] bg-dickens-cream shadow-md hover:shadow-lg hover:brightness-95 transition-[box-shadow,filter,transform] active:scale-95"
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
