<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Email Verification</title>
        <style>
            @font-face {
                font-family: 'Colfax';
                src: url('https://auth.dash-analytics.solutions/css/Colfax.otf');
            }
            body {
                font-family: Arial, Helvetica, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #838383;
            }
            .container {
                width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
            }
            .header,
            .footer {
                background-color: #000000;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .header {
                font-family: 'Colfax', serif;
                width: 560px;
                height: 110px;
                font-size: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-image: linear-gradient(
                    to right,
                    rgb(0, 0, 0) 60%,
                    rgb(117, 5, 117) 100%
                );
                background-blend-mode: screen;
            }
            .header h1 {
                font-family: 'Colfax', monospace;
                margin: 0;
                font-weight: lighter;
            }
            .footer {
                font-size: 14px;
                background-image: linear-gradient(
                    to right,
                    rgb(0, 0, 0) 60%,
                    rgb(117, 5, 117) 100%
                );
                background-blend-mode: screen;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 16px;
                color: #000000;
                text-align: start;
            }

            .content hr {
                margin-top: 50px;
                margin-bottom: 50px;
            }

            .activate-link {
                display: flex;
                justify-content: center;
                padding: 20px 20px;
            }

            .activate-link a:hover {
                font-weight: bolder;
                color: rgb(168, 1, 168);
                transition: 0.2s ease-in-out;
            }
            .highlight {
                color: #555100;
                font-size: 24px;
                margin-top: 20px;
                margin-bottom: 20px;
            }
            a {
                text-decoration: none;
            }

            .infoSection {
                text-align: left;
            }

            .infoSection strong {
                margin-bottom: 3px;
            }

            .infoSection .btn {
                border-radius: 12px;
                outline: none;
                border: solid 2px;
                cursor: pointer;
                background-color: white;
                color: black;
                border: 1px solid gray;
                width: 170px;
                height: 40px;
                margin-bottom: 20px;
                justify-content: center;
                align-items: center;
            }

            .infoSection .btn:hover {
                background-color: black;
                color: white;
                transition: all 0.3s ease-out;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DASH</h1>
            </div>
            <div class="content">
                <div class="highlight">Activate Your Account</div>
                <p>Dear User,</p>
                <p>
                    To complete your sign-up, please verify your email by
                    clicking the link below and using the provided activation code:
                </p>
                <div class="activate-link">
                    <a href=${activateAccountUrl} target=""><strong>Activate Account</strong></a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
                <p>Activation Code: <strong>${activationToken}</strong></p>
                <hr />
                <div class="infoSection">
                    <table>
                        <tr>
                            <td>
                                <strong>Getting Started</strong>
                                <p>
                                <p>
                                    Welcome to your first step towards harnessing AI for data visualization!
                                    Our platform is designed to help you effortlessly create stunning data dashboards
                                    and insightful charts. Begin your journey with just a click and explore the essential
                                    tools and techniques to transform your data into visual stories.
                                </p>
                                <button class="btn" onclick="window.location.href='https://dash-analytics.solutions/create-account';">Get Started</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Our Terms of Use</strong>
                                <p>
                                    For details on data privacy and protection, as well as insights
                                    into how GPT enhances data understanding, please visit our information section.
                                </p>
                                <button class="btn" onclick="window.location.href='https://dash-analytics.solutions/learn-more';">Learn More</button>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="footer">
                This is an automated message, please do not reply.
            </div>
        </div>
    </body>
</html>
