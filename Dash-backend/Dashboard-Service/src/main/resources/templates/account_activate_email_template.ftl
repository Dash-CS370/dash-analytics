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
        .header, .footer {
            background-color: #3d3e6c;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .header {
            font-size: 48px;
        }
        .footer {
            font-size: 14px;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #000000;
        }
        .highlight {
            color: #555100;
            font-size: 24px;
        }
        a {
            text-decoration: none;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">DashAnalytics</div>
    <div class="content">
        <div class="highlight">Activate Your Account</div>
        <p>Dear User,</p>
        <p>To complete your sign up, please verify your email by clicking the link below:</p>
        <p><a href="${verificationUrl}" target="_blank">Activate Account</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p>If you prefer, you can also enter the activation code manually:</p>
        <p>Activation Code: <strong>${activationToken}</strong></p>
    </div>
    <div class="footer">
        This is an automated message, please do not reply.
    </div>
</div>
</body>
</html>
