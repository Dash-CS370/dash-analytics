'use client';
import { PrimaryButton } from '@/components/buttons/PrimaryButton/PrimaryButton';
import Styles from './EmailPage.module.css';

const EmailPage = () => {
    const exampleUser = {
        name: 'George Morales',
        email: 'abc22323@gmail.com',
        contact: '12345678',
        password: '123445',
        credits: '60',
    };
    return (
        <>
            <div className={Styles.outLayer}>
                <div className={Styles.container}>
                    <div className={Styles.headerSection}>
                        <img
                            className={Styles.Logo}
                            src="/videos/Dash-logo.svg"
                            alt="Logo"
                        />
                    </div>
                    <div className={Styles.infoSection}>
                        <p>
                            User Email: <span>{exampleUser.email}</span>
                        </p>
                        <p>
                            Username: <span>{exampleUser.name}</span>
                        </p>
                        <p>
                            Service type: <span>Token request</span>
                        </p>
                    </div>

                    <div className={Styles.textSection}>
                        <p>
                            Greeting! Client👋,<br></br>
                            <br></br>We have successfully received you token
                            request 🎉, and we are currently reviewing your
                            request. Typically, a token request takes 1-3
                            business day(s) to be fully processed. Please be
                            patient while waiting for our responces. We will try
                            our best to get your back to our services as soon as
                            possible!
                            <p>Dash Analytics</p>
                        </p>
                    </div>
                    <div className={Styles.extendedSection}>
                        <hr></hr>
                        <strong>Tutorial & Intro</strong>
                        <p>
                            We have put together all the things you need to know
                            to start creating amazing charts and graphs.
                        </p>
                        <PrimaryButton
                            width="200px"
                            height="50px"
                            className={Styles.Btn}
                        >
                            Let's Go
                        </PrimaryButton>
                        <strong>Our Terms of Use</strong>
                        <p>
                            Having questions about your data privacy /
                            protection? Wondering how GPT is helping us
                            understand your data? Learn more in our informatio
                            section!
                        </p>
                        <PrimaryButton
                            width="200px"
                            height="50px"
                            className={Styles.Btn}
                        >
                            Learn More
                        </PrimaryButton>
                    </div>

                    <div className={Styles.footerSection}>
                        <div className={Styles.footerInfo}>
                            <p>Dash-Analytics</p>
                            <p>dashAnalytics@gmail.com</p>
                            <p>201 Dowman Dr, Atlanta, GA 30322, USA</p>
                        </div>
                        <div className={Styles.footerLinks}>
                            {/* <a href="">Home</a>
              <a href="">About</a> */}
                            {/* <a href="">Profile</a> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default EmailPage;
