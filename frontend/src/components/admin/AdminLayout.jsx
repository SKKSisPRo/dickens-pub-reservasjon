import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { playNotificationDing } from '../../lib/notificationSound';
import NotificationBell from './NotificationBell';

const TITLE_BASE = 'Dickens Pub Admin';
const MUTE_STORAGE_KEY = 'dickens-admin-notifications-muted';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [jumpTarget, setJumpTarget] = useState(null);
  const newestRef = useRef(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const handleToggleMute = () => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(MUTE_STORAGE_KEY, String(next));
      } catch {
        // ignore storage failures (private mode, etc.)
      }
      return next;
    });
  };

  const handleBellClick = () => {
    setUnreadCount(0);
    if (newestRef.current) {
      setJumpTarget({ ...newestRef.current, key: Date.now() });
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('admin:new-reservations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, (payload) => {
        newestRef.current = payload.new;
        setUnreadCount((c) => c + 1);
        if (!mutedRef.current) playNotificationDing();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) ${TITLE_BASE}` : TITLE_BASE;
  }, [unreadCount]);

  return (
    <div className="flex flex-col h-dvh bg-[#F9FAFB] font-sans">
      {/* Header */}
      <header className="bg-dickens-green text-white grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 shadow-md border-b-4 border-dickens-gold flex-shrink-0">
        <div />

        <Link to="/" className="justify-self-center">
          <img src="/dickens-logo.png" alt="Dickens Pub" className="h-[76px] w-auto object-contain drop-shadow-md" />
        </Link>

        <div className="justify-self-end flex items-center gap-4">
          <NotificationBell
            unreadCount={unreadCount}
            muted={muted}
            onToggleMute={handleToggleMute}
            onClick={handleBellClick}
          />

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-full text-base font-gothic font-bold text-[#2A1D14] bg-dickens-cream shadow-md hover:shadow-lg hover:brightness-95 transition-[box-shadow,filter,transform] active:scale-95"
          >
            Logg ut
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-8">
        <Outlet context={{ jumpTarget }} />
      </main>
    </div>
  );
}
