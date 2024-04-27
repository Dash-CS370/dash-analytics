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
                            className={styles.dashImage}
                            alt="Dash"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>

                {/* What is DASH - Explanation */}
                <div className={styles.whatIs}>
                    <div className={styles.whatIsText}>
                        What is DASH Analytics?
                    </div>
                    <div className={styles.whatIsSubText}>
                        DASH Analytics is an innovative platform designed to
                        streamline the data analysis process. Users can simply
                        upload a CSV dataset along with brief descriptive
                        narratives, and then sit back while our platform
                        analyzes your data. Leveraging the power of GPT, our
                        platform swiftly identifies data types and context,
                        empowering advanced algorithms to produce insightful
                        charts and visuals. This transformation of our users
                        data into understandable insights facilitates informed
                        decision-making for a diverse range of individuals, from
                        everyday data enthusiasts all the way to business
                        executives.
                    </div>
                </div>
                {/* How To Guide */}
                <div className={styles.guideText}>How To Use It</div>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Getting Started
                        </h1>
                        <p className={styles.guideSubText}>x</p>
                    </div>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/start-page.jpg"
                            className={styles.image}
                            alt="Start-Page"
                            width={600}
                            height={450}
                        />
                    </div>
                </div>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/new-dash.jpg"
                            alt="Start-Page"
                            width={500}
                            height={300}
                        />
                    </div>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Creating A New Dashboard [Part 1]
                        </h1>
                        <p className={styles.guideSubText}>x</p>
                    </div>
                </div>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Creating A New Dashboard [Part 2]
                        </h1>
                        <p className={styles.guideSubText}>x</p>
                    </div>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/describe-data.jpg"
                            alt="Start-Page"
                            width={525}
                            height={325}
                        />
                    </div>
                </div>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/ex-dash.jpg"
                            alt="Start-Page"
                            width={525}
                            height={325}
                        />
                    </div>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Your New Dashboard
                        </h1>
                        <p className={styles.guideSubText}>x</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

{
}
