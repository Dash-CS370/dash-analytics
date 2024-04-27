'use client';

import styles from '@/app/create-account/page.module.css';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { NavBar } from '@/components/common/NavBar';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { SecondaryButton } from '@/components/common/buttons/SecondaryButton/SecondaryButton';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

// create account options page - user can create an account with dash or with google, microsoft, etc
export default function CreateAccount() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <main className={styles.main}>
            <NavBar connected={false} />

            <div className={styles.content}>
                <BaseForm
                    title="Create Your Account"
                    width="425px"
                    height="375px"
                >
                    <PrimaryButton
                        className={styles.buttonFormatOne}
                        href={`/new-account?email=${email}`}
                    >
                        Create Account
                    </PrimaryButton>
                    <div className={styles.lineFormat}>
                        <div className={styles.linePos} />
                        <p>or</p>
                        <div className={styles.linePos} />
                    </div>
                    <div className={styles.signinOpts}>
                        <SecondaryButton
                            className={styles.buttonFormatTwo}
                            href="/login"
                            width="300px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account With
                                <Image
                                    src="assets/google.svg"
                                    alt="Google Logo"
                                    width="30"
                                    height="30"
                                />
                            </div>
                        </SecondaryButton>
                        <SecondaryButton
                            className={styles.buttonFormatTwo}
                            href="/login"
                            width="300px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account With
                                <Image
                                    src="assets/microsoft.svg"
                                    alt="Microsoft Logo"
                                    width="20"
                                    height="20"
                                />
                            </div>
                        </SecondaryButton>
                    </div>
                </BaseForm>
            </div>
        </main>
    );
}
