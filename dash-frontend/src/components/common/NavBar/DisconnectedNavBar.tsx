'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/common/NavBar/NavBar.module.css';
import { FC } from 'react';

export const DisconnectedNavBar: FC = () => {
    return (
        <div className={styles.main}>
            <Link className={styles.dash} href="/">
                <Image
                    src="/assets/Dash.svg"
                    alt="Dash"
                    width="85"
                    height="40"
                />
            </Link>
            <Link className={styles.navLink} href="/learn-more">
                Learn More
            </Link>
        </div>
    );
};
