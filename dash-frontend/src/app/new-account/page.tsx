'use client';

import styles from '@/app/new-account/page.module.css';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { useState } from 'react';

export default function NewAccount() {
    const [errorMessage, setErrorMessage] = useState<string>(''); // handles form input errors

    const handleCreateAccount = (event: React.FormEvent) => {
        event.preventDefault();

        const form = document.getElementById(
            'createAccountForm',
        ) as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement)
            .value;
        const username = (
            form.elements.namedItem('username') as HTMLInputElement
        ).value;
        const password = (
            form.elements.namedItem('password') as HTMLInputElement
        ).value;
        const confirmPassword = (
            form.elements.namedItem('confirmPassword') as HTMLInputElement
        ).value;

        if (!email || !username || !password || !confirmPassword) {
            let missingFields = [];
            if (!email) missingFields.push('Email');
            if (!username) missingFields.push('Username');
            if (!password) missingFields.push('Password');
            if (!confirmPassword) missingFields.push('Confirm Password');

            setErrorMessage(
                `The following fields are required: ${missingFields.join(
                    ', ',
                )}`,
            );
            return;
        }

        // TODO: send request to create account
        console.log(email, username, password);
    };

    return (
        <main className={styles.main}>
            <BaseForm title="Create New Account" width="400px" height="560px">
                <form id="createAccountForm" className={styles.content}>
                    <TextInput
                        id="email"
                        className={styles.textInput}
                        defText="Email"
                        width="325px"
                    />
                    <TextInput
                        id="username"
                        className={styles.textInput}
                        defText="Username"
                        width="325px"
                    />
                    <TextInput
                        id="password"
                        className={styles.textInput}
                        defText="Password"
                        width="325px"
                    />
                    <TextInput
                        id="confirmPassword"
                        className={styles.textInput}
                        defText="Confirm Password"
                        width="325px"
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
                        // href="/dashboard"
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </PrimaryButton>
                    <p className={styles.warningFormat}>
                        **By Creating an Account your are Agreeing to our{' '}
                        <a href="/terms-and-conditions">
                            Terms of Services & Privacy Policy
                        </a>
                    </p>
                </form>
            </BaseForm>
        </main>
    );
}
