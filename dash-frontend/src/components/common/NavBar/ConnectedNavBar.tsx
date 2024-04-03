import styles from '@/components/common/NavBar/NavBar.module.css';
import Link from 'next/link';
import { FC } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import { VscAccount } from 'react-icons/vsc';

export const ConnectedNavBar: FC = () => {
    // TODO: Implement logout functionality:
    // -> clear context/cookies that say user is logged in
    // -> clear user's account data from context/cookies

    const finishLogout = async () => {
        await fetch("http://127.0.0.1:8080/api/v1/user/logout", {
            method: 'GET',
            credentials : "include",
        });
    }

    const handleLogout = async () => {
        const logout_relocation = window.open("http://auth-server:9000/user/logout");
        await finishLogout();
        // @ts-ignore
        logout_relocation.close();
    }


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
                <Link href="/">
                    <IoLogOutOutline className={styles.icon} onClick={handleLogout}/>
                </Link>
            </div>
        </div>
    );
};
