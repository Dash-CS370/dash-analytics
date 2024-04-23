'use client';

import { FC, useEffect, useState } from 'react';
import styles from '@/components/pages/accountPage/AccountPage.module.css';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import ProgressBar from '@/components/pages/accountPage/ProgressBar/ProgressBar';
import { integer } from 'aws-sdk/clients/cloudfront';

export interface UserDetails {
    id: string;
    name: string;
    email: string;
    password: string;
    credits: integer;
    creationDate: string;
}

export const AccountDetails: FC = () => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        id: '',
        name: 'John Smith',
        email: 'johnsmith@gmail.com',
        password: '***********',
        credits: 60,
        creationDate: '',
    });

    fetch('http://dash-analytics.solutions/api/v1/user/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            credentials: 'include',
        },
    })
        .then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setUserDetails({
                        id: data.id,
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        credits: data.credits,
                        creationDate: data.creationDate,
                    });
                });
            } else {
                console.error(
                    `Error fetching user details. Response status: ${response.status}`,
                );
            }
        })
        .catch((error) => {
            console.error(`Error fetching user details: ${error}`);
        });

    const testData = [{ bgcolor: '#6a1b9a', completed: 60 }];

    const [completed, setCompleted] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCompleted(Math.floor(Math.random() * 100) + 1);
        }, 2000);

        return () => clearInterval(interval); // 清除定时器
    }, []);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.sidebar}>
                <div className={styles.sidbarContent}>
                    <a href="/dashboards">Home</a>
                    <a href="/about">About</a>
                    <a href="">Credit</a>
                </div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.section}>
                    <h1>Account Details</h1>
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Name</h5>
                        </div>
                        <div className={styles.info}>{userDetails.name}</div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Email</h5>
                        </div>
                        <div className={styles.info}>{userDetails.email}</div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Password</h5>
                        </div>
                        <div className={styles.info}>
                            {userDetails.password}
                        </div>
                    </div>
                    <hr />

                    <PrimaryButton
                        width="500px"
                        height="50px"
                        className={styles.deleteBtn}
                    >
                        Delete Account
                    </PrimaryButton>
                </div>
                <div className={styles.section}>
                    <h1 className={styles.title}>Credits</h1>
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Credit Usage:</h5>
                        </div>
                        <div className={styles.info}>
                            {userDetails.credits} / 100 used
                        </div>
                    </div>
                    <div className={styles.info1}>
                        <div className={styles.BarWrapperContainer}>
                            <div className={styles.BarWrapper}>
                                {testData.map((item, index) => (
                                    <ProgressBar
                                        // className={styles.bar}
                                        key={index}
                                        bgcolor={item.bgcolor}
                                        completed={item.completed}
                                    />
                                ))}
                            </div>
                            <div className={styles.creditRequestContainer}>
                                <textarea
                                    className={styles.requestBox}
                                    placeholder="Request more credits here..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.requestBtnContainer}>
                        <PrimaryButton
                            width="250px"
                            height="50px"
                            className={styles.requestBtn}
                        >
                            Request
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
