import React, { useMemo } from 'react';
import { ChunkList } from '../../../../components/bazar/ChunkList';
import { BazarBreadcrumbs } from '../../../../components/bazar/BazarBreadcrumbs';
import { useBazarTab } from '../../../../hooks/bazar/useBazarTab';
import { ICONS } from '../../../../constants/icon';
import { sortChunks } from '../../actions/sortChunks';
import type { usePdf } from '../../../../hooks/pdf/usePdf';
import { PDF_TAB_EMPTY_TITLE, PDF_TAB_EMPTY_DESC } from '../../constants/constants';
import type { PdfSortMode, PdfDir } from "../../../../types/pdf";
import type { Chunk, BazarAction } from '../../../../types/bazar';

interface PdfTabContentProps {
    pdf: ReturnType<typeof usePdf>;
    sortMode: PdfSortMode;
}

const getPdfDirTags = (dir: PdfDir): string[] => {
    const extSet = new Set<string>();
    const collect = (d: PdfDir) => {
        for (const f of d.files) {
            if (f.ext) extSet.add(f.ext.toUpperCase());
            else extSet.add('PDF');
        }
        for (const child of d.childs) {
            collect(child);
        }
    };
    collect(dir);
    if (extSet.size === 0) extSet.add('PDF');
    return Array.from(extSet);
};

export const PdfTabContent: React.FC<PdfTabContentProps> = ({ pdf, sortMode }) => {
    const tab = useBazarTab(pdf);

    // Build folder chunks and file chunks for current directory level
    const currentChunks: Chunk[] = useMemo(() => {
        const folderChunks: (Chunk & { rawDir?: PdfDir })[] = [];
        const fileChunks: Chunk[] = [];

        if (pdf.currentDir) {
            // Inside a directory
            for (const childDir of pdf.currentDir.childs) {
                const folderName = childDir.path.split(/[/\\]/).filter(Boolean).pop() || childDir.path;
                folderChunks.push({
                    id: childDir.id,
                    name: folderName,
                    path: childDir.path,
                    ext: 'FOLDER',
                    tags: getPdfDirTags(childDir),
                    icon: ICONS.FILE.FOLDER,
                    size: childDir.size,
                    is_pinned: false,
                    rawDir: childDir,
                });
            }
            for (const file of pdf.currentDir.files) {
                fileChunks.push({
                    id: file.id,
                    name: file.name,
                    path: file.path,
                    ext: file.ext || 'pdf',
                    size: file.size,
                    is_pinned: false,
                });
            }
        } else {
            // At Root level: display top-level root folders
            const rootDirs = pdf.pdfTree.filter(dir =>
                !pdf.pdfTree.some(other =>
                    other.id !== dir.id &&
                    (dir.path.startsWith(other.path + '/') || dir.path.startsWith(other.path + '\\'))
                )
            );

            for (const dir of rootDirs) {
                const folderName = dir.path.split(/[/\\]/).filter(Boolean).pop() || dir.path;
                folderChunks.push({
                    id: dir.id,
                    name: folderName,
                    path: dir.path,
                    ext: 'FOLDER',
                    tags: getPdfDirTags(dir),
                    icon: ICONS.FILE.FOLDER,
                    size: dir.size,
                    is_pinned: false,
                    rawDir: dir,
                });
            }
            // Add root pdfs
            for (const chunk of tab.visibleChunks) {
                fileChunks.push(chunk);
            }
        }

        return [...folderChunks, ...fileChunks];
    }, [pdf.currentDir, pdf.pdfTree, tab.visibleChunks]);

    // Apply search filtering if query exists
    const filteredChunks = useMemo(() => {
        if (!pdf.searchQuery.trim()) return currentChunks;
        const q = pdf.searchQuery.toLowerCase();
        return currentChunks.filter(c =>
            c.name.toLowerCase().includes(q) || c.path.toLowerCase().includes(q)
        );
    }, [currentChunks, pdf.searchQuery]);

    // Apply sorting to both folders and files (folders stay on top)
    const sortedChunks = useMemo(() => {
        const folders = filteredChunks.filter(c => (c as any).rawDir);
        const files = filteredChunks.filter(c => !(c as any).rawDir);
        const sortedFolders = sortChunks(folders, sortMode);
        const sortedFiles = sortChunks(files, sortMode);
        return [...sortedFolders, ...sortedFiles];
    }, [filteredChunks, sortMode]);

    const handleItemClick = (chunk: Chunk) => {
        const rawDir = (chunk as any).rawDir as PdfDir | undefined;
        if (rawDir) {
            pdf.handleFolderClick(rawDir);
        } else {
            tab.getChunkActions(chunk)[0]?.onClick();
        }
    };

    const getChunkActions = (chunk: Chunk): BazarAction[] => {
        const rawDir = (chunk as any).rawDir as PdfDir | undefined;
        if (rawDir) {
            return [
                {
                    label: 'Open Folder',
                    onClick: () => pdf.handleFolderClick(rawDir),
                }
            ];
        }
        return tab.getChunkActions(chunk);
    };

    return (
        <div className="pdf-tab-content">
            {pdf.canGoBack && (
                <BazarBreadcrumbs
                    path={pdf.currentDir?.path}
                    canGoBack={pdf.canGoBack}
                    onGoBack={pdf.goBack}
                />
            )}

            <ChunkList
                chunks={sortedChunks}
                getChunkActions={getChunkActions}
                onItemClick={handleItemClick}
                emptyIcon={ICONS.FILE.MARKDOWN}
                emptyTitle={PDF_TAB_EMPTY_TITLE}
                emptyDesc={PDF_TAB_EMPTY_DESC}
            />
        </div>
    );
};
