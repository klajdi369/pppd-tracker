import { useState, useRef } from 'react';
import { exportData, importData, getAllLogs } from '../utils/storage';
import { Download, Upload, Trash2, Info } from 'lucide-react';

export default function SettingsPage() {
  const [importStatus, setImportStatus] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pppd-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (importData(text)) {
        setImportStatus('Data imported successfully!');
      } else {
        setImportStatus('Failed to import data. Invalid format.');
      }
      setTimeout(() => setImportStatus(''), 3000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDeleteAll() {
    localStorage.removeItem('pppd-tracker-logs');
    setShowDeleteConfirm(false);
    window.location.reload();
  }

  const totalEntries = getAllLogs().length;

  return (
    <div className="page settings-page">
      <h1>Settings</h1>

      <div className="settings-section">
        <h3>Data Management</h3>
        <p className="settings-info">You have {totalEntries} log entries stored locally.</p>

        <button className="btn-secondary" onClick={handleExport}>
          <Download size={18} />
          Export Data
        </button>

        <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={18} />
          Import Data
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        {importStatus && <p className="status-message">{importStatus}</p>}

        {!showDeleteConfirm ? (
          <button className="btn-danger-outline" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 size={18} />
            Delete All Data
          </button>
        ) : (
          <div className="confirm-delete">
            <p>Are you sure? This cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="btn-danger" onClick={handleDeleteAll}>Yes, Delete All</button>
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>
          <Info size={18} />
          About PPPD
        </h3>
        <div className="about-content">
          <p>
            <strong>Persistent Postural-Perceptual Dizziness (PPPD)</strong> is a chronic vestibular
            disorder characterized by persistent sensations of dizziness, unsteadiness, and
            non-spinning vertigo.
          </p>
          <p>
            This app helps you track symptoms, identify triggers, and monitor your progress.
            Share your data with your healthcare team to help guide treatment.
          </p>
          <h4>Treatment typically includes:</h4>
          <ul>
            <li>Vestibular Rehabilitation Therapy (VRT)</li>
            <li>Cognitive Behavioral Therapy (CBT)</li>
            <li>Medication (SSRIs/SNRIs)</li>
            <li>Lifestyle modifications</li>
          </ul>
          <p className="disclaimer">
            This app is not a substitute for medical advice. Always consult your healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
