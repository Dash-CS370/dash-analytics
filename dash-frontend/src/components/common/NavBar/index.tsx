'use client';

import { ConnectedNavBar } from '@/components/common/NavBar/ConnectedNavBar';
import { DisconnectedNavBar } from '@/components/common/NavBar/DisconnectedNavBar';
import { FC } from 'react';

interface NavBarProps {
    connected: boolean;
}

export const NavBar: FC<NavBarProps> = ({ connected }) => {
    if (connected) {
        return <ConnectedNavBar />;
    }

    return <DisconnectedNavBar />;
};
