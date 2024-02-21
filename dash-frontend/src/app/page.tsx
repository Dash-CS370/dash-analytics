import Image from 'next/image';
import styles from './page.module.css';
import { HeroSection } from '@/components/landingPageHero/HeroSection';

export default function Home() {
    return (
        <main className={styles.main}>
            <HeroSection />
        </main>
    );
}
