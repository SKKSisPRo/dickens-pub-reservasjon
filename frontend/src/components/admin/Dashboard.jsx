import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { supabase } from '../../supabase';
import { apiFetch } from '../../lib/api';
import ReservationList from './ReservationList';
import FloorPlanPanel from './FloorPlanPanel';
import EditReservationModal from './EditReservationModal';

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Dashboard() {
  const { jumpTarget } = useOutletContext() || {};
  const [reservations, setReservations] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [hoveredReservationId, setHoveredReservationId] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, data: null });
  const [activePanel, setActivePanel] = useState('list'); // mobile/tablet tab: 'list' | 'map'

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
    fetchReservations();
    apiFetch('/tables')
      .then(res => res.json())
      .then(setTablesData)
      .catch(console.error);

    const channel = supabase
      .channel('public:reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        fetchReservations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!jumpTarget) return;
    setSelectedDate(jumpTarget.date);
    setSelectedReservationId(jumpTarget.id);
    setActivePanel('list');
  }, [jumpTarget]);

  const putReservation = async (payload) => {
    try {
      await apiFetch(`/reservations/${payload.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      fetchReservations();
    } catch (err) {
      console.error('Update error', err);
    }
  };

  const handleAccept = (r) => putReservation({ ...r, tableId: r.table_id, status: 'accepted' });
  const handleDecline = (r) => putReservation({ ...r, tableId: r.table_id, status: 'declined' });
  const handleEdit = (r) => setEditModal({ open: true, data: { ...r, tableId: r.table_id } });

  const handleDelete = async (r) => {
    if (window.confirm('Er du sikker på at du vil slette denne reservasjonen?')) {
      try {
        await apiFetch(`/reservations/${r.id}`, { method: 'DELETE' });
        fetchReservations();
      } catch (err) {
        console.error('Delete error', err);
      }
    }
  };

  const handleModalSave = async (data) => {
    await putReservation(data);
    setEditModal({ open: false, data: null });
  };

  const selectedReservation = reservations.find(r => r.id === selectedReservationId) || null;
  const hoveredReservation = reservations.find(r => r.id === hoveredReservationId) || null;

  const highlightedTableName = selectedReservation
    ? selectedReservation.table_name || `Table ${selectedReservation.table_id}`
    : null;
  const previewTableName = hoveredReservation
    ? hoveredReservation.table_name || `Table ${hoveredReservation.table_id}`
    : null;

  const reservationsForDate = reservations.filter(r => r.date === selectedDate);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 shrink-0">
        <h1 className="text-4xl font-gothic text-dickens-green mb-1 drop-shadow-sm">Reservations</h1>
        <p className="text-gray-500 font-medium">Oversikt og bordkart</p>
      </div>

      {/* Tab toggle — tablet/narrow only */}
      <div className="flex lg:hidden gap-2 mb-4 shrink-0">
        <button
          onClick={() => setActivePanel('list')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            activePanel === 'list' ? 'bg-dickens-green text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Reservasjoner
        </button>
        <button
          onClick={() => setActivePanel('map')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
            activePanel === 'map' ? 'bg-dickens-green text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Bordkart
        </button>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-4 min-h-0">
        <div className={`lg:w-[400px] lg:shrink-0 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${
          activePanel === 'list' ? 'flex' : 'hidden'
        } lg:flex flex-col`}>
          <ReservationList
            date={selectedDate}
            onDateChange={setSelectedDate}
            reservations={reservations}
            selectedReservationId={selectedReservationId}
            onSelectReservation={(r) => setSelectedReservationId(selectedReservationId === r.id ? null : r.id)}
            onHoverReservation={(r) => setHoveredReservationId(r ? r.id : null)}
            onAccept={handleAccept}
            onDecline={handleDecline}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className={`flex-grow min-h-[400px] ${activePanel === 'map' ? 'flex' : 'hidden'} lg:flex`}>
          <FloorPlanPanel
            reservationsForDate={reservationsForDate}
            highlightedTableName={highlightedTableName}
            previewTableName={previewTableName}
            loading={loading}
          />
        </div>
      </div>

      {editModal.open && editModal.data && (
        <EditReservationModal
          reservation={editModal.data}
          tablesData={tablesData}
          onClose={() => setEditModal({ open: false, data: null })}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}
