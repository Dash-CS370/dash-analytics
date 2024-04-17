import styles from '@/components/pages/dashboards/Sidebar/ProjectListItem.module.css';
import { FC, useState, useRef, KeyboardEvent } from 'react';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { standardClean } from "../../../../../Data Pipeline/standard_clean";
import {processAndSliceDF} from "../../../../../Data Pipeline/sliceData";
import {userClean} from "../../../../../Data Pipeline/user_clean";

interface ProjectListItemProps {
    id: string;
    name: string;
    isActive: boolean;
    onNameChange: (id: string, newName: string) => void;
    deleteProject: (id: string) => void;
    selectProject: (id: string) => void;
}

export const ProjectListItem: FC<ProjectListItemProps> = ({
                                                              id,
                                                              name,
                                                              isActive,
                                                              onNameChange,
                                                              deleteProject,
                                                              selectProject,
                                                          }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents triggering onClick of the parent div
        setIsEditing(true);
    };

    const handleCheckClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents triggering onClick of the parent div
        onNameChange(id, newName);
        setIsEditing(false);
    };

    const handleEnterForProjName = (e: KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation(); // Prevents triggering onClick of the parent div
        if (e.key === 'Enter') {
            onNameChange(id, newName);
            setIsEditing(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents triggering onClick of the parent div
        fileInputRef.current?.click(); // Programmatically clicks the file input to open file dialog
    };

    const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            console.log(file.name); // Optionally log the file name
            const cleaned_df = await standardClean(file); // Function to process the file
            const smoothed_df = await processAndSliceDF(cleaned_df, 3000, 1);
            userClean(smoothed_df, ["humidity"]);
        }
    };

    return (
        <div
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => selectProject(id)} // Correct function to handle selection
        >
            {isEditing ? (
                <div className={styles.editContainer}>
                    <input
                        type="text"
                        value={newName}
                        onKeyDown={handleEnterForProjName}
                        onChange={(e) => setNewName(e.target.value)}
                        className={styles.editInput}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    />
                    <FiCheck
                        className={styles.icon}
                        onClick={handleCheckClick}
                    />
                </div>
            ) : (
                <>
                    <span className={styles.name}>{newName}</span>
                    <div className={styles.actions}>
                        <FiEdit2
                            className={styles.icon}
                            onClick={handleEditClick}
                        />
                        <FiTrash2
                            className={styles.icon}
                            onClick={handleDeleteClick}
                        />
                    </div>
                </>
            )}
            <input
                ref={fileInputRef}
                id="fileInput"
                type="file"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};
