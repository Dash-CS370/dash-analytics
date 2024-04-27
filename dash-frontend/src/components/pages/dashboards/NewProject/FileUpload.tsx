import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { FiUpload } from 'react-icons/fi';
import { CiCircleCheck } from 'react-icons/ci';
import Link from 'next/link';

interface FileUploadProps {
    file: File | null;
    projectName: string;
    projectDescription: string;
    errorMessage: string;
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: (e: React.FormEvent) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    handleFileSelect,
    handleNext,
    file,
    projectName,
    projectDescription,
    errorMessage,
}) => {
    return (
        <div className={`${styles.content} ${styles.newDashboard}`}>
            <div className={styles.newProjectContainer}>
                <h1>New Dashboard</h1>
                <div className={styles.horizontalLine}></div>

                <h2 className={styles.header}>Upload a CSV</h2>

                <form id="nameAndDescription" className={styles.form}>
                    <div
                        className={styles.uploadContainer}
                        onClick={() =>
                            document.getElementById('fileUpload')?.click()
                        }
                    >
                        <input
                            type="file"
                            id="fileUpload"
                            style={{ display: 'none' }}
                            accept=".csv"
                            onChange={handleFileSelect}
                            required
                        />
                        {file == null ? (
                            <FiUpload className={styles.icon} />
                        ) : (
                            <CiCircleCheck className={styles.check} />
                        )}
                    </div>
                    <p className={styles.fileType}>
                        {file != null
                            ? `Uploaded: ${file.name}`
                            : 'Must be a .csv'}
                    </p>

                    <label className={styles.formLabel} htmlFor="projectName">
                        Project Name:
                    </label>
                    <input
                        className={styles.formInput}
                        type="text"
                        id="projectName"
                        name="projectName"
                        defaultValue={projectName}
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
                        defaultValue={projectDescription}
                        required
                    />
                    {errorMessage !== '' && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    <PrimaryButton
                        className={styles.submitButton}
                        onClick={handleNext}
                    >
                        Next
                    </PrimaryButton>
                </form>
            </div>
            <p className={styles.disclaimer}>
                Data visualizations are limited by the quality of the dataset.
                By continuing, you are agreeing to our terms of use.
                {/* <Link href="/terms-of-service">terms of use.</Link> */}
            </p>
        </div>
    );
};
