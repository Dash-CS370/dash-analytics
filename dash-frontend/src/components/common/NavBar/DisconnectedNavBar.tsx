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
                    src="/assets/dash.svg"
                    alt="Dash"
                    width="75"
                    height="40"
                />
            </Link>
            <Link className={styles.navLink} href="/signin">
                Learn More
            </Link>
        </div>
    );
};
