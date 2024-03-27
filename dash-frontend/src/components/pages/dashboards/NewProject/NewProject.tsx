import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { FiUpload } from 'react-icons/fi';

interface NewProjectProps {
    onUploadClick: () => void;
    titleAndDescription: (title: string, description: string) => void;
}

export const NewProject: React.FC<NewProjectProps> = ({
    onUploadClick,
    titleAndDescription,
}) => {
    const handleNext = (e: React.FormEvent) => {
        const form = document.getElementById(
            'nameAndDescription',
        ) as HTMLFormElement;
        const name = (
            form.elements.namedItem('projectName') as HTMLInputElement
        ).value;
        const description = (
            form.elements.namedItem('projectDescription') as HTMLInputElement
        ).value;

        titleAndDescription(name, description);
    };

    return (
        <div className={styles.content}>
            <h1 className={styles.dashboardTitle}>New Dashboard</h1>
            <div className={styles.horizontalLine} />

            <h2 className={styles.uploadHeader}>Upload a CSV</h2>
            <div className={styles.uploadContainer} onClick={onUploadClick}>
                <FiUpload className={styles.icon} />
            </div>

            <form id="nameAndDescription" className={styles.form}>
                <label className={styles.formLabel} htmlFor="projectName">
                    Project Name:
                </label>
                <input
                    className={styles.formInput}
                    type="text"
                    id="projectName"
                    name="projectName"
                    required
                />

                <label
                    className={styles.formLabel}
                    htmlFor="projectDescription"
                >
                    Project Description:
                </label>
                <textarea
                    className={styles.formDescription}
                    id="projectDescription"
                    name="projectDescription"
                    required
                />
                <button
                    type="submit"
                    className={styles.submitButton}
                    onClick={handleNext}
                >
                    Next
                </button>
            </form>
        </div>
    );
};
