import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { Dropdown } from '@/components/common/Dropdown/Dropdown';
import { ColumnInfo } from './NewProject';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface ColumnDescriptionProps {
    columnMetadata: ColumnInfo;
    id: number;
    handleDescriptionChange: (value: string) => void;
    handleDropdownChange: (value: string) => void;
    handleDelete: (colName: string) => void;
}

export const ColumnDescription: React.FC<ColumnDescriptionProps> = ({
    columnMetadata,
    id,
    handleDescriptionChange,
    handleDropdownChange,
    handleDelete,
}) => {
    const options = ['CATEGORICAL', 'NUMERICAL', 'TEMPORAL', 'IDENTIFIER'];
    const [selectedOption, setSelectedOption] =
        useState<string>('DATA TYPE...');

    const setSelectedOpt = (value: string) => {
        handleDropdownChange(value);
        setSelectedOption(value);
    };

    return (
        <div style={{ width: '60%', marginBottom: '1rem' }}>
            <div className={styles.columnDescription}>
                <h3 className={styles.header}>{columnMetadata.colName}</h3>
                <p style={{ fontSize: '.7rem' }}>{columnMetadata.dataType}</p>
                <Dropdown
                    options={options}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOpt}
                />
                <FiTrash2
                    className={styles.delete_label}
                    onClick={() => handleDelete(columnMetadata.colName)}
                />
            </div>
            <textarea
                className={styles.formDescription}
                id={`projectDescription-${id.toFixed()}`}
                name="projectDescription"
                placeholder="Column Description..."
                onChange={(e) => handleDescriptionChange(e.target.value)}
                required
            />
        </div>
    );
};
