'use client';

import styles from '@/app/request-access/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useState } from 'react';

export default function RequestAccess() {
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

        // TODO: send email to backend
        console.log(email);
    };

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm title="Request Access" width="350px" height="450px">
                    {/* <form className={styles.form} id="request-form"> */}
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
                    {/* </form> */}
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
                            href="/signin"
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
