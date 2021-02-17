# AutoRenewableSubscriptionsManagerServer
A ready out of the box Node.js/Express.js server for iOS developers/companies to use to store user data on a PostgreSQL DB hosted by Heroku.


Installation
Clone project locally
To run project, go into your terminal and navigate to the directory the project lives in.
In your terminal, run `$ node subscriptions.js`. You should see "Running on //localhost:3000"
This means the app is building.
Locally, install PostgreSQL `npm -i psql`
In your terminal, run `psql` to see if PostgreSQL is successfully installed. 
Create your table with a SQL install script: db.sql
Create an Heroku account
Create a PostgreSQL add-on
Create a Scheduler Add-On
Go to App Store Connect and retrieve your app's secret. Add that to the `appStoreSecret` constant in `subscriptions.js`
Deploy to Heroku

Most instructions can be found here: https://blog.logrocket.com/nodejs-expressjs-postgresql-crud-rest-api-example/
