import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { apiFetch } from '../../lib/api';
import { playNotificationDing } from '../../lib/notificationSound';
import NotificationBell from './NotificationBell';

const TITLE_BASE = 'Dickens Pub Admin';
const MUTE_KEY = 'dickens-admin-notifications-muted';
const LAST_SEEN_KEY = 'dickens-admin-last-seen';
const VIEWED_KEY = 'dickens-admin-viewed-ids';

function readLastSeen() {
  try {
    return localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    return null;
  }
}

function writeLastSeen(iso) {
  try {
    localStorage.setItem(LAST_SEEN_KEY, iso);
  } catch {
    // ignore storage failures (private mode, etc.)
  }
}

function readViewedIds() {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeViewedIds(set) {
  try {
    localStorage.setItem(VIEWED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore storage failures
  }
}

export default function AdminLayout() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [lastSeenAt, setLastSeenAt] = useState(() => readLastSeen());
  const [viewedIds, setViewedIds] = useState(() => readViewedIds());
  const [bellOpen, setBellOpen] = useState(false);
  const [jumpTarget, setJumpTarget] = useState(null);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/reservations');
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // First-ever run: anchor "now" so existing history isn't dumped in as unread.
    if (!lastSeenAt) {
      const now = new Date().toISOString();
      writeLastSeen(now);
      setLastSeenAt(now);
    }

    fetchReservations();

    const channel = supabase
      .channel('admin:reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, (payload) => {
        fetchReservations();
        if (payload.eventType === 'INSERT' && !mutedRef.current) {
          playNotificationDing();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reservations created after the last-seen anchor — the "unread" catch-up list.
  const unreadItems = useMemo(() => {
    if (!lastSeenAt) return [];
    const cutoff = new Date(lastSeenAt).getTime();
    return reservations
      .filter((r) => r.created_at && new Date(r.created_at).getTime() > cutoff)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((r) => ({ ...r, viewed: viewedIds.has(r.id) }));
  }, [reservations, lastSeenAt, viewedIds]);

  const unreadCount = unreadItems.filter((r) => !r.viewed).length;

  useEffect(() => {
    document.title = unreadCount > 0 ? `(${unreadCount}) ${TITLE_BASE}` : TITLE_BASE;
  }, [unreadCount]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const handleToggleMute = () => {
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(MUTE_KEY, String(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  // Explicit close (toggle, outside click, Escape) is what advances the
  // last-seen anchor — briefly opening the panel to peek shouldn't mark
  // everything read.
  const closeBell = () => {
    const now = new Date().toISOString();
    writeLastSeen(now);
    setLastSeenAt(now);
    const empty = new Set();
    setViewedIds(empty);
    writeViewedIds(empty);
    setBellOpen(false);
  };

  const handleToggleOpen = () => {
    if (bellOpen) {
      closeBell();
    } else {
      setBellOpen(true);
    }
  };

  const handleItemClick = (reservation) => {
    setViewedIds((prev) => {
      const next = new Set(prev);
      next.add(reservation.id);
      writeViewedIds(next);
      return next;
    });
    setJumpTarget({ ...reservation, key: Date.now() });
  };

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
            items={unreadItems}
            unreadCount={unreadCount}
            muted={muted}
            open={bellOpen}
            onToggleMute={handleToggleMute}
            onToggleOpen={handleToggleOpen}
            onRequestClose={closeBell}
            onItemClick={handleItemClick}
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
        <Outlet context={{ reservations, loading, fetchReservations, jumpTarget }} />
      </main>
    </div>
  );
}
