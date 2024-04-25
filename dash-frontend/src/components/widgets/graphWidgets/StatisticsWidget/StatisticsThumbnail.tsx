import { BaseThumbnailProps } from '../../WidgetTypes';
import { GraphThumbnail } from '../../widgetPipeline/GraphThumbnail/GraphThumbnail';
import styles from '@/components/widgets/graphWidgets/StatisticsWidget/StatisticsWidget.module.css';

export const StatisticsThumbnail: React.FC<BaseThumbnailProps> = ({
    title,
    description,
    data,
    handleClick,
}) => {
    return (
        <GraphThumbnail
            title={title}
            description={description}
            handleClick={handleClick}
        >
            <div className={styles.thumbnailContainer}>
                <h3>Statistics Card</h3>
            </div>
        </GraphThumbnail>
    );
};
