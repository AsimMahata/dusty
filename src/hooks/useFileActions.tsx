import { useState, useCallback } from 'react';
import { openFile, openFileInExplorer, renameFile, deleteFile } from '../personalities/introverts/filesystem/filesystem';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { FilePropertiesModal } from '../components/ui/FilePropertiesModal';
import type { ActionItem } from '../types/core';

export interface FileTarget {
    path: string;
    name?: string;
}

export function useFileActions(onRefresh?: () => void) {
    const [deleteTarget, setDeleteTarget] = useState<FileTarget | null>(null);
    const [propertiesTarget, setPropertiesTarget] = useState<FileTarget | null>(null);

    const handleRename = useCallback(async (file: FileTarget) => {
        const currentName = file.name || file.path.split(/[/\\]/).pop() || '';
        const newName = window.prompt('Rename file:', currentName);
        if (!newName || newName.trim() === '' || newName.trim() === currentName) {
            return;
        }

        const isWin = file.path.includes('\\');
        const sep = isWin ? '\\' : '/';
        const parts = file.path.split(/[/\\]/);
        parts.pop();
        const dirPath = parts.join(sep);

        const trimmed = newName.trim();
        const dotIdx = currentName.lastIndexOf('.');
        const oldExt = dotIdx > 0 ? currentName.slice(dotIdx) : '';
        const newDotIdx = trimmed.lastIndexOf('.');
        const newExt = newDotIdx > 0 ? trimmed.slice(newDotIdx) : '';

        const finalName = (oldExt && !newExt) ? trimmed + oldExt : trimmed;
        const newPath = dirPath ? `${dirPath}${sep}${finalName}` : finalName;

        const success = await renameFile(file.path, newPath);
        if (success && onRefresh) {
            onRefresh();
        }
    }, [onRefresh]);

    const confirmDelete = useCallback(async () => {
        if (!deleteTarget) return;
        const targetPath = deleteTarget.path;
        setDeleteTarget(null);
        const success = await deleteFile(targetPath);
        if (success && onRefresh) {
            onRefresh();
        }
    }, [deleteTarget, onRefresh]);

    const getFileActions = useCallback((file: FileTarget, extraActions: ActionItem[] = []): ActionItem[] => {
        const actions: ActionItem[] = [
            {
                label: 'Open',
                onClick: () => { void openFile(file.path); },
            },
            {
                label: 'Reveal in File Explorer',
                onClick: () => { void openFileInExplorer(file.path); },
            },
            {
                label: 'Rename',
                onClick: () => { void handleRename(file); },
            },
            {
                label: 'Delete',
                color: '#ef4444',
                onClick: () => setDeleteTarget(file),
            },
            {
                label: 'Copy Path',
                onClick: () => { void navigator.clipboard.writeText(file.path); },
            },
            {
                label: 'Properties',
                onClick: () => setPropertiesTarget(file),
            },
            ...extraActions,
        ];
        return actions;
    }, [handleRename]);

    const renderFileModals = useCallback(() => (
        <>
            <ConfirmationModal
                isOpen={!!deleteTarget}
                title="Delete File"
                message={`Are you sure you want to delete "${deleteTarget?.name || deleteTarget?.path}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                isDanger={true}
                onConfirm={() => { void confirmDelete(); }}
                onCancel={() => setDeleteTarget(null)}
            />
            <FilePropertiesModal
                isOpen={!!propertiesTarget}
                filePath={propertiesTarget?.path || null}
                fileName={propertiesTarget?.name}
                onClose={() => setPropertiesTarget(null)}
            />
        </>
    ), [deleteTarget, propertiesTarget, confirmDelete]);

    return {
        getFileActions,
        renderFileModals,
        setDeleteTarget,
        setPropertiesTarget,
    };
}
