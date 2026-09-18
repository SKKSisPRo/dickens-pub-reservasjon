import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Feil e-post eller passord.');
      return;
    }
    const redirectTo = location.state?.from?.pathname || '/admin';
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-[380px] flex flex-col gap-4">
        <h1 className="text-3xl font-gothic text-dickens-green mb-1 text-center">Dickens Pub</h1>
        <p className="text-gray-500 text-center mb-4">Logg inn for å administrere reservasjoner</p>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">E-post</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dickens-gold"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-gray-600">Passord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-dickens-gold"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded p-2">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-5 py-2 rounded-lg font-medium bg-dickens-green hover:bg-[#122a24] text-white transition-colors disabled:opacity-60"
        >
          {loading ? 'Logger inn...' : 'Logg inn'}
        </button>
      </form>
    </div>
  );
}
