'use client';
import Styles from './SideBar.module.css';

const SideBar = () => {
    return (
        <div className={Styles.sidebar}>
            <a href="#term-of-use">Home</a>
            <a href="#term-of-use">Term of Use</a>
            <a href="#use-data">User Data</a>
            <a href="#gpt-usage">GPT Usage</a>
        </div>
    );
};
export default SideBar;
