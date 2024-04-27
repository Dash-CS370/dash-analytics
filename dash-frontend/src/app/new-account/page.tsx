'use client';

import styles from '@/app/new-account/page.module.css';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { NavBar } from '@/components/common/NavBar';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NewAccount() {
    const [errorMessage, setErrorMessage] = useState<string>(''); // handles form input errors

    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');

    // handle form submission for creating a new account
    const router = useRouter();
    const handleCreateAccount = (event: React.FormEvent) => {
        event.preventDefault();

        const form = document.getElementById(
            'createAccountForm',
        ) as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement)
            .value;
        const name = (form.elements.namedItem('name') as HTMLInputElement)
            .value;
        const password = (
            form.elements.namedItem('password') as HTMLInputElement
        ).value;
        const confirmPassword = (
            form.elements.namedItem('confirmPassword') as HTMLInputElement
        ).value;

        setErrorMessage('');
        if (!email || !name || !password || !confirmPassword) {
            let missingFields = [];
            if (!email) missingFields.push('Email');
            if (!name) missingFields.push('name');
            if (!password) missingFields.push('Password');
            if (!confirmPassword) missingFields.push('Confirm Password');

            setErrorMessage(
                `The following fields are required: ${missingFields.join(
                    ', ',
                )}`,
            );
            return;
        }

        // TODO: validate email format
        // TODO: validate password format & confirm password match

        // --> set error message if unsuccessful and return before redirecting
        fetch('https://dash-analytics.solutions/auth/register-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                name,
                password,
            }),
        })
            .then((response) => {
                // redirect to signin options page
                if (response.status == 201) {
                    router.push('/signin');
                } else if (response.status == 400) {
                    response.text().then((text) => {
                        setErrorMessage(text);
                    });
                } else if (response.status == 500) {
                    setErrorMessage('Error creating account, try again.');
                } else {
                    setErrorMessage('Error creating account, try again.');
                }
            })
            .catch((error) => {
                setErrorMessage('Error communicating with server, try again.');
                console.error(error);
            });
    };

    return (
        <main className={styles.main}>
            <NavBar connected={false} />

            <BaseForm title="Create New Account" width="400px" height="560px">
                <form id="createAccountForm" className={styles.content}>
                    {emailParam ? (
                        <TextInput
                            id="email"
                            className={styles.textInput}
                            // defText="Email"
                            width="325px"
                            value={emailParam}
                        />
                    ) : (
                        <TextInput
                            id="email"
                            className={styles.textInput}
                            defText="Email"
                            width="325px"
                        />
                    )}
                    <TextInput
                        id="name"
                        className={styles.textInput}
                        defText="Name"
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
                        By Creating an Account your are Agreeing to our{' '}
                        <a href="/terms-and-conditions">
                            Terms of Services & Privacy Policy
                        </a>
                    </p>
                </form>
            </BaseForm>
        </main>
    );
}
