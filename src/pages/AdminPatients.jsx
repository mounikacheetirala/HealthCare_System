import { useEffect, useState } from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

export default function AdminPatients() {
  const notify = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    setLoading(true);
    setPatients(await api.getPatients());
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openEdit(p) { setEditing(p.id); setForm(p); }

  async function handleSubmit(e) {
    e.preventDefault();
    await api.updatePatient(editing, form);
    notify('Patient updated.', 'success');
    setEditing(null);
    load();
  }

  async function handleDelete() {
    await api.deletePatient(confirmDelete.id);
    notify('Patient removed.', 'info');
    setConfirmDelete(null);
    load();
  }

  return (
    <div>
      <div className="dash-header">
        <h1>Manage Patients</h1>
        <p className="text-muted">View and update patient records.</p>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.phone || '—'}</td>
                  <td><span className="badge badge-success">{p.status || 'active'}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(p)}><FiEdit2 /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(p)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} title="Edit patient" onClose={() => setEditing(null)}>
        {form && (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="pat-name">Name</label>
              <input id="pat-name" className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="pat-email">Email</label>
              <input id="pat-email" className="input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="pat-phone">Phone</label>
              <input id="pat-phone" className="input" value={form.phone || ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="pat-status">Status</label>
              <select id="pat-status" className="input" value={form.status || 'active'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button className="btn btn-primary btn-block" type="submit">Save changes</button>
          </form>
        )}
      </Modal>

      <Modal
        open={!!confirmDelete}
        title="Remove patient"
        onClose={() => setConfirmDelete(null)}
        footer={(
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Remove patient</button>
          </>
        )}
      >
        <p>Are you sure you want to remove <strong>{confirmDelete?.name}</strong>?</p>
      </Modal>
    </div>
  );
}
