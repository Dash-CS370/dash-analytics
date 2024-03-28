import styles from '@/app/request-access/page.module.css';
import { TextInput } from '@/components/common/TextInput/TextInput';
import { BaseForm } from '@/components/common/BaseForm/BaseForm';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';

export default function RequestAccess() {
    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <BaseForm title="Request Access" width="350px" height="425px">
                    <TextInput
                        className={styles.textInput}
                        defText="Enter Email"
                    />
                    <PrimaryButton
                        className={styles.buttonFormat}
                        href="/login"
                        /*
                            ADD POP UP THAT SAYS 
                            'ACCESS SUCCESSFULLY REQUESTED... CHECK EMAIL'
                        */
                    >
                        Request Access
                    </PrimaryButton>
                    <p className={styles.subtext}>
                        Your activation key will be sent to your email upon
                        approval
                    </p>
                    <hr />
                    <p className={styles.subtext}>
                        If you already have an activation key or an account:
                    </p>
                    <div className={styles.signinOpts}>
                        <PrimaryButton
                            className={styles.buttonFormat}
                            href="/signin"
                            width="150px"
                        >
                            Activate Account
                        </PrimaryButton>
                        <PrimaryButton
                            className={styles.buttonFormat}
                            href="/signin"
                            width="150px"
                        >
                            Login
                        </PrimaryButton>
                    </div>
                </BaseForm>
            </div>
        </main>
    );
}
