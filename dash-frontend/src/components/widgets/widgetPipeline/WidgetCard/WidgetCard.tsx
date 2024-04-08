'use client';

import React from 'react';
import styles from '@/components/widgets/widgetPipeline/WidgetCard/WidgetCard.module.css';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import { BsArrowsAngleContract, BsArrowsAngleExpand } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { FiCheck } from 'react-icons/fi';
import { IoMdInformationCircleOutline } from 'react-icons/io';

interface WidgetCardProps {
    title: string;
    description: string;
    id: string;
    pinned?: boolean;
    expanded?: boolean;
    onExpand: () => void;
    onTogglePin: () => void;
    onEditTitle: (id: string, newTitle: string) => void;
    children: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
    title,
    description,
    id,
    pinned = true,
    expanded = false,
    onExpand,
    onTogglePin,
    onEditTitle,
    children,
}) => {
    const [editingName, setEditingName] = React.useState(false);
    const [newName, setNewName] = React.useState(title);

    const [info, setInfo] = React.useState(false);
    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInfo(!info);
    };

    const [isPinned, setIsPinned] = React.useState(pinned);
    const togglePinned = () => {
        setIsPinned(!isPinned);
        onTogglePin();
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingName(true);
    };

    const handleCheckClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        console.log('id:', id);
        console.log('newName:', newName);

        onEditTitle(id, newName);
        setEditingName(false);
    };

    const handleEnterForWidgetTitle = (
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            console.log('id:', id);
            console.log('newName:', newName);

            onEditTitle(id, newName);
            setEditingName(false);
        }
    };

    const cardClassName = `${styles.widgetCard} ${
        expanded ? styles.expanded : styles.default
    }`;

    return (
        <div className={cardClassName}>
            <div className={styles.widgetCardHeader}>
                {editingName ? (
                    <div className={styles.widgetTitle}>
                        <input
                            type="text"
                            value={newName}
                            onKeyDown={handleEnterForWidgetTitle}
                            onChange={(e) => setNewName(e.target.value)}
                            className={styles.editInput}
                            onClick={(e: React.MouseEvent) =>
                                e.stopPropagation()
                            }
                        />
                        <FiCheck
                            className={styles.icon}
                            onClick={handleCheckClick}
                        />
                    </div>
                ) : (
                    <div className={styles.widgetTitle}>
                        <h1>{newName}</h1>
                        {!expanded && (
                            <CiEdit
                                className={styles.icon}
                                // onClick={handleEditClick}
                            />
                        )}
                    </div>
                )}
                <div className={styles.widgetHeaderButtons}>
                    <IoMdInformationCircleOutline
                        className={styles.icon}
                        onClick={handleInfoClick}
                    />
                    {isPinned && !expanded && (
                        <TiPin onClick={togglePinned} className={styles.icon} />
                    )}
                    {expanded ? (
                        <BsArrowsAngleContract
                            onClick={onExpand}
                            className={styles.icon}
                        />
                    ) : (
                        <BsArrowsAngleExpand
                            onClick={onExpand}
                            className={styles.icon}
                        />
                    )}
                </div>
            </div>

            {info ? (
                <div className={styles.widgetCardContent}>
                    <p>{description}</p>
                </div>
            ) : (
                <div className={styles.widgetCardContent}>{children}</div>
            )}
        </div>
    );
};
