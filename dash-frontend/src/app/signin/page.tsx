'use client';

import styles from '@/app/signin/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { useState } from 'react';
import Image from 'next/image';

export default function Signin() {
    const [signinState, setSigninState] = useState(true); // true = signin; false = authenticate

    // Toggle between sign-in and activation views
    const handleToggle = () => {
        setSigninState(!signinState);
    };

    // signin
    if (signinState) {
        return (
            <main className={styles.main}>
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

                        <div className={styles.SignInTextStyle}>Sign In</div>

                        <PrimaryButton
                            className={styles.buttonFormatGoogle}
                            href="http://127.0.0.1:8080/oauth2/authorization/Dash"
                            width="280px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Login with Existing Account
                                <Image
                                    src="DashLogo.svg"
                                    width="35"
                                    height="33"
                                    alt="Dash Logo"
                                />
                            </div>
                        </PrimaryButton>

                        <div className={styles.lineFormat}>
                            <div className={styles.linePos} />
                            <p>or</p>
                            <div className={styles.linePos} />
                        </div>

                        <PrimaryButton
                            className={styles.buttonFormatGoogle}
                            href="http://127.0.0.1:8080/oauth2/authorization/google"
                            width="250px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account Using
                                <Image
                                    src="google.svg"
                                    alt="Google Logo"
                                    width="36"
                                    height="38"
                                />
                            </div>
                        </PrimaryButton>

                        <PrimaryButton
                            className={styles.buttonFormatGoogle}
                            href="http://127.0.0.1:8080/oauth2/authorization/Microsoft"
                            width="250px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account Using
                                <Image
                                    src="microsoft.svg"
                                    width="30"
                                    height="30"
                                    alt="Microsoft Logo"
                                />
                            </div>
                        </PrimaryButton>

                        <PrimaryButton
                            className={styles.buttonFormatGoogle}
                            href="http://127.0.0.1:8080/oauth2/authorization/github"
                            width="250px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account Using
                                <Image
                                    src="github.svg"
                                    width="35"
                                    height="35"
                                    alt="Github Logo"
                                />
                            </div>
                        </PrimaryButton>
                    </BaseForm>
                </div>
            </main>
        );
    }

    // authenticate
    return (
        <main className={styles.main}>
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

                    <div className={styles.SignInTextStyle}>
                        Activate Account
                    </div>
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Activation Key"
                        width="18rem"
                    />
                    <PrimaryButton
                        className={styles.buttonFormat}
                        href="/create-account-opts"
                        width="250px"
                    >
                        Use Activation Key
                    </PrimaryButton>
                    <hr className={styles.lineFormat}></hr>
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
