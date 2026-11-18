// OrderMediaViewer — Auto-detects file type and renders appropriate media player
// Used in client portal and admin dashboard for order deliverables

import { useState } from 'react';
import { VideoPlayer, AudioPlayer, Viewer3D, MediaCard } from './MediaPlayers';

const API_BASE = 'http://localhost:8002';

const FILE_TYPE_ICONS = {
  video: '🎬',
  audio: '🎵',
  image: '🖼️',
  '3d': '🧊',
  archive: '📦',
  other: '📄',
};

const FILE_TYPE_LABELS = {
  video: 'Video',
  audio: 'Audio',
  image: 'Image',
  '3d': '3D Model',
  archive: 'Archive',
  other: 'File',
};

export function OrderMediaViewer({ assets, orderId, token }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'player'

  const deliverables = assets.filter(a => a.role === 'output' || a.role === 'delivery' || a.role === 'preview');
  const inputs = assets.filter(a => a.role === 'input');

  const getPreviewUrl = (assetId) => `${API_BASE}/api/assets/${assetId}/preview`;
  const getStreamUrl = (assetId) => `${API_BASE}/api/assets/${assetId}/stream`;
  const getDownloadUrl = (assetId) => `${API_BASE}/api/assets/${assetId}/download`;

  const renderPlayer = (asset) => {
    const previewUrl = getPreviewUrl(asset.id);
    const streamUrl = getStreamUrl(asset.id);

    switch (asset.file_type) {
      case 'video':
        return <VideoPlayer src={streamUrl} title={asset.filename} />;
      case 'audio':
        return <AudioPlayer src={previewUrl} title={asset.filename} />;
      case '3d':
        return <Viewer3D src={previewUrl} height={400} />;
      case 'image':
        return (
          <div style={{ textAlign: 'center' }}>
            <img src={previewUrl} alt={asset.filename} style={{ maxWidth: '100%', maxHeight: 500, borderRadius: 12, objectFit: 'contain' }} />
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'center', padding: 40, color: '#a1a1a6' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
            <div>{asset.filename}</div>
            <a href={getDownloadUrl(asset.id)} style={{ color: '#0071e3', marginTop: 8, display: 'inline-block' }}>Download File</a>
          </div>
        );
    }
  };

  if (deliverables.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#a1a1a6', background: '#1a1a1a', borderRadius: 12, border: '1px solid #27272a' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
        <div>No deliverables yet</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Files will appear here when your order is ready</div>
      </div>
    );
  }

  return (
    <div>
      {/* Asset Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
        {deliverables.map(asset => (
          <div
            key={asset.id}
            onClick={() => { setSelectedAsset(asset); setViewMode('player'); }}
            style={{
              background: selectedAsset?.id === asset.id ? '#0071e322' : '#1a1a1a',
              border: `1px solid ${selectedAsset?.id === asset.id ? '#0071e3' : '#27272a'}`,
              borderRadius: 10, padding: 12, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{FILE_TYPE_ICONS[asset.file_type] || '📄'}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {asset.filename}
            </div>
            <div style={{ fontSize: 11, color: '#a1a1a6', marginTop: 2 }}>
              {FILE_TYPE_LABELS[asset.file_type] || 'File'} · {(asset.file_size_bytes / 1024 / 1024).toFixed(1)}MB
            </div>
          </div>
        ))}
      </div>

      {/* Selected Asset Player */}
      {selectedAsset && (
        <div style={{ background: '#111', borderRadius: 12, padding: 16, border: '1px solid #27272a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
              {FILE_TYPE_ICONS[selectedAsset.file_type]} {selectedAsset.filename}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a
                href={getDownloadUrl(selectedAsset.id)}
                style={{ padding: '4px 12px', borderRadius: 6, background: '#0071e3', color: '#fff', fontSize: 12, textDecoration: 'none', fontWeight: 500 }}
              >
                Download
              </a>
              <button
                onClick={() => setSelectedAsset(null)}
                style={{ padding: '4px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 12, border: '1px solid #27272a', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
          {renderPlayer(selectedAsset)}
        </div>
      )}

      {/* Input Assets (if any) */}
      {inputs.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: '#a1a1a6', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Uploaded Files</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {inputs.map(asset => (
              <div key={asset.id} style={{ padding: '6px 12px', background: '#1a1a1a', borderRadius: 6, fontSize: 12, color: '#a1a1a6', border: '1px solid #27272a' }}>
                {FILE_TYPE_ICONS[asset.file_type]} {asset.filename}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderMediaViewer;
