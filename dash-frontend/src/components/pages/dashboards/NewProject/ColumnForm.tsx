import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { ColumnInfo } from '@/components/pages/dashboards/NewProject/NewProject';
import { ColumnDescription } from '@/components/pages/dashboards/NewProject/ColumnDescription';
import { PrimaryButton } from '@/components/common/buttons/PrimaryButton/PrimaryButton';
import { IoIosArrowRoundBack } from 'react-icons/io';

interface ColumnFormProps {
    columns: ColumnInfo[];
    errorMessage: string;
    handleDescriptionChange: (index: number, value: string) => void;
    handleCreateDashboard: (e: React.FormEvent) => void;
    handleBackButton: () => void;
}

export const ColumnForm: React.FC<ColumnFormProps> = ({
    columns,
    errorMessage,
    handleDescriptionChange,
    handleCreateDashboard,
    handleBackButton,
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
                            description: '',
                        }}
                        id={index}
                        handleDescriptionChange={(value) =>
                            handleDescriptionChange(index, value)
                        }
                    />
                ))}
                {errorMessage !== '' && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
                <PrimaryButton
                    className={styles.submitButton}
                    height="50px"
                    onClick={handleCreateDashboard}
                >
                    Create Dashboard
                </PrimaryButton>
            </form>
        </div>
    );
};
