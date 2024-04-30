'use client';

import styles from '@/app/user/change-password/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ChangePassword() {
    const [token, setToken] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // get token from URL
    const searchParams = useSearchParams();
    let t = searchParams.get('token');
    useEffect(() => {
        if (!t) {
            window.location.href = '/user/request-new-password';
            t = '';
        }
        setToken(t);
    }, [t]);

    // handle form submission for changing password
    const handleChangePassword = (event: React.FormEvent) => {
        event.preventDefault();

        // password checks
        if (pass === '') {
            setErrorMessage('Password is required');
            return;
        }
        if (confirmPass === '') {
            setErrorMessage('Confirm Password is required');
            return;
        }
        if (pass !== confirmPass) {
            setErrorMessage('Passwords do not match');
            return;
        }

        const formData = new FormData();

        formData.append('token', token);
        formData.append('new-password', pass);
        formData.append('confirmed-password', confirmPass);

        fetch(
            'https://dash-analytics.solutions/api/v1/password/reset-password',
            {
                method: 'POST',
                body: formData, // Note: No 'Content-Type' header is needed
            },
        ).then((response) => {
            if (response.ok) {
                window.location.href = '/signin';
            } else {
                setErrorMessage('Error changing password. Try again.');
            }
        });
    };

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm
                    title="Forgot Your Password?"
                    width="350px"
                    height="420px"
                >
                    <div className={styles.textFields}>
                        <TextInput
                            defText="Enter New Password"
                            onChange={(event) => setPass(event.target.value)}
                        />
                        <TextInput
                            defText="Confirm New Password"
                            onChange={(event) =>
                                setConfirmPass(event.target.value)
                            }
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
                        onClick={handleChangePassword}
                    >
                        Change Password
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
