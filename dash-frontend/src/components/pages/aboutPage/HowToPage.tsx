'use client';
import Styles from './HowToPage.module.css';
const HowToPage = () => {
    return (
        <div className={Styles.container}>
            <section className={`${Styles.section} ${Styles.section1}`}>
                <img
                    src="/images/image4.jpg"
                    className={`${Styles.image} ${Styles.firstImage}`}
                    alt="Image 1"
                ></img>
            </section>
            <section className={`${Styles.section} ${Styles.section2}`}>
                In the first section, upload your CSV file by either dragging
                and dropping it into the designated area or using the
                traditional file upload method to select your dataset from your
                device. Next, assign a name to your project that reflects its
                content or purpose. In the third section, describe your project
                with a brief narrative, such as "a dataset about air quality,"
                to provide context and insights into the nature of your data.
                These simple steps will set the foundation for your data
                analysis journey with Dash Analytics, streamlining the process
                from data upload to insightful visualization.
            </section>
            <section className={`${Styles.section} ${Styles.section3}`}>
                <img
                    src="/images/image5.jpg"
                    className={`${Styles.image} ${Styles.secondImage}`}
                    alt="Image 2"
                ></img>
            </section>
            <section className={`${Styles.section} ${Styles.section4}`}>
                By clicking next, you will enter a section where we have each
                column and their datatype of your dataset prepared for you, and
                you need to describe them. In the example provided here, you can
                type "date", "daily PM10 level range 0.001 - 0.3mm","Humidity of
                the day range from 20% - 93%", "daily temperature range 65 - 93
                Fahrenheit" respectively into these input boxes to help our
                model better interpret your data for a more accurate result.
            </section>
        </div>
    );
};

export default HowToPage;
