# 10bis-shufersal-automation

This script helps to order shufersal voucher automatically

## Prerequisite
- node.js installed
- linux based operation system (for [crontab](https://man7.org/linux/man-pages/man5/crontab.5.html))

## Setup

First you need to extract the cookie value from 10bis site:

![image](https://user-images.githubusercontent.com/42113188/161542063-db107029-36f0-42af-b925-0584e2161548.png)


- create file named `cookie` in project folder and paste cookie value from first step
- update crontab file (for example: `0 12 * * * node npm CHARGE=1 {project_folder}/10bis-shufersal-automation/index`)

## Mailer

You can configure mailer to send an email with all the generated vouchers

- create `.env` file that includes this variables:
  - `TENBIS_COUPONS_EMAIL` gmail email
  - `TENBIS_COUPONS_PASS` gmail email password
  - `RECIPIENTS` email recipients seperated by comma
- update crontab file (for example: `0 12 * 1 * node npm {project_folder}/10bis-shufersal-automation/mailer`)

enjoy!
