import type { TabHook, BaseItem, AnyItem } from '../../types/types';
import { ItemSection } from './ItemSection';
import { CLOCK_ICON, LIST_ICON } from '../../constants/icon';

interface CategoryPageProps<T extends BaseItem = AnyItem> {
    tab: TabHook<T>;
}

export function CategoryPage<T extends BaseItem>({ tab }: CategoryPageProps<T>) {
    const title = tab.title || "Unknown";
    const recentItems = tab.recentItems || [];
    const allItems = tab.allItems || [];
    const searchQuery = tab.searchQuery || "";
    const onCardClick = tab.onCardClick;
    const onTogglePin = tab.handleTogglePin;

    const query = searchQuery.toLowerCase();

    const filteredRecent = recentItems.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        (item.metadata && item.metadata.toLowerCase().includes(query))
    );

    const filteredAll = allItems.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        (item.metadata && item.metadata.toLowerCase().includes(query))
    );

    return (
        <div className="category-page">
            <ItemSection
                title="Recent"
                icon={CLOCK_ICON}
                items={filteredRecent}
                onCardDoubleClick={onCardClick}
                onTogglePin={onTogglePin}
                getCardActions={tab.getCardActions}
            />

            {filteredAll.length > 0 ? (
                <ItemSection
                    title={`All ${title}`}
                    icon={LIST_ICON}
                    items={filteredAll}
                    onCardDoubleClick={onCardClick}
                    onTogglePin={onTogglePin}
                    getCardActions={tab.getCardActions}
                />
            ) : (
                <div style={{ textAlign: 'center', marginTop: '48px', color: 'var(--text-muted)' }}>
                    {searchQuery ? `No results found for "${searchQuery}"` : "No results found"}
                </div>
            )}

        </div>
    );
};
