'use client';

import styles from '@/app/signin/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SigninButton } from '@/components/common/SigninButton/SigninButton';
import { NavBar } from '@/components/common/NavBar';
import { useSearchParams } from 'next/navigation';

export default function Signin() {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false);
    const [signinState, setSigninState] = useState(true); // true = signin; false = authenticate
    const [errorMessage, setErrorMessage] = useState<string>(''); // handles form input errors
    const [activationKey, setActivationKey] = useState<string>(''); // activation key input

    const searchParams = useSearchParams();
    const activate = searchParams.get('activate');
    useEffect(() => {
        if (activate && activate === 'true') {
            setSigninState(false);
        } else {
            setSigninState(true);
        }
        setPageLoaded(true);
    }, [activate]);

    // Toggle between sign-in and activation views
    const handleToggle = () => {
        setSigninState(!signinState);
    };

    const handleActivation = () => {
        // handle empty activation key
        if (activationKey === '') {
            setErrorMessage('Activation key is required');
            return;
        }
        setErrorMessage('');

        // TODO: validate activation key, set error message if invalid
        console.log(activationKey);

        window.location.href = '/create-account'; // redirect to create account page (include activation key as arg if needed)
    };

    // signin
    if (signinState) {
        return (
            <main className={styles.main}>
                <NavBar connected={false} />

                <div className={styles.content}>
                    <BaseForm width="425px" height="530px">
                        <div className={styles.toggleButtonStyle}>
                            <PrimaryButton
                                className={
                                    styles.toggleButtonFormat_SignIn_SignInView
                                }
                            >
                                Sign In
                            </PrimaryButton>

                            <PrimaryButton
                                className={
                                    styles.toggleButtonFormat_Activate_SignInView
                                }
                                onClick={handleToggle}
                            >
                                Activate
                            </PrimaryButton>
                        </div>

                        <h1 className={styles.SignInTitle}>Sign In</h1>

                        <SigninButton
                            className={styles.signinWithDash}
                            buttonText="Login with"
                            href="http://127.0.0.1:8080/oauth2/authorization/Dash"
                            imgSrc="assets/DashLogo.svg"
                            alt="Dash Logo"
                            imgWidth={30}
                            imgHeight={30}
                        />

                        <div className={styles.lineFormat}>
                            <div className={styles.line} />
                            <p>or</p>
                            <div className={styles.line} />
                        </div>

                        <div className={styles.externalAccountOpts}>
                            <SigninButton
                                buttonText="Login with"
                                href="http://127.0.0.1:8080/oauth2/authorization/google"
                                imgSrc="assets/google.svg"
                                alt="Google Logo"
                                imgWidth={35}
                                imgHeight={35}
                            />

                            <SigninButton
                                buttonText="Login with"
                                href="http://127.0.0.1:8080/oauth2/authorization/Microsoft"
                                imgSrc="assets/microsoft.svg"
                                alt="Microsoft Logo"
                                imgWidth={22.5}
                                imgHeight={22.5}
                            />

                            <SigninButton
                                buttonText="Login with"
                                href="http://127.0.0.1:8080/oauth2/authorization/github"
                                imgSrc="assets/github.svg"
                                alt="Github Logo"
                                imgWidth={25}
                                imgHeight={25}
                            />
                        </div>
                    </BaseForm>
                </div>
            </main>
        );
    }

    // authenticate
    return (
        <main className={styles.main}>
            <NavBar connected={false} />

            <div className={styles.content}>
                <BaseForm width="425px" height="500px">
                    <div className={styles.toggleButtonStyle}>
                        <PrimaryButton
                            className={
                                styles.toggleButtonFormat_SignIn_ActivateView
                            }
                            onClick={handleToggle}
                        >
                            Sign In
                        </PrimaryButton>

                        <PrimaryButton
                            className={
                                styles.toggleButtonFormat_Activate_ActivateView
                            }
                        >
                            Activate
                        </PrimaryButton>
                    </div>

                    <h1 className={styles.SignInTitle}>Activate Account</h1>
                    <TextInput
                        className={styles.textInput}
                        id="activation-key-input"
                        defText="Enter Activation Key"
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleActivation();
                            }
                        }}
                        onChange={(event) =>
                            setActivationKey(event.target.value)
                        }
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
                        onClick={handleActivation}
                        width="250px"
                    >
                        Use Activation Key
                    </PrimaryButton>
                    <div
                        className={styles.line}
                        style={{ width: '75%', margin: '1rem 0' }}
                    ></div>
                    <p className={styles.smallText}>
                        Don’t have an activation key? Request access here:
                    </p>
                    <PrimaryButton
                        className={styles.buttonFormat}
                        href="/request-access"
                        width="250px"
                    >
                        Request Access
                    </PrimaryButton>
                </BaseForm>
            </div>
        </main>
    );
}
