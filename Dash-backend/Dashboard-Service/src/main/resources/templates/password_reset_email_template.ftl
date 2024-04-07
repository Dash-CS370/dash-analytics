<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Password Reset</title>
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
            color: #3d3e6c;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">DashAnalytics</div>
    <div class="content">
        <div class="highlight">Password Reset Request</div>
        <p>Dear User,</p>
        <p>You have requested to reset your password. Please click on the link below to proceed with setting a new password:</p>
        <p><a href="${verificationUrl}" target="_blank">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support.</p>
        <p>If you prefer, you can also enter the password reset key manually:</p>
        <p>Password Reset Key: <strong>${passwordResetKey}</strong></p>
    </div>
    <div class="footer">
        This is an automated message, please do not reply.
    </div>
</div>
</body>
</html>
