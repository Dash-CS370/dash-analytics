import styles from '@/app/user/account/page.module.css';
import { NavBar } from '@/components/common/NavBar';
import { AccountDetails } from '@/components/pages/accountPage/AccountDetails';

export default function Account() {
    return (
        <main className={styles.main}>
            <NavBar connected={true} />

            <AccountDetails />
        </main>
    );
}
