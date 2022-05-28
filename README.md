# Covid Daily Cases Api

API to retrieve data on registered cases of COVID in various locations around the world, detailing variants and its quantities by date (daily or accumulated).

Base url: https://coviddailycases.us-south.cf.appdomain.cloud/

# Instructions

The API has four `[GET]` routes.

### Main route

https://coviddailycases.us-south.cf.appdomain.cloud/

This route returns a simple welcome message.

### Get available dates route

https://coviddailycases.us-south.cf.appdomain.cloud/dates

This route returns a list of available dates that can be used to query for registered cases of COVID, whereas daily or accumulated, using the other two routes.

### Get daily cases

Example: https://coviddailycases.us-south.cf.appdomain.cloud/cases/2020-10-12/count

This route returns the quantity of all the registered cases of COVID in the inputed date, separeted by variants and grouped by country.

Change the date to get other daily results. Input date format accepted: `yyyy-mm-dd`.

### Get accumulated cases

Example: https://coviddailycases.us-south.cf.appdomain.cloud/cases/2020-10-12/cumulative

This route returns the accumulated count of all the registered cases of COVID until the inputed date, separeted by variants and grouped by country.

Change the date to get other accumulated results. Input date format accepted: `yyyy-mm-dd`.

# Development tools

 - Languages: JavaScript.
 - Framework: Node.Js.
 - Database: MongoDB.

# Installation for personal usage and test

- Clone or download and extract the repository files available at: https://github.com/juliommen/covid-daily-cases-api.git.
- Download CSV available at: https://challenges.coode.sh/covid/data/covid-variants.csv.
- Move the CSV to the project folder.
- Create an account and a database in  https://www.mongodb.com/cloud/atlas. Set user credentials and IP access.
- Create '.env' file with the database credentials (MONGO_USER and MONGO_PASSWORD) in the project folder.
- Run 'npm install' from the project folder path.
- Access 'src' folder and run 'node inserDataMongo.js' to load the CSV into the database.
- Go back and run 'npm start' from the project folder path.
- Check routes in https://localhost:8080.
- Additional: Run 'npm run test' to run unit tests.


> This is a challenge by <a href="https://coodesh.com/">Coodesh</a>.



