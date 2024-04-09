'use client';
import Styles from './SideBar.module.css';

const SideBar = () => {
    return (
        <div className={Styles.sidebar}>
            <a href="#overview-section">Home</a>
            <a href="#overview-section">Overview</a>
            <a href="#how-to-section">How To</a>
            <a href="#request-section">Request</a>
        </div>
    );
};
export default SideBar;
