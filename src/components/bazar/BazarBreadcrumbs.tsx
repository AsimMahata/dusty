import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BazarBreadcrumbsProps {
    path?: string;
    canGoBack: boolean;
    onGoBack: () => void;
    count?: number;
    children?: React.ReactNode;
}

export const BazarBreadcrumbs: React.FC<BazarBreadcrumbsProps> = ({
    path,
    canGoBack,
    onGoBack,
    count,
    children,
}) => {
    return (
        <div 
            className="bazar-breadcrumbs"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '16px',
                flexWrap: 'wrap',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {canGoBack && (
                    <button
                        className="zip-sort-btn"
                        onClick={onGoBack}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            fontWeight: 600,
                        }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                )}
                {path && (
                    <span 
                        style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-muted, #94a3b8)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        title={path}
                    >
                        {path}
                    </span>
                )}
                {count !== undefined && (
                    <span 
                        style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-muted, #94a3b8)',
                            fontWeight: 500,
                        }}
                    >
                        Showing {count} {count === 1 ? 'file' : 'files'}
                    </span>
                )}
            </div>
            {children && <div>{children}</div>}
        </div>
    );
};
