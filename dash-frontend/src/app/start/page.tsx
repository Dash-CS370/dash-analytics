import styles from '@/app/start/page.module.css';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton/SecondaryButton';

export default function Start() {
    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <div className={styles.titleContainer}>
                    <span className={styles.dash}>Dash</span>
                    <span className={styles.analytics}>Analytics</span>
                </div>
                <div className={styles.buttons}>
                    <PrimaryButton href="/login" width="350px" height="60px">
                        Login
                    </PrimaryButton>
                    <PrimaryButton
                        href="/request-access"
                        width="350px"
                        height="60px"
                    >
                        Request Access
                    </PrimaryButton>
                </div>
            </div>
            <video
                className={styles.heroVideo}
                src="/videos/dash-2.mp4"
                autoPlay
                loop
                muted
            />
        </main>
    );
}
