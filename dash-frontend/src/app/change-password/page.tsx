'use client';

import styles from '@/app/change-password/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useState } from 'react';

export default function ChangePassword() {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleEnterForEmail = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (event.key === 'Enter') {
            handleRequestAccess(event);
        }
    };

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

        // TODO: password formatting

        // TODO: send email to backend
        console.log(email);
    };

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm
                    title="Forgot Your Password?"
                    width="350px"
                    height="500px"
                >
                    {/* <form className={styles.form} id="request-form"> */}
                    <div className={styles.textFields}>
                        <TextInput
                            // className={styles.textInput}
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
                        <TextInput
                            // className={styles.textInput}
                            defText="Enter New Password"
                            // onKeyDown={handleEnterForEmail}
                            // onChange={(event) => setEmail(event.target.value)}
                        />
                        {errorMessage === '' ? (
                            <div className={styles.errorMessage}></div>
                        ) : (
                            <div className={styles.errorMessage}>
                                {errorMessage}
                            </div>
                        )}
                        <TextInput
                            // className={styles.textInput}
                            defText="Confirm New Password"
                            // onKeyDown={handleEnterForEmail}
                            // onChange={(event) => setEmail(event.target.value)}
                        />
                        {errorMessage === '' ? (
                            <div className={styles.errorMessage}></div>
                        ) : (
                            <div className={styles.errorMessage}>
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    <PrimaryButton
                        className={styles.buttonFormat}
                        onClick={handleRequestAccess}
                    >
                        Change Password
                    </PrimaryButton>
                    {/* </form> */}
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
