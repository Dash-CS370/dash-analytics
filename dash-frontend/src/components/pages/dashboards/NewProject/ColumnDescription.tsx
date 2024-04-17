import styles from '@/components/pages/dashboards/NewProject/NewProject.module.css';
import { ColumnInfo } from './NewProject';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useState } from 'react';

interface ColumnDescriptionProps {
    columnMetadata: ColumnInfo;
    id: number;
    handleDescriptionChange: (value: string) => void;
}

export const ColumnDescription: React.FC<ColumnDescriptionProps> = ({
    columnMetadata,
    id,
    handleDescriptionChange,
}) => {
    return (
        <div style={{ width: '60%', marginBottom: '1rem' }}>
            <div className={styles.columnDescription}>
                <h3 className={styles.header}>{columnMetadata.colName}</h3>
                <p style={{ fontSize: '.7rem' }}>{columnMetadata.dataType}</p>
                <div className={styles.dropdown}>
                    {/* TODO: Add Use State to Upadte Button Text & Add Alternative Fill in Spot*/}
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            Data Type
                        </MenuButton>
                        <MenuList>
                            <MenuItem>CATEGORICAL</MenuItem>
                            <MenuItem>NUMERIC</MenuItem>
                            <MenuItem>TEMPORAL</MenuItem>
                            <MenuItem>IDENTIFIER</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
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
