# Covid Daily Cases Api

API for retrieving data about COVID cases of various locations around the world, detailing registered variants and its quantities by date (daily or accumulated).

API url: https://coviddailycases.us-south.cf.appdomain.cloud/

# Instructions

The API has four 'get' routes.

### Main route

```
https://coviddailycases.us-south.cf.appdomain.cloud/
```

This route returns a simple welcome message.

### Get available dates route

```
https://coviddailycases.us-south.cf.appdomain.cloud/dates
```

This route returns the available dates to query for COVID cases, whereas daily or accumulated, with the routes below.

### Get daily cases

Example:
```
https://coviddailycases.us-south.cf.appdomain.cloud/cases/2020-10-12/count
```

This route returns all the registered cases of COVID for the inputed date, separeted by variants and grouped by country.

Change the date to get other daily results.

### Get accumulated cases

```
https://coviddailycases.us-south.cf.appdomain.cloud/
```

This route returns all the registered cases of COVID accumulated until the inputed date, separeted by variants and grouped by country.

Change the date to get other accumulated results.

# Development tools

 - Languages: JavaScript.
 - Framework: Node.Js.
 - Database: MongoDB. 

# Installation for personal usage and test

- Download and extract the repository files at: https://github.com/juliommen/covid-daily-cases-api.git.
- Download CSV available at: https://challenges.coode.sh/covid/data/covid-variants.csv.
- Move the CSV to the project folder.
- Create a database in  https://www.mongodb.com/cloud/atlas. Set user credentials and IP access.
- Create '.env' file with the database credentials (MONGO_USER and MONGO_PASSWORD) in the project folder.
- Run 'npm install' in the project folder path.
- Run 'node inserDataMongo.js' to load the CSV into the database.
- Run 'npm start' in the project folder path.
- Check the routes in https://localhost:8080.


This is a challenge by <a href="https://coodesh.com/">Coodesh</a>.



