import styles from '@/components/widgets/widgetPipeline/GraphThumbnail/GraphThumbnail.module.css';
import React from 'react';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { TiDeleteOutline } from 'react-icons/ti';

interface GraphThumbnailProps {
    title: string;
    description: string;
    handleClick?: () => void;
    children: React.ReactNode;
}

export const GraphThumbnail: React.FC<GraphThumbnailProps> = ({
    title,
    description,
    handleClick,
    children,
}) => {
    let [infoVisible, setInfoVisible] = React.useState(false);

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInfoVisible(!infoVisible);
    };

    if (infoVisible) {
        return (
            <div className={styles.thumbnail} onClick={handleClick}>
                <TiDeleteOutline
                    className={styles.icon}
                    onClick={handleInfoClick}
                />
                <div className={styles.infoContainer}>
                    <h3>{title}</h3>
                    {/* <p>{description}</p> */}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.thumbnail} onClick={handleClick}>
            <IoMdInformationCircleOutline
                className={styles.icon}
                onClick={handleInfoClick}
            />
            <div className={styles.graphContainer}>{children}</div>
        </div>
    );
};
