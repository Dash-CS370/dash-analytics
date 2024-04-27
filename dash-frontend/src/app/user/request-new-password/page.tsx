'use client';

import styles from '@/app/user/request-new-password/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useState } from 'react';

export default function RequestNewPassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // handle hitting enter for email input
    const handleEnterForEmail = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            handleRequestChange(event);
        }
    };

    // handle form submission for requesting a new password
    const handleRequestChange = (event: React.FormEvent) => {
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

        // send email to backend
        fetch('https://dash-analytics.solutions/api/v1/password/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: email,
        })
            .then(() => {
                window.location.href = '/start';
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrorMessage(
                    'Error sending password reset email. Try again.',
                );
            });
    };

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm
                    title="Forgot Your Password?"
                    width="350px"
                    height="450px"
                >
                    <p className={styles.subtext_top}>
                        Enter the email address linked with your account and
                        we&apos;ll send you a link to reset your password.
                    </p>
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Email"
                        width="250px"
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
                        onClick={handleRequestChange}
                    >
                        Continue
                    </PrimaryButton>
                    <div className={styles.line}></div>
                    <p className={styles.subtext}>
                        By proceeding, you agree to Dash Analytics Privacy
                        Policy and Terms of Service.
                    </p>
                </BaseForm>
            </div>
        </main>
    );
}
