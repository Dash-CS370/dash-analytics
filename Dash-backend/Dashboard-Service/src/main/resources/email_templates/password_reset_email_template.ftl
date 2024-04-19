<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Email Verification</title>
        <style>
            @font-face {
                font-family: 'Colfax';
                src: url('https://dash-analytics.solutions/css/Colfax.otf') format('opentype');
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
            C .header,
            .footer {
                background-color: #000000;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .header {
                color: white;
                font-family: 'Colfax';
                font-size: 100px;
                width: 600px;
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

            .reset-link {
                display: flex;
                justify-content: center;
                padding: 20px 20px;
            }

            .reset-link a:hover {
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
                <div class="highlight">Password Reset Request</div>
                <p>Dear User,</p>

                <p>
                    You have requested to reset your password. Please click on
                    the link below to proceed with setting a new password:
                </p>
                <div class="reset-link">
                    <a href="" target=""><strong>Reset Password</strong></a>
                </div>
                <p>
                    If you did not request a password reset, please ignore this
                    email.
                </p>
                <p>
                    If you prefer, you can also enter the password reset key
                    manually:
                </p>
                <p>Password Reset Key: <strong>${passwordResetKey}</strong></p>
                <hr />
                <div class="infoSection">
                    <table>
                        <tr>
                            <td>
                                <strong>Tutorial & Intro</strong>
                                <p>
                                    We have put together all the things you need
                                    to know to start creating amazing charts and
                                    graphs.
                                </p>
                                <button class="btn">Let's Go</button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Our Terms of Use</strong>
                                <p>
                                    Having questions about your data privacy /
                                    protection? Wondering how GPT is helping us
                                    understand your data? Learn more in our
                                    informatio section!
                                </p>
                                <button class="btn">Learn More</button>
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
