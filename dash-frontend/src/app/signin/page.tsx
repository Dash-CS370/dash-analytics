'use client';

import styles from '@/app/signin/page.module.css';
import { TextInput } from '@/components/TextInput/TextInput';
import { BaseForm } from '@/components/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import { useState } from 'react';
import Image from 'next/image';

export default function Signin() {
    // true = signin; false = authenticate
    let [signinState, setSigninState] = useState(true);

    const handleToggle: React.MouseEventHandler<HTMLButtonElement> = (
        event,
    ) => {
        setSigninState(!signinState);
    };

    // signin
    if (signinState) {
        return (
            <main className={styles.main}>
                <div className={styles.content}>
                    <BaseForm width="425px" height="500px">
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
                        <form
                            action="http://auth-server:9000/login"
                            method="post"
                            className={styles.form}
                        >
                            <TextInput
                                className={styles.textInput}
                                defText="Enter Email"
                                width="18rem"
                                id="email"
                            />
                            <TextInput
                                className={styles.textInput}
                                defText="Enter Password"
                                width="18rem"
                                id="password"
                                type="password"
                            />
                            <button
                                className={styles.buttonFormat}
                                type="submit"
                            >
                                Sign In
                            </button>
                        </form>
                        <div className={styles.lineFormat}>
                            <div className={styles.linePos} />
                            <p>or</p>
                            <div className={styles.linePos} />
                        </div>
                        <PrimaryButton
                            className={styles.buttonFormatGoogle}
                            href="/login"
                            width="250px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account Using
                                <Image
                                    src="google.svg"
                                    alt="Google Logo"
                                    width="35"
                                    height="35"
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
