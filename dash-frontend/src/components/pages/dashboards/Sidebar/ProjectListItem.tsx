import styles from '@/components/pages/dashboards/Sidebar/ProjectListItem.module.css';
import { FC, useState, KeyboardEvent } from 'react';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';

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
    // const [isActive, setIsActive] = useState(active);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // stops event from triggering selectProject
        setIsEditing(true);
    };

    const handleCheckClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // stops event from triggering selectProject
        // update project name (onNameChange handles database update)
        onNameChange(id, newName);
        setIsEditing(false);
    };

    const handleEnterForProjName = (e: KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation(); // stops event from triggering selectProject
        if (e.key === 'Enter') {
            // update project name (onNameChange handles database update)
            onNameChange(id, newName);
            setIsEditing(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // stops event from triggering selectProject
        deleteProject(id);
    };

    const handleSelectProject = () => {
        selectProject(id);
    };

    return (
        <div
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={handleSelectProject}
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
        </div>
    );
};
