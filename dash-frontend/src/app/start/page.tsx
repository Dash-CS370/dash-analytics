import styles from '@/app/dashboard/page.module.css';
import { NavBar } from '@/components/NavBar';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';

export default function Start() {
    return (
        <main className={styles.main}>
            <h1>Dash Analytics</h1>

            <div className={styles.content}>
                <PrimaryButton href="/login" width="200px" height="60px">
                    Login
                </PrimaryButton>
                <PrimaryButton
                    href="/request-access"
                    width="200px"
                    height="60px"
                >
                    Request Access
                </PrimaryButton>
            </div>
        </main>
    );
}
