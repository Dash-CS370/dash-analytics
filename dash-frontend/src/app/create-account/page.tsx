import styles from '@/app/create-account/page.module.css';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { SecondaryButton } from '@/components/common/buttons/SecondaryButton/SecondaryButton';
import Image from 'next/image';

export default function CreateAccount() {
    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm
                    title="Create Your Account"
                    width="425px"
                    height="375px"
                >
                    <PrimaryButton
                        className={styles.buttonFormatOne}
                        href="/new-account"
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
                                    src="google.svg"
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
                                    src="microsoft.svg"
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
