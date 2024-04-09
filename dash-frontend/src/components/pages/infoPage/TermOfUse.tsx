'use client';
import Styles from './TermOfUse.module.css';
import { NavBar } from '@/components/NavBar';

const TermOfUse = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.textContainer}>
                <h2>General Term Of Use</h2>
                <hr></hr>
                <p>
                    <span className={Styles.title}>Acceptance of Terms: </span>
                    Your access to and use of [Website Name] is conditioned upon
                    your acceptance of and compliance with these Terms. These
                    Terms apply to all visitors, users, and others who wish to
                    access or use [Website Name].
                </p>
                <p>
                    <span className={Styles.title}>Use License: </span> Use
                    License Subject to your compliance with these Terms,
                    [Website Name] grants you a limited, non-exclusive,
                    non-transferable, revocable license to use the website and
                    its services for your personal, non-commercial use only.
                </p>
                <p>
                    <span className={Styles.title}>User Conduct: </span>You
                    agree not to use the website in any way that: Violates any
                    national, international law, or regulation. Is harmful,
                    fraudulent, deceptive, threatening, harassing, defamatory,
                    obscene, or otherwise objectionable.
                </p>
                <p>
                    <span className={Styles.title}>
                        Intellectual Property:{' '}
                    </span>
                    The website and its original content, features, and
                    functionality are and will remain the exclusive property of
                    [Website Name] and its licensors.Our website may contain
                    links to third-party web sites or services that are not
                    owned or controlled by [Website Name]. [Website Name] has no
                    control over, and assumes no responsibility for the content,
                    privacy policies, or practices of any third-party web sites
                    or services.
                </p>
            </div>
        </div>
    );
};
export default TermOfUse;
