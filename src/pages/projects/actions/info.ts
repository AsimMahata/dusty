import { PROJECT_STATUS } from '../../../constants/projectStatus';
import type { Project } from "../../../types/projects";

export const getProjectBannerStats = (allProjects: Project[]) => {
    const pinnedCount = allProjects.filter(p => p.pinned).length;

    const statusCounts = allProjects.reduce((acc, p) => {
        const key = p.status || 'default';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const statusEntries = Object.entries(PROJECT_STATUS.STATUSES)
        .filter(([key]) => key !== 'default')
        .map(([key, def]) => ({
            ...def,
            id: key,
            count: statusCounts[key] || 0,
        }))
        .filter(entry => entry.count > 0);

    return {
        pinnedCount,
        statusEntries,
        totalCount: allProjects.length
    };
};
