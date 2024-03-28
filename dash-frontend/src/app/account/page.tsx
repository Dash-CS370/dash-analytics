import styles from '@/app/account/page.module.css';
import { NavBar } from '@/components/common/NavBar';

export default function Account() {
    return (
        <main className={styles.main}>
            <NavBar connected={true} />

            <div className={styles.content}>
                <h1 className={styles.title}>Account</h1>
                <div className={styles.horizontalLine}></div>
            </div>
        </main>
    );
}
