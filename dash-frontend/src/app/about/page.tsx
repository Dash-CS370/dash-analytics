'use client';
import { NavBar } from '@/components/common/NavBar';
import HowToPage from '@/components/pages/aboutPage/HowToPage';
import OverviewPage from '@/components/pages/aboutPage/OverviewPage';
import RequestPage from '@/components/pages/aboutPage/RequestPage';
import SideBar from '@/components/pages/aboutPage/SideBar';
// import RequestPage from '@/components/pages/aboutPage/RequestPage ';
// import OverviewPage from "@/components/OverviewPage";
// import RequestPage from "@/components/RequestPage";
// import SideBar from "@/components/SideBar";

import Image from 'next/image';
import styles from './page.module.css';

export default function Home() {
    return (
        <>
            <SideBar />
            <div id="overview-section">
                <OverviewPage />
            </div>
            <div id="how-to-section">
                <HowToPage />
            </div>
            <div id="request-section">
                <RequestPage />
            </div>
        </>
    );
}
