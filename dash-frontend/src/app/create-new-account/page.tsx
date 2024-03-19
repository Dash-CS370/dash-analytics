import styles from '@/app/create-new-account/page.module.css';
import { BaseForm } from '@/components/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import { TextInput } from '@/components/TextInput/TextInput';

export default function CreateNewAccount() {
    return (
        <main className={styles.main}>
            <BaseForm title="Create New Account" width="400px" height="600px">
                <div className={styles.content}>
                    <p className={styles.fieldTitle}>Email</p>
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Here"
                        width="325px"
                    />

                    <p className={styles.fieldTitle}>Username</p>
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Here"
                        width="325px"
                    />

                    <p className={styles.fieldTitle}>Password</p>
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Here"
                        width="325px"
                    />

                    <p className={styles.fieldTitle}>Confirm Password</p>
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Here"
                        width="325px"
                    />
                </div>
                <PrimaryButton className={styles.buttonFormat} href="/login">
                    Create Account
                </PrimaryButton>
                <hr className={styles.lineFormat}></hr>
                <p className={styles.warningFormat}>
                    By Creating an Account your are Agreeing to our Terms and
                    Services & our Privacy Policy
                </p>
            </BaseForm>
        </main>
    );
}
