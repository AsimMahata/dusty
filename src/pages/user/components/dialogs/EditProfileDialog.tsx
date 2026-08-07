import React from 'react';
import type { UserPageHook } from '../../hooks/useUserPage';
import { X_ICON_18 } from '../../../../constants/icon';

interface EditProfileDialogProps {
  hook: UserPageHook;
}

const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", // Indigo
  "linear-gradient(135deg, #ec4899 0%, #be185d 100%)", // Pink
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", // Amber
  "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Emerald
  "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", // Blue
  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)", // Purple
  "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)", // Rose
  "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", // Cyan
];

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({ hook }) => {
  const {
    isEditModalOpen: isOpen,
    setIsEditModalOpen,
    editName,
    setEditName,
    editAvatar,
    setEditAvatar,
    handleSaveProfile: onSave,
    getInitials,
    handleUploadCustomAvatar: onUploadCustomAvatar,
    convertFileSrc
  } = hook;

  const onClose = () => setIsEditModalOpen(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <h3>Edit Local Profile</h3>
          <button className="modal-close-btn" onClick={onClose}>
            {X_ICON_18}
          </button>
        </div>

        <form onSubmit={onSave} className="modal-form">
          <div className="dialog-avatar-preview-container">
            <div 
              className="hero-avatar dialog-avatar-preview"
              style={
                editAvatar && editAvatar.startsWith('linear-gradient')
                  ? { background: editAvatar }
                  : editAvatar 
                    ? { backgroundImage: `url('${convertFileSrc(editAvatar)}?t=${hook.user?.updated_at || Date.now()}')` }
                    : undefined
              }
            >
              {(!editAvatar || editAvatar.startsWith('linear-gradient')) && getInitials(editName || 'D')}
            </div>
            <span className="dialog-avatar-preview-label">Avatar Preview</span>
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter display name"
              maxLength={30}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Choose Avatar Style</label>
            <div className="avatar-presets-grid">
              {PRESET_GRADIENTS.map((grad, idx) => (
                <div 
                  key={idx}
                  className={`preset-avatar-option ${editAvatar === grad ? 'active' : ''}`}
                  style={{ background: grad }}
                  onClick={() => setEditAvatar(grad)}
                >
                  {getInitials(editName || 'D')}
                </div>
              ))}
            </div>
            
            <div className="dialog-custom-avatar-wrapper">
              <button 
                type="button" 
                className="btn-secondary dialog-upload-btn" 
                onClick={onUploadCustomAvatar}
              >
                Upload Custom Image...
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

