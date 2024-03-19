import styles from '@/app/create-account-opts/page.module.css';
import { BaseForm } from '@/components/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import Image from 'next/image';

export default function CreateAccountOpts() {
    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm
                    title="Create Your Account"
                    width="425px"
                    height="365px"
                >
                    <PrimaryButton
                        className={styles.buttonFormatOne}
                        href="/create-new-account"
                    >
                        Create New Account
                    </PrimaryButton>
                    <div className={styles.lineFormat}>
                        <div className={styles.linePos} />
                        <p>or</p>
                        <div className={styles.linePos} />
                    </div>
                    <div className={styles.signinOpts}>
                        <PrimaryButton
                            className={styles.buttonFormatTwo}
                            href="/login"
                            width="300px"
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
                        <PrimaryButton
                            className={styles.buttonFormatTwo}
                            href="/login"
                            width="300px"
                        >
                            <div className={styles.createAccountOptsFormat}>
                                Create Account Using
                                <Image
                                    src="microsoft.svg"
                                    alt="Microsoft Logo"
                                    width="25"
                                    height="25"
                                />
                            </div>
                        </PrimaryButton>
                    </div>
                </BaseForm>
            </div>
        </main>
    );
}
