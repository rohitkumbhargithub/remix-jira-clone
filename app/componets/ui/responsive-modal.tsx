import React from 'react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { Drawer, DrawerContent } from '~/components/ui/drawer';

interface ResponsiveModalProps {
    open: boolean,
    children: React.ReactNode;
}

export const useMedia = (query, defaultState = false) => {
    const [matches, setMatches] = useState(defaultState);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (event) => setMatches(event.matches);

        mediaQuery.addEventListener('change', handler);

        
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
};

export const ResponsiveModal = ({
    open,
    children,
}: ResponsiveModalProps) => {
    
    const isDesktop = useMedia('(min-width: 1024px)', true);
    
    if (isDesktop) {
        return (
            <Dialog open={open}>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </DialogContent>
            </Dialog>
        );
    }

    
    return (
        <Drawer open={open}>
            <DrawerContent>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </div>
            </DrawerContent> 
        </Drawer>
    );
};
