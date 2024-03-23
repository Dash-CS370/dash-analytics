import styles from '@/components/pages/dashboards/Sidebar/ProjectListItem.module.css';
import { FC, useState, KeyboardEvent } from 'react';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ProjectListItemProps {
    id: number;
    name: string;
    onNameChange: (id: number, newName: string) => void;
}

export const ProjectListItem: FC<ProjectListItemProps> = ({
    id,
    name,
    onNameChange,
}) => {
    // TODO: Add onDelete interaction (same as edit)
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCheckClick = () => {
        // update project name (onNameChange handles database update)
        onNameChange(id, newName);
        setIsEditing(false);
    };

    const handleEnterForProjName = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCheckClick();
        }
    };

    return (
        <div className={styles.item}>
            {isEditing ? (
                <div className={styles.editContainer}>
                    <input
                        type="text"
                        value={newName}
                        onKeyDown={handleEnterForProjName}
                        onChange={(e) => setNewName(e.target.value)}
                        className={styles.editInput}
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
                            className={styles.icon} /* onClick={onDelete} */
                        />
                    </div>
                </>
            )}
        </div>
    );
};
