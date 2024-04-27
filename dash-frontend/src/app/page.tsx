import styles from './page.module.css';
import { DynamicDescription } from '@/components/pages/landingPage/DynamicDescription';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';

export default function Home() {
    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <div className={styles.titleContainer}>
                    <span className={styles.dash}>Dash</span>
                    <span className={styles.analytics}>Analytics</span>
                </div>

                <DynamicDescription />

                <div className={styles.heroBtns}>
                    <PrimaryButton
                        className={styles.btns}
                        href="/start"
                        width="200px"
                        height="50px"
                    >
                        Get Started
                    </PrimaryButton>

                    <PrimaryButton
                        href="/learn-more"
                        className={styles.btns}
                        width="200px"
                        height="50px"
                    >
                        Learn More
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
