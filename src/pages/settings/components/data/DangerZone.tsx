import React from 'react';
import { ConfirmationModal } from '../../../../components/ui/ConfirmationModal';
import { useDangerZone } from './hooks/useDangerZone';
import { getResetActions } from '../../actions/getResetActions';
import { SETTINGS_DANGER_ICON } from '../../../../constants/icon';

export const DangerZone: React.FC = () => {
    const {
        activeModalId,
        setActiveModalId,
        resettingId,
        isAnyResetting,
        executeReset
    } = useDangerZone();

    const RESET_ACTIONS = getResetActions();
    const activeConfig = RESET_ACTIONS.find(action => action.id === activeModalId);

    return (
        <div className="settings-danger-zone-container">
            <h3 className="settings-danger-zone-header">
                {SETTINGS_DANGER_ICON}
                Danger Zone
            </h3>
            <p className="settings-danger-zone-text">
                Resetting the database will clear all cached information, including all banned shows and renamed titles. The application will rescan directories from scratch on the next launch.
            </p>
            
            <div className="settings-danger-buttons-container">
                {RESET_ACTIONS.map(action => (
                    <button 
                        key={action.id}
                        onClick={() => setActiveModalId(action.id)}
                        disabled={isAnyResetting}
                        className={`settings-button ${action.buttonClass}`}
                    >
                        {resettingId === action.id ? action.resettingLabel : action.buttonLabel}
                    </button>
                ))}
            </div>

            {activeConfig && (
                <ConfirmationModal 
                    isOpen={true}
                    title={activeConfig.modalTitle}
                    message={activeConfig.modalMessage}
                    onConfirm={() => executeReset(activeConfig)}
                    onCancel={() => setActiveModalId(null)}
                    confirmText={activeConfig.confirmText}
                    cancelText="Cancel"
                    isDanger={true}
                />
            )}
        </div>
    );
};
