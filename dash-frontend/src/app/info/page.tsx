import styles from '@/app/info/page.module.css';
import TermOfUse from '@/components/pages/infoPage/TermOfUse';
import UserData from '@/components/pages/infoPage/UserData';
import SideBar from '@/components/pages/infoPage/SideBar';
import GptUsage from '@/components/pages/infoPage/GptUsage';
export default function Home() {
    return (
        <>
            <SideBar />
            <div id="term-of-use">
                <TermOfUse></TermOfUse>
            </div>
            <div id="use-data">
                <UserData></UserData>
            </div>
            <div id="gpt-usage">
                <GptUsage></GptUsage>
            </div>
        </>
    );
}
