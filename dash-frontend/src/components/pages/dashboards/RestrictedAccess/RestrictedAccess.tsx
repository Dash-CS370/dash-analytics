import { NavBar } from '@/components/common/NavBar';
import styles from '@/components/pages/dashboards/RestrictedAccess/RestrictedAccess.module.css';

export const RestrictedAccess: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <NavBar connected={true} />
            <div className={styles.restrictedAccess}>
                <h1 className={styles.title}>Sorry...</h1>
                <p className={styles.description}>
                    Unfortunately, the dashboard experience is not yet optimized
                    for mobile devices or small windows. If you are on a
                    desktop, try resizing your window.
                </p>
            </div>
        </div>
    );
};
