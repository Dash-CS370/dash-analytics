import styles from '@/app/account/page.module.css';
import { NavBar } from '@/components/common/NavBar';
import { AccountDetails } from '@/components/pages/accountPage/AccountDetails';

export default function Account() {
    return (
        <main className={styles.main}>
            <NavBar connected={true} />
            <AccountDetails />

            {/*<div className={styles.content}>
                <h1 className={styles.title}>Account</h1>
                <div className={styles.horizontalLine}></div>
            </div> */}
        </main>
    );
}
