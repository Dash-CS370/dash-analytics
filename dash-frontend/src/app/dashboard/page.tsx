import styles from '@/app/dashboard/page.module.css';
import { NavBar } from '@/components/NavBar';
import { Sidebar } from '@/components/pages/dashboard/Sidebar/Sidebar';

export default function Dashboard() {
    return (
        <main className={styles.main}>
            <Sidebar />
            <NavBar connected={true} />

            <div className={styles.content}>
                <h1 className={styles.title}>
                    Let&apos;s create a new dashboard!
                </h1>
                <div className={styles.horizontalLine}></div>
            </div>
        </main>
    );
}
