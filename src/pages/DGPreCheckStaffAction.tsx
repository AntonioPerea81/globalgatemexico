import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Container } from '../components/UI';
import { usePageMeta } from '../hooks/usePageMeta';

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1') ?? '';
const ANON_KEY               = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

type Preview = {
  orderId:    string;
  reference:  string;
  company:    string;
  status:     string;
  alreadyDone: boolean;
};

export function DGPreCheckStaffActionPage() {
  usePageMeta({
    title: 'Staff Action — DG Pre-Check',
    canonical: 'https://www.globalgatemexico.com/dg-pre-check/staff-action',
    lang: 'en',
    noindex: true,
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [phase,     setPhase]     = useState<'loading' | 'preview' | 'confirming' | 'done' | 'error'>('loading');
  const [preview,   setPreview]   = useState<Preview | null>(null);
  const [errMsg,    setErrMsg]    = useState('');
  const [doneAt,    setDoneAt]    = useState('');

  useEffect(() => {
    if (!token) { setPhase('error'); setErrMsg('No action token provided.'); return; }

    fetch(`${SUPABASE_FUNCTIONS_URL}/precheck-order-action`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
      body:    JSON.stringify({ token, confirm: false }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setPreview(data as Preview);
        setPhase('preview');
      })
      .catch(err => { setPhase('error'); setErrMsg(err.message); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleConfirm() {
    setPhase('confirming');
    try {
      const res  = await fetch(`${SUPABASE_FUNCTIONS_URL}/precheck-order-action`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', apikey: ANON_KEY },
        body:    JSON.stringify({ token, confirm: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDoneAt(data.reportSentAt ?? new Date().toISOString());
      setPhase('done');
    } catch (err) {
      setPhase('error');
      setErrMsg(err instanceof Error ? err.message : 'Error confirming action.');
    }
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: '100px' }}>
      <Container>
        <div style={{ maxWidth: '480px', margin: '0 auto', paddingBottom: '80px' }}>
          <div style={{ background: '#060e1c', padding: '20px 24px', marginBottom: '24px', borderRadius: '3px' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 4px' }}>GGM DG Pre-Check</p>
            <p style={{ color: '#fff', fontSize: '14px', fontWeight: 800, margin: 0 }}>Staff Action Panel</p>
          </div>

          {phase === 'loading' && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Verifying token…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {phase === 'preview' && preview && (
            <div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', padding: '24px', borderRadius: '3px', marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '12px' }}>Order details</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ color: '#6b7280', fontSize: '13px', padding: '4px 0', width: '120px' }}>Reference</td><td style={{ fontSize: '13px', fontWeight: 800 }}>{preview.reference}</td></tr>
                    <tr><td style={{ color: '#6b7280', fontSize: '13px', padding: '4px 0' }}>Company</td><td style={{ fontSize: '13px', fontWeight: 600 }}>{preview.company}</td></tr>
                    <tr><td style={{ color: '#6b7280', fontSize: '13px', padding: '4px 0' }}>Status</td><td style={{ fontSize: '13px' }}><span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '2px' }}>{preview.status}</span></td></tr>
                    <tr><td style={{ color: '#6b7280', fontSize: '13px', padding: '4px 0' }}>Action</td><td style={{ fontSize: '13px' }}>mark as <strong>report_sent</strong></td></tr>
                  </tbody>
                </table>
              </div>

              {preview.alreadyDone ? (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderLeft: '3px solid #22c55e', padding: '16px', borderRadius: '3px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <CheckCircle size={18} color="#16a34a" />
                  <p style={{ fontSize: '13px', color: '#166534', margin: 0, fontWeight: 700 }}>Report already marked as sent for this order.</p>
                </div>
              ) : (
                <button
                  onClick={handleConfirm}
                  style={{ width: '100%', background: '#060e1c', color: '#fff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '3px' }}
                >
                  Confirm: Mark Report Sent →
                </button>
              )}

              <p style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', marginTop: '16px' }}>
                This action marks the order as <strong>report_sent</strong> and records the timestamp. It is irreversible.
              </p>
            </div>
          )}

          {phase === 'confirming' && (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Processing…</p>
            </div>
          )}

          {phase === 'done' && (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '32px', borderRadius: '3px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={28} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#166534', marginBottom: '8px' }}>Report marked as sent</h2>
              <p style={{ fontSize: '13px', color: '#166534', marginBottom: '4px' }}>
                Reference: <strong>{preview?.reference}</strong>
              </p>
              {doneAt && (
                <p style={{ fontSize: '12px', color: '#4ade80' }}>
                  {new Date(doneAt).toLocaleString('en-US', { timeZone: 'America/Mexico_City' })} CDMX
                </p>
              )}
            </div>
          )}

          {phase === 'error' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '3px solid #ef4444', padding: '20px', borderRadius: '3px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <h3 style={{ fontWeight: 800, color: '#991b1b', fontSize: '15px', margin: 0 }}>Error</h3>
              </div>
              <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>{errMsg}</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
