import { applicationStorage, StorageKeys, EventKeys } from '@/utils';
import { useState, useEffect, useCallback } from 'react';

const sidebarStorage = new applicationStorage(StorageKeys.SIDEBAR);
const SIDEBAR_SYNC_EVENT = EventKeys.SIDEBAR_EVENT;

const useSideBar = () => {
    // 1. Initial State from Storage
    const [isMinimized, setIsMinimized] = useState<boolean>(() => {
        return sidebarStorage.get() === '1';
    });

    // 2. Synchronize with other components using the same hook
    useEffect(() => {
        // Cast the event to CustomEvent<boolean> to access .detail safely
        const handleSync = (event: Event) => {
            const customEvent = event as CustomEvent<boolean>;
            if (customEvent.detail !== isMinimized) {
                setIsMinimized(customEvent.detail);
            }
        };

        window.addEventListener(SIDEBAR_SYNC_EVENT, handleSync);
        return () => window.removeEventListener(SIDEBAR_SYNC_EVENT, handleSync);
    }, [isMinimized]);

    // 3. Update Storage when state changes
    useEffect(() => {
        sidebarStorage.set(isMinimized ? '1' : '0');
    }, [isMinimized]);

    // 4. Action Handlers that broadcast the change
    const updateSidebar = useCallback((newState: boolean) => {
        setIsMinimized(newState);
        // Broadcast to all other components listening
        window.dispatchEvent(new CustomEvent(SIDEBAR_SYNC_EVENT, { detail: newState }));
    }, []);

    const minimizeWindow = useCallback(() => updateSidebar(true), [updateSidebar]);
    const maximizeWindow = useCallback(() => updateSidebar(false), [updateSidebar]);
    const toggleSidebar = useCallback(() => updateSidebar(!isMinimized), [isMinimized, updateSidebar]);

    return {
        isMinimized,
        minimizeWindow,
        maximizeWindow,
        toggleSidebar
    };
};

export default useSideBar;