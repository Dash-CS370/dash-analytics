'use client';

import { FC, useEffect, useState } from 'react';
import styles from '@/components/pages/accountPage/AccountPage.module.css';
import { CgProfile } from 'react-icons/cg';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Link from 'next/link';

export const AccountDetails: FC = () => {
    const exampleUser = {
        firstName: 'Kevin',
        lastName: 'BALABNAL',
        email: 'abc22323@gmail.com',
        contact: '12345678',
        password: '123445',
        credits: '60',
    };

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
                    <a href="">Home</a>
                    <a href="">About</a>
                    <a href="">Credit</a>
                    <a href="">Signout</a>
                </div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.section}>
                    <h1>Account Details</h1>
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Full Name</h5>
                        </div>
                        <div className={styles.info}>
                            {exampleUser.firstName} {exampleUser.lastName}
                        </div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Email</h5>
                        </div>
                        <div className={styles.info}>{exampleUser.email}</div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Phone</h5>
                        </div>
                        <div className={styles.info}>{exampleUser.contact}</div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Password</h5>
                        </div>
                        <div className={styles.info}>
                            {exampleUser.password}
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
                            {exampleUser.credits} / 100 used
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
