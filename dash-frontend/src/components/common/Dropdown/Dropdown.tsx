import React, { useState } from 'react';
import styles from '@/components/common/Dropdown/Dropdown.module.css';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

interface DropdownProps {
    width?: string;
    height?: string;
    options: string[];
    selectedOption: string;
    setSelectedOption: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
    width = '130px',
    height = '30px',
    options,
    selectedOption,
    setSelectedOption,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div
            className={isOpen ? styles.DropDownOpen : styles.DropDownClosed}
            style={{ width, height }}
        >
            <div
                className={styles.selectedType}
                onClick={() => setIsOpen(!isOpen)}
            >
                <p>{selectedOption}</p>
                {isOpen ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
            </div>
            {isOpen && (
                <div className={styles.optionsContainer}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={styles.option}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
