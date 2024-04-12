<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Email Verification</title>
        <style>
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
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
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
                background-color:black;
                color: black;
                border: 1px solid gray;
                width: 170px;
                height: 40px;
                margin-bottom: 20px;

                display: flex;
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
                <img
                    className="image"
                    src="Dash.svg"
                    alt="Logo"
                    width="350px"
                    height="300px"
                />
            </div>
            <div class="content">
                <div class="highlight">Activate Your Account</div>
                <p>Dear User,</p>
                <p>
                    To complete your sign-up, please verify your email by
                    clicking the link below:
                </p>
                <div class="activate-link">
                    <a href=${activateAccountUrl} target=""><strong>Activate Account</strong></a>
                </div>
                <p>If you did not request this, please ignore this email.</p>
                <p>
                    If you prefer, you can also enter the activation code
                    manually:
                </p>
                <p>Activation Code: <strong>ABC124</strong></p>
                <hr />
                <div class="infoSection">
                    <strong>Tutorial & Intro</strong>
                    <p>
                        We have put together all the things you need to know to
                        start creating amazing charts and graphs.
                    </p>
                    <button width="200px" height="50px" class="btn">
                        Let's Go
                    </button>
                    <strong>Our Terms of Use</strong>
                    <p>
                        Having questions about your data privacy / protection?
                        Wondering how GPT is helping us understand your data?
                        Learn more in our information section!
                    </p>
                    <button width="200px" height="50px" class="btn">
                        Learn More
                    </button>
                </div>
            </div>
            <div class="footer">
                This is an automated message, please do not reply.
            </div>
        </div>
    </body>
</html>
