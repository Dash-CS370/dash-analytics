'use client';
import Link from 'next/link';
import Styles from './RequestPage.module.css';

const RequestPage = () => {
    return (
        <div className={Styles.container}>
            <div className={Styles.item1}>
                <h1>Why Request a Token?</h1>
                <p>
                    Implementing a token request system offers multiple
                    benefits, starting with enhanced security by ensuring
                    authenticated access, thereby reducing the risk of
                    unauthorized data breaches. It aids in resource management
                    by controlling the flow of requests, ensuring the system's
                    stability and reliability for all users. Token usage also
                    simplifies code maintenance by standardizing access patterns
                    and simplifying authentication logic. These measures
                    contribute to a more secure, efficient, and robust web
                    service.
                </p>
            </div>
            <div className={Styles.item2}>
                <img
                    src="/images/image8.jpg"
                    className={`${Styles.image} ${Styles.fingerImage}`}
                    alt="Image 2"
                ></img>
            </div>
            <div className={Styles.item3}>
                {/* <img
                    src="/images/image7.jpg"
                    className={`${Styles.image} ${Styles.touchImage}`}
                    alt="Image 2"
                ></img> */}
                <h1>How to Request Tokens?</h1>
                <p>
                    To request tokens, simply navigate to your {''}
                    <Link className={Styles.requestLink} href={''}>
                        profile page{''}
                    </Link>
                    {''}
                    <span> </span> on our website. Once there, scroll down to
                    find the "Request Token" section. In the provided input
                    field, enter the number of tokens you wish to request along
                    with a brief description of your purpose for needing them.
                    After you've filled in the necessary details, submit the
                    form for review. Our team will evaluate the validity and
                    necessity of your request and, conditions permitting, grant
                    the requested tokens accordingly. This process ensures a
                    fair and efficient allocation of resources, tailored to your
                    specific needs.
                </p>
            </div>
            <div className={Styles.item4}>
                {/* <h1>How to Request Tokens?</h1>
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Nesciunt rem nostrum inventore quis id, excepturi debitis
                    quibusdam, quisquam ipsam, fuga sapiente earum molestiae ut
                    eius unde a temporibus voluptatem esse! Lorem ipsum, dolor
                    sit amet consectetur adipisicing elit. Dicta corrupti
                    mollitia quod dolorem nesciunt illum dolore accusamus alias
                    amet! Deleniti id enim soluta dolore itaque autem assumenda
                    excepturi vel quo?
                </p> */}
            </div>
        </div>
    );
};

export default RequestPage;
