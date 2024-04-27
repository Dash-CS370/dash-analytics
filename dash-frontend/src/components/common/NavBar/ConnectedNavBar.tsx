import styles from '@/components/common/NavBar/NavBar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';

export const ConnectedNavBar: FC = () => {

    const handleLogout = () => {
        window.location.href = "https://dash-analytics.solutions/api/v1/user/logout";
    };

    return (
        <div className={styles.main}>
            <div className={styles.account}>
                <Link href="/user/account">
                    <VscAccount className={styles.accountIcon} />
                </Link>
            </div>
            <div className={styles.right}>
                <Link className={styles.navLink} href="/learn-more">
                    Learn More
                </Link>
                <IoLogOutOutline className={styles.icon} onClick={handleLogout} />
            </div>
        </div>
    );

};
