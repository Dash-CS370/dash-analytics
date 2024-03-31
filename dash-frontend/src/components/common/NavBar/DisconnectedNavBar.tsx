'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/common/NavBar/NavBar.module.css';
import { FC } from 'react';

export const DisconnectedNavBar: FC = () => {
    return (
        <div className={styles.main}>
            <Link href="/">
                <Image
                    src="/DashTitle.svg"
                    alt="Dash Title"
                    width={200}
                    className={styles.dashTitle}
                />
            </Link>
        </div>
    );
};