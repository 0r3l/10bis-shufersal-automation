# 10bis-shufersal-automation

This script helps to order shufersal voucher automatically

## prerequisite
- node.js installed
- linux based operation system (for [crontab](https://man7.org/linux/man-pages/man5/crontab.5.html))

## Setup

First you need to extract the cookie value from 10bis site:

![image](https://user-images.githubusercontent.com/42113188/161542063-db107029-36f0-42af-b925-0584e2161548.png)


- run `npm i 10bis-shufersal-automation -g`
- create file named `cookie` and paste cookie value from first step
- update crontab file (for example: `0 12 * * * node npm CHARGE=1 10bis-shufersal-automation`)

enjoy!
