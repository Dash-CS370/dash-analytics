import styles from '@/components/pages/LoadingPage/LoadingPage.module.css';
import { FC } from 'react';
import { CgSpinner } from 'react-icons/cg';

export const LoadingPage: FC = () => {
    return (
        <div className={styles.loadingContainer}>
            <CgSpinner className={styles.spinner} />
            <p>Loading...</p>
        </div>
    );
};
