'use client';

import styles from '@/app/request-access/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useState } from 'react';
import { NavBar } from '@/components/common/NavBar';
import { CiCircleCheck } from 'react-icons/ci';

export default function RequestAccess() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [accessRequested, setAccessRequested] = useState<boolean>(false);

    // handle hitting enter for email input
    const handleEnterForEmail = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            handleRequestAccess(event);
        }
    };

    // handle form submission for requesting access
    const handleRequestAccess = (event: React.FormEvent) => {
        event.preventDefault();

        // handle empty email
        if (email === '') {
            setErrorMessage('Email is required');
            return;
        }
        // handle invalid email format
        if (!email.includes('@') || !email.includes('.')) {
            setErrorMessage('Invalid email format');
            setEmail('');
            return;
        }
        setErrorMessage('');

        fetch(
            `https://dash-analytics.solutions/auth/request-access?email=${email}`,
            {
                method: 'GET',
            },
        )
            .then((response) => {
                setAccessRequested(true);
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Error requesting access');
            });
    };

    if (accessRequested) {
        return (
            <main className={styles.main}>
                <NavBar connected={false} />

                <div className={styles.content}>
                    <BaseForm
                        title="Request Access"
                        width="350px"
                        height="450px"
                    >
                        <div className={styles.successContent}>
                            <CiCircleCheck className={styles.check} />
                            <p className={styles.successMessage}>
                                Access requested successfully! You will receive
                                an email with an activation key upon approval.
                            </p>
                        </div>
                        <PrimaryButton
                            href="/signin?activate=true"
                            width="180px"
                            className={styles.activateBtn}
                        >
                            Activate Account
                        </PrimaryButton>
                    </BaseForm>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <NavBar connected={false} />

            <div className={styles.content}>
                <BaseForm title="Request Access" width="350px" height="450px">
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Email"
                        onKeyDown={handleEnterForEmail}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    {errorMessage === '' ? (
                        <div className={styles.errorMessage}></div>
                    ) : (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    <PrimaryButton
                        className={styles.buttonFormat}
                        onClick={handleRequestAccess}
                    >
                        Request Access
                    </PrimaryButton>

                    <p className={styles.subtext}>
                        An activation key will be sent upon approval
                    </p>
                    <div className={styles.line}></div>
                    <p className={styles.subtext}>
                        If you&apos;re a returning user:
                    </p>
                    <div className={styles.signinOpts}>
                        <PrimaryButton
                            className={styles.buttonFormat}
                            href="/signin?activate=true"
                            width="150px"
                        >
                            Activate Account
                        </PrimaryButton>
                        <PrimaryButton
                            className={styles.buttonFormat}
                            href="/signin"
                            width="150px"
                        >
                            Login
                        </PrimaryButton>
                    </div>
                </BaseForm>
            </div>
        </main>
    );
}
