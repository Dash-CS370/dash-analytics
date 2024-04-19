import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { ColumnInfo } from './NewProject';
import { DropDown } from '@/components/common/DropDown/DropDown';
import { FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface ColumnDescriptionProps {
    columnMetadata: ColumnInfo;
    id: number;
    handleDescriptionChange: (value: string) => void;
    handleDropdownChange: (value: string) => void;
}

export const ColumnDescription: React.FC<ColumnDescriptionProps> = ({
    columnMetadata,
    id,
    handleDescriptionChange,
    handleDropdownChange,
}) => {
    const options = ['CATEGORICAL', 'NUMERIC', 'TEMPORAL', 'IDENTIFIER'];
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
                <DropDown
                    options={options}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOpt}
                />
                <FiTrash2 className={styles.delete_label} />{' '}
                {/* ADD DELETE ON CLICK */}
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
