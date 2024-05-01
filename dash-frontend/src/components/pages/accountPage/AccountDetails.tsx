'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/pages/accountPage/AccountPage.module.css';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import ProgressBar from '@/components/pages/accountPage/ProgressBar/ProgressBar';
import { integer } from 'aws-sdk/clients/cloudfront';
import { CiCircleCheck } from 'react-icons/ci';
import { IoIosArrowRoundBack } from 'react-icons/io';

export interface UserDetails {
    id: string;
    name: string;
    email: string;
    credits: integer;
    creationDate: string;
}

export const AccountDetails: FC = () => {
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState('');

    const [userDetails, setUserDetails] = useState<UserDetails>({
        id: '',
        name: 'John Smith',
        email: 'johnsmith@gmail.com',
        credits: 60,
        creationDate: '',
    });

    const [resetPassSent, setResetPassSent] = useState(false);

    // Effect for fetching account details only on component mount
    useEffect(() => {
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
    }, []); // Ensures this runs only once on mount

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteAccount = () => {
        fetch('https://dash-analytics.solutions/api/v1/user/account', {
            method: 'DELETE',
            headers: {
                credentials: 'include',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setDeleteStatus('Account successfully deleted');
                    router.push('/');
                } else {
                    setDeleteStatus('Failed to delete account');
                }
            })
            .catch((error) => {
                setDeleteStatus(`Error: ${error}`);
            })
            .finally(() => {
                setShowDeleteConfirm(false);
            });
    };

    const handlePasswordReset = () => {
        fetch('https://dash-analytics.solutions/api/v1/password/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: userDetails.email,
        })
            .then(() => {
                setResetPassSent(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
                <div className={styles.sidebarContent}>
                    <a href="/">Home</a>
                    <a href="/dashboards">Projects</a>
                    <a href="/learn-more">Learn More</a>
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
                    <br />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <PrimaryButton
                            width="475px"
                            height="50px"
                            className={styles.button}
                            onClick={handlePasswordReset}
                        >
                            Reset Password
                        </PrimaryButton>
                        <PrimaryButton
                            width="475px"
                            height="50px"
                            className={styles.button}
                            onClick={handleDeleteClick}
                        >
                            Delete Account
                        </PrimaryButton>
                    </div>
                    <br />
                </div>
                <br />
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
            {showDeleteConfirm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Confirm Account Deletion</h2>
                        <p>
                            Are you sure you want to delete your account? This
                            action cannot be undone.
                        </p>
                        <div>
                            <PrimaryButton
                                className={styles.button}
                                onClick={handleDeleteAccount}
                            >
                                Confirm Delete
                            </PrimaryButton>
                            <PrimaryButton
                                className={styles.button}
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </PrimaryButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
