'use client';
import Styles from './OverviewPage.module.css';
import { CgProfile } from 'react-icons/cg';
import { NavBar } from '@/components/NavBar';
const OverviewPage = () => {
    return (
        <>
            <NavBar connected={true} />
            <div className={Styles.container}>
                {/* <div className={Styles.sidebar}>
        <a href="">Home</a>
        <a href="">Overview</a>
        <a href="">Usage</a>
        <a href="">Request</a>
      </div> */}
                <div className={Styles.content}>
                    <div className={Styles.imageContainer}>
                        {/* <img
                            src="/images/image3.jpeg"
                            className={Styles.image}
                        ></img> */}
                        <h1>D</h1>
                    </div>
                    <div className={Styles.text}>
                        <h1>ASH-ANALYTICS</h1>
                        <h4>what you should know about Dash-Analytics</h4>
                        <p>
                            Dash Analytics is a cutting-edge platform that
                            simplifies data analysis by allowing users to upload
                            CSV datasets with descriptive narratives. Utilizing
                            GPT's natural language comprehension, it
                            intelligently discerns data types and context,
                            enabling sophisticated algorithms to generate
                            insightful charts and visuals. This process
                            transforms complex data into understandable
                            insights, facilitating informed decision-making
                            across various user profiles, from data aficionados
                            to business leaders.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OverviewPage;
