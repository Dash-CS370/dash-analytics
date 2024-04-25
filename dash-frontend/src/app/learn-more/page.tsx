import styles from '@/app/learn-more/page.module.css';
import Link from 'next/link';
import Image from 'next/image';

// Change Default NavBar?

export default function LearnMore() {
    return (
        <main className={styles.main}>
            {/* <NavBar> */}
            <div className={styles.nav}>
                <Link className={styles.dash} href="/">
                    <Image
                        src="/assets/Dash.svg"
                        alt="Dash"
                        width="85"
                        height="40"
                    />
                </Link>
                <Link className={styles.navLink} href="/start">
                    Get Started
                </Link>
            </div>

            {/* Header Box - Welcome Text */}
            <div className={styles.body}>
                <div className={styles.divider} />
                <div className={styles.splitSection}>
                    <div className={styles.textSide}>
                        <h1 className={styles.welcomeText}>
                            Welcome to DASH Analytics
                        </h1>
                        <p className={styles.subText}>
                            Data Visualization Made Easy Harnessing the Power of
                            AI
                        </p>
                    </div>
                    <div className={styles.imageContainer}>
                        <Image
                            src="/assets/DashLogo.svg"
                            className={styles.image}
                            alt="Dash"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>
                <div className={styles.divider} />
                {/* What is DASH - Explanation */}
                <div className={styles.whatIs}>
                    <div className={styles.whatIsText}>
                        What is DASH Analytics?
                    </div>
                    <div className={styles.whatIsSubText}>
                        DASH Analytics is a platform that allows users to
                        harness the power of Artificial Intelligence for precise
                        data analysis. Our solution effortlessly creates
                        relevant graphs, providing profound insights into your
                        data at the click of a button.
                    </div>
                </div>
                {/* How To Guide */}
                <div className={styles.howTo}></div>
            </div>
        </main>
    );
}
