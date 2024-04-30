import styles from '@/app/learn-more/page.module.css';
import Link from 'next/link';
import Image from 'next/image';

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
                            Data Visualization Made Easy by Harnessing the Power of
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
                <div className={styles.guideText}></div>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Getting Started
                        </h1>
                        <p className={styles.guideSubText}>
                            Begin your journey with Dash by signing in using
                            your preferred method. We support authentication
                            through Dash, Google, Microsoft, or GitHub accounts.
                            Choose the one that best fits your needs and get
                            access to powerful analytics in just a few clicks.
                            <br></br>
                            <br></br>
                            New User? Access to these tools is initially
                            limited. Request access to our platform by simply
                            providing us your email. After vertication from our
                            team, you will receive an email to create you
                            account.
                            <br></br>
                            <br></br>
                            Upon signing up, each user is allocated a certain
                            number of credits to use our services. Once you have
                            an account, you can easily request additional
                            credits through our user-friendly interface.
                        </p>
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
                <br></br>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/new-dash.jpg"
                            alt="Start-Page"
                            className={styles.image}
                            width={600}
                            height={450}
                        />
                    </div>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Creating A New Dashboard
                        </h1>
                        <p className={styles.guideSubText}>
                            Once signed in, you are met with the home interface.{' '}
                            <br></br> <br></br> Use the left side bar to view
                            old projects/dashboards and take a look at our
                            example project to get a better idea of what our
                            platform does. <br></br> <br></br> Want to create a
                            new dashboard? Simply start by uploading your CSV
                            file, then give your dashboard a unique title and a
                            brief description of the data. <br></br> <br></br>
                            This quick and straightforward setup provides
                            context with which your data will be analyzed.
                        </p>
                    </div>
                </div>
                <br></br>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Working With Your Data
                        </h1>
                        <p className={styles.guideSubText}>
                            Next, you enhance the data analysis process by
                            providing a brief description for each column in
                            your CSV file. <br></br>
                            <br></br>You will have the option to remove columns
                            that you wish to disregard. This helps to simplify
                            the visualizations and allows you to ignore
                            insignificant or irrelevant data. You also are
                            required to define the data type for each feature as
                            numerical, categorical, temporal or as a indentifer
                            which ensures accurate processing and visualization.{' '}
                            <br></br> <br></br>
                            These steps are crucial for tailoring the dashboard
                            to meet your specific analytical needs.
                        </p>
                    </div>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/describe-data.jpg"
                            alt="Start-Page"
                            className={styles.image}
                            width={600}
                            height={450}
                        />
                    </div>
                </div>
                <br></br>
                <div className={styles.splitSectionHowTo}>
                    <div className={styles.imageContainerGuide}>
                        <Image
                            src="/images/ex-dash.jpg"
                            alt="Start-Page"
                            className={styles.image}
                            width={600}
                            height={450}
                        />
                    </div>
                    <div className={styles.textSideGuide}>
                        <h1 className={styles.guideHeaderText}>
                            Your New Dashboard
                        </h1>
                        <p className={styles.guideSubText}>
                            After processing and analyzing your data, you will
                            be presented with your new dashboard. <br></br>
                            <br></br>This page dynamically displays graphs based
                            on both the data from your CSV file and the context
                            you provided. A variety of graph types will be
                            chosen by our platform to optimally and uniquely
                            visualize the data. <br></br>
                            <br></br>The intuitive design allows for easy
                            interpretation and analysis, enabling you to make
                            informed decisions, and gain valuable insight, based
                            on your data.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

{
}
