import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { FiUpload } from 'react-icons/fi';

// interface NewProjectProps {
//     onUploadClick: () => void;
//     titleAndDescription: (title: string, description: string) => void;
// }

export const NewProject: React.FC = () => {
    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();

        const form = document.getElementById(
            'nameAndDescription',
        ) as HTMLFormElement;
        const name = (
            form.elements.namedItem('projectName') as HTMLInputElement
        ).value;
        const description = (
            form.elements.namedItem('projectDescription') as HTMLInputElement
        ).value;

        console.log(name, description);

        async function fetchData() {
            const response = await fetch(
                `http://127.0.0.1/api/gpt/${description}`,
            );
            const result = await response.json();
            console.log(result);
        }

        fetchData();
    };

    // TODO: work with george to get loaded file
    // --> scan file in danfo, clean data, get column names and datatypes
    const handleFileUpload = () => {};

    return (
        <div className={styles.content}>
            <h1 className={styles.dashboardTitle}>New Dashboard</h1>
            <div className={styles.horizontalLine} />

            <h2 className={styles.uploadHeader}>Upload a CSV</h2>
            <div className={styles.uploadContainer} onClick={handleFileUpload}>
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
