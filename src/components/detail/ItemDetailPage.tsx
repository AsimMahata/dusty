import { ContextMenu } from '../ui/ContextMenu';
import { useItemDetail } from '../../hooks/useItemDetail';
import { DetailHeader } from './DetailHeader';
import { DetailList } from './DetailList';
import type { TabHook } from "../../types/tabs";
import type { BaseItem, AnyItem } from "../../types/core";

interface ItemDetailPageProps<T extends BaseItem = AnyItem> {
    tab: TabHook<T>;
}

export function ItemDetailPage<T extends BaseItem>({ tab }: ItemDetailPageProps<T>) {
    const item = tab.selectedItem;
    const onBack = () => tab.setSelectedItem?.(null);
    const onClick = tab.onItemClick;
    const renderActions = tab.getRenderActions;
    const defaultIcon = tab.defaultIcon;
    const onRename = tab.handleRename;

    const detail = useItemDetail(tab);

    if (!item) return null;

    return (
        <div className="detail-page">
            <DetailHeader 
                item={item}
                detail={detail}
                onBack={onBack}
                canRename={!!onRename}
                actions={tab.getCardActions ? tab.getCardActions(item) : undefined}
            />

            {renderActions && (
                <div className="detail-actions" style={{ padding: '0 1.5rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {renderActions(item)}
                </div>
            )}

            <DetailList 
                detail={detail}
                onActionClick={onClick}
                defaultIcon={defaultIcon}
            />

            {detail.contextMenu && (
                <ContextMenu
                    x={detail.contextMenu.x}
                    y={detail.contextMenu.y}
                    actions={detail.contextMenu.actions}
                    onClose={() => detail.setContextMenu(null)}
                />
            )}
        </div>
    );
};
