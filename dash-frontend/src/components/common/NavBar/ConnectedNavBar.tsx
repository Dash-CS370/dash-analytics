import styles from '@/components/common/NavBar/NavBar.module.css';
import Link from 'next/link';
import { FC } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';

export const ConnectedNavBar: FC = () => {
    // TODO: Implement logout functionality:
    // -> clear context/cookies that say user is logged in
    // -> clear user's account data from context/cookies

    return (
        <div className={styles.main}>
            <div className={styles.account}>
                <Link href="/account">
                    <VscAccount className={styles.accountIcon} />
                </Link>
            </div>
            <div className={styles.logout}>
                <Link href="/">
                    <IoLogOutOutline />
                </Link>
            </div>
        </div>
    );
};
