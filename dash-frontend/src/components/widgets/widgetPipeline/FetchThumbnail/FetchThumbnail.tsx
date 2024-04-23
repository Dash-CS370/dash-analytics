import styles from '@/components/widgets/widgetPipeline/FetchThumbnail/FetchThumbnail.module.css';
import { IoIosAddCircleOutline } from 'react-icons/io';

interface FetchThumbnailProps {
    onClick: () => void;
}

export const FetchThumbnail: React.FC<FetchThumbnailProps> = ({ onClick }) => {
    return (
        <div className={styles.thumbnail} onClick={onClick}>
            <IoIosAddCircleOutline className={styles.icon} />
            <p className={styles.text}>coming soon</p>
        </div>
    );
};
