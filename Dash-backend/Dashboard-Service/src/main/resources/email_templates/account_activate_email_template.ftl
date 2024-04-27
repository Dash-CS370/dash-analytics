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
            .header {
                background-color: #000000;
                color: #ffffff;
                text-align: center;
                font-family: 'Colfax', serif;
                width: 600px;
                height: 110px;
                font-size: 34px;
                display: flex;
                align-items: center !important;
                background-image: linear-gradient(
                        to right,
                        rgb(0, 0, 0) 70%,
                        rgb(117, 5, 117) 100%
                );
                background-blend-mode: screen;
            }
            .header h1 {
                position: absolute !important;
                font-family: 'Colfax', monospace;
                margin: auto 0 !important;
                margin-left: 20px !important;
                font-weight: lighter;
                color: white;
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
            a {
                text-decoration: none;
            }
            .infoSection {
                text-align: left;
            }
            .infoSection strong {
                margin-bottom: 3px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>DASH</h1>
            </div>
            <div class="content">
                <p>Dear User,</p>
                <p>
                    To complete your sign-up, please verify your account by
                    clicking on the link below and using the provided activation code:
                </p>
                <div class="activate-link">
                    <a href=${activateAccountUrl} target=""><strong>Activate Account</strong></a>
                </div>
                <p>
                    If you did not request this, please ignore this email.
                </p>
                <p>Activation Code: <strong>${activationToken}</strong></p>
                <hr />
                <div class="infoSection">
                    <table>
                        <tr>
                            <td>
                                <strong style="font-size: 22px; color: black;">About Us</strong>
                                <p>
                                    Our platform is crafted to facilitate the efficient creation of comprehensive
                                    data dashboards and detailed charts. To begin transforming your data into
                                    compelling visual narratives, create an account or log in to access our full suite of tools.
                                </p>
                                <a href="https://dash-analytics.solutions/create-account"
                                   style="display: inline-block;
                                  text-align: center;
                                  background-color: black;
                                  color: white;
                                  text-decoration: none;
                                  border-radius: 12px;
                                  border: 1px solid gray;
                                  font-size: 14px;
                                  width: 150px;
                                  height: 25px;
                                  line-height: 25px;
                                  box-sizing: border-box;">
                                    Get Started</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height: 30px;"></td> <!-- Simple empty row for spacing -->
                        </tr>
                        <tr>
                            <td>
                                <strong style="font-size: 22px; color: black;">Our Terms of Use</strong>
                                <p>
                                    For details on data privacy and protection, as well as insights
                                    into how GPT enhances data understanding, please visit our information section.
                                </p>
                                <a href="https://dash-analytics.solutions/learn-more"
                                   style="display: inline-block;
                                   text-align: center;
                                   background-color: black;
                                   color: white;
                                   text-decoration: none;
                                   border-radius: 12px;
                                   border: 1px solid gray;
                                   font-size: 14px;
                                   width: 150px;
                                   height: 25px;
                                   line-height: 25px;
                                   box-sizing: border-box;">
                                    Learn More</a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </body>
</html>
