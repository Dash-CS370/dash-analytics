import styles from '@/components/common/NavBar/NavBar.module.css';
import Link from 'next/link';
import { FC } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';

export const ConnectedNavBar: FC = () => {
    return (
        <div className={styles.main}>
            <div className={styles.account}>
                <Link href="/account">
                    <VscAccount className={styles.accountIcon} />
                </Link>
            </div>
            <div className={styles.right}>
                <Link className={styles.navLink} href="/">
                    Learn More
                </Link>
                <Link href="http://13.58.196.163:8080/api/v1/user/logout">
                    <IoLogOutOutline className={styles.icon} />
                </Link>
            </div>
        </div>
    );
};
