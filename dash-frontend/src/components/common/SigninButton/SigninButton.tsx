import { SecondaryButton } from '../buttons/SecondaryButton/SecondaryButton';
import Image from 'next/image';
import styles from '@/components/common/SigninButton/SigninButton.module.css';

interface SigninButtonProps {
    className?: string;
    buttonText: string;
    href?: string;
    imgSrc: string;
    alt: string;
    imgWidth?: number;
    imgHeight?: number;
}

export const SigninButton: React.FC<SigninButtonProps> = ({
    className = '',
    buttonText,
    href = '',
    imgSrc,
    alt,
    imgWidth = 30,
    imgHeight = 30,
}) => {
    return (
        <SecondaryButton
            className={`${styles.btn} ${className}`}
            href={href}
            width="275px"
            prefetch={false}
        >
            <div className={styles.btnContents}>
                {buttonText}
                <Image
                    src={imgSrc}
                    alt={alt}
                    width={imgWidth}
                    height={imgHeight}
                />
            </div>
        </SecondaryButton>
    );
};
