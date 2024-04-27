import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { ColumnInfo } from '@/components/pages/dashboards/NewProject/NewProject';
import { ColumnDescription } from '@/components/pages/dashboards/NewProject/ColumnDescription';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { IoIosArrowRoundBack } from 'react-icons/io';
import Link from 'next/link';

interface ColumnFormProps {
    columns: ColumnInfo[];
    errorMessage: string;
    handleDescriptionChange: (index: number, value: string) => void;
    handleCreateDashboard: (e: React.FormEvent) => void;
    handleBackButton: () => void;
    handleDropdownChange: (index: number, value: string) => void;
    handleDeleteCol: (colName: string) => void;
}

export const ColumnForm: React.FC<ColumnFormProps> = ({
    columns,
    errorMessage,
    handleDescriptionChange,
    handleCreateDashboard,
    handleBackButton,
    handleDropdownChange,
    handleDeleteCol,
}) => {
    return (
        <div className={styles.content}>
            <div className={styles.headerContainer}>
                <IoIosArrowRoundBack
                    className={styles.backButton}
                    onClick={handleBackButton}
                />
                <h1 className={styles.dashboardTitle}>
                    Describe your dataset...
                </h1>
                <div className={styles.spacer}></div>
            </div>
            <p className={styles.fileType}>
                Provide a description of each column
            </p>
            <form
                id="columnNames"
                className={styles.content}
                style={{ marginTop: '0' }}
            >
                {columns.map((column, index) => (
                    <ColumnDescription
                        key={index.toFixed()}
                        columnMetadata={{
                            colName: column.colName,
                            dataType: column.dataType,
                            description: column.description,
                            userType: column.userType,
                        }}
                        id={index}
                        handleDescriptionChange={(value) =>
                            handleDescriptionChange(index, value)
                        }
                        handleDropdownChange={(value) =>
                            handleDropdownChange(index, value)
                        }
                        handleDelete={handleDeleteCol}
                    />
                ))}
                {errorMessage !== '' && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
                <div style={{ height: '50px' }}>
                    <PrimaryButton
                        className={styles.submitButton}
                        onClick={handleCreateDashboard}
                    >
                        Create Dashboard
                    </PrimaryButton>
                </div>
            </form>
            <p className={styles.disclaimer}>
                Data visualizations are limited by the quality of the dataset.
                By continuing, you are agreeing to our terms of use.
                {/* <Link href="/terms-of-service">terms of use.</Link> */}
            </p>
        </div>
    );
};
