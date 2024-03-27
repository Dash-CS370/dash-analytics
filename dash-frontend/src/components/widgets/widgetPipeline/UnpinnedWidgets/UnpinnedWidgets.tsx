import styles from '@/components/widgets/widgetPipeline/UnpinnedWidgets/UnpinnedWidgets.module.css';
import { ProjectConfig, WidgetConfig } from '../../WidgetTypes';
import { ThumbnailRenderer } from '../ThumbnailRenderer/ThumbnailRenderer';
import { FetchThumbnail } from '../FetchThumbnail/FetchThumbnail';

interface UnpinnedWidgetsProps {
    unpinnedConfigs: WidgetConfig[];
    handleClick: (id: string) => void;
    fetchMoreWidgets: () => void;
}

export const UnpinnedWidgets: React.FC<UnpinnedWidgetsProps> = ({
    unpinnedConfigs,
    handleClick,
    fetchMoreWidgets,
}) => {
    return (
        <div className={styles.carousel}>
            {unpinnedConfigs.map((config) => (
                <ThumbnailRenderer
                    key={config.id}
                    config={config}
                    handleClick={() => handleClick(config.id)}
                />
            ))}
            <FetchThumbnail onClick={fetchMoreWidgets} />
        </div>
    );
};
