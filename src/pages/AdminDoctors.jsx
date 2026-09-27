import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiSlash } from 'react-icons/fi';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Notification';
import * as api from '../services/api';

const emptyForm = {
  name: '', specialization: 'General Physician', experience: 0, qualification: '',
  fee: 0, hospital: '', about: '', available: true,
};

export default function AdminDoctors() {
  const notify = useToast();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function load() {
    setLoading(true);
    const [d, s] = await Promise.all([api.getDoctors(), api.getSpecializations()]);
    setDoctors(d);
    setSpecializations(s);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setEditing('new'); setForm(emptyForm); }
  function openEdit(d) { setEditing(d.id); setForm(d); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editing === 'new') {
      await api.addDoctor({ ...form, status: 'approved', rating: 0, reviews: 0, slots: [] });
      notify('Doctor added.', 'success');
    } else {
      await api.updateDoctor(editing, form);
      notify('Doctor updated.', 'success');
    }
    setEditing(null);
    load();
  }

  async function handleDelete() {
    await api.deleteDoctor(confirmDelete.id);
    notify('Doctor removed.', 'info');
    setConfirmDelete(null);
    load();
  }

  async function approve(d) { await api.updateDoctor(d.id, { status: 'approved' }); notify('Doctor approved.', 'success'); load(); }
  async function deactivate(d) { await api.updateDoctor(d.id, { status: 'deactivated', available: false }); notify('Doctor deactivated.', 'info'); load(); }

  return (
    <div>
      <div className="dash-header flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Manage Doctors</h1>
          <p className="text-muted">Add, edit, approve, or remove doctors.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><FiPlus /> Add doctor</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Specialization</th><th>Experience</th><th>Fee</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.specialization}</td>
                  <td>{d.experience} yrs</td>
                  <td>₹{d.fee}</td>
                  <td>
                    <span className={`badge ${d.status === 'approved' ? 'badge-success' : d.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      {d.status === 'pending' && (
                        <button className="btn btn-sm btn-primary" onClick={() => approve(d)}><FiCheck /></button>
                      )}
                      {d.status !== 'deactivated' && (
                        <button className="btn btn-sm btn-outline" onClick={() => deactivate(d)}><FiSlash /></button>
                      )}
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(d)}><FiEdit2 /></button>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(d)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!editing} title={editing === 'new' ? 'Add doctor' : 'Edit doctor'} onClose={() => setEditing(null)}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="d-name">Name</label>
            <input id="d-name" className="input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="d-spec">Specialization</label>
              <select id="d-spec" className="input" value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}>
                {specializations.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="d-exp">Experience (years)</label>
              <input id="d-exp" type="number" className="input" value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="d-qual">Qualification</label>
              <input id="d-qual" className="input" value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} />
            </div>
            <div className="field">
              <label htmlFor="d-fee">Consultation fee (₹)</label>
              <input id="d-fee" type="number" className="input" value={form.fee} onChange={(e) => setForm((f) => ({ ...f, fee: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="d-hospital">Hospital / Clinic</label>
            <input id="d-hospital" className="input" value={form.hospital} onChange={(e) => setForm((f) => ({ ...f, hospital: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="d-about">About</label>
            <textarea id="d-about" className="input" value={form.about} onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-block" type="submit">{editing === 'new' ? 'Add doctor' : 'Save changes'}</button>
        </form>
      </Modal>

      <Modal
        open={!!confirmDelete}
        title="Remove doctor"
        onClose={() => setConfirmDelete(null)}
        footer={(
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>Remove doctor</button>
          </>
        )}
      >
        <p>Are you sure you want to remove <strong>{confirmDelete?.name}</strong>? This can't be undone.</p>
      </Modal>
    </div>
  );
}
