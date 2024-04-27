'use client';

import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import styles from '@/components/pages/accountPage/AccountPage.module.css';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import ProgressBar from '@/components/pages/accountPage/ProgressBar/ProgressBar';
import { integer } from 'aws-sdk/clients/cloudfront';
import { FiEdit2 } from 'react-icons/fi';
import { CiCircleCheck } from 'react-icons/ci';
import { IoIosArrowRoundBack } from 'react-icons/io';

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
    const oldPass = useRef(null);
    const newPass = useRef(null);
    const confirmPass = useRef(null);

    // fetch account details
    fetch('https://dash-analytics.solutions/api/v1/user/profile', {
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

    // handle editing password
    const [confirmReset, setConfirmReset] = useState(false);
    const [resetPassSent, setResetPassSent] = useState(false);
    const editPassword = () => {
        // fetch to backend to send password reset email
        // setResetPassSent(true);
    };

    const [completed, setCompleted] = useState(0);
    const [primary, setPrimary] = useState('');
    useEffect(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        setPrimary(rootStyle.getPropertyValue('--primary'));

        const interval = setInterval(() => {
            setCompleted(Math.floor(Math.random() * 100) + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.pageContainer}>
            {resetPassSent && <div className={styles.focusBlur} />}
            {resetPassSent && (
                <div className={styles.passwordChangeContainer}>
                    <IoIosArrowRoundBack
                        className={styles.backButton}
                        onClick={() => {
                            setResetPassSent(false);
                            setConfirmReset(false);
                        }}
                    />
                    <div className={styles.successContent}>
                        <CiCircleCheck className={styles.check} />
                        <p className={styles.successMessage}>
                            An email has been sent to change your password.
                        </p>
                    </div>
                </div>
            )}

            <div className={styles.sidebar}>
                <div className={styles.sidbarContent}>
                    <a href="/">Home</a>
                    <a href="/dashboards">Projects</a>
                    <a href="/learn-more">Learn More</a>
                </div>
            </div>
            <div className={styles.infoContainer}>
                <div className={styles.section}>
                    <h1>Account Details</h1>
                    {/* Add Edit Icon - ADD ON CLICK FUNCTIONALITY*/}
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
                        <div className={styles.info}>{userDetails.email} </div>
                    </div>
                    <hr />
                    <div className={styles.row}>
                        <div className={styles.title}>
                            <h5>Password</h5>
                        </div>
                        <div className={`${styles.pass}`}>
                            {userDetails.password}
                            {confirmReset ? (
                                <PrimaryButton
                                    width="120"
                                    height="50"
                                    className={styles.confirmReset}
                                    onClick={() => setResetPassSent(true)}
                                >
                                    Confirm Reset
                                </PrimaryButton>
                            ) : (
                                <FiEdit2
                                    className={styles.editIcon}
                                    onClick={() => setConfirmReset(true)}
                                />
                            )}
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
                            <h5>Credits Remaining:</h5>
                        </div>
                        <div className={styles.info}>
                            {userDetails.credits} / 100 remaining
                        </div>
                    </div>
                    <div className={styles.info1}>
                        <div className={styles.BarWrapperContainer}>
                            <div className={styles.BarWrapper}>
                                <ProgressBar
                                    bgcolor={primary}
                                    completed={userDetails.credits}
                                />
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
