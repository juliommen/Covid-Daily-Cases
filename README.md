# Covid Daily Cases Api

API for retrieving data about COVID cases of various locations around the world, detailing registered variants and its quantities by date (daily or accumulated).

API url: 

# Development tools

 - Languages: JavaScript.
 - Framework: Node.Js.
 - Technologies: MongoDB. 

# Installation for personal usage and test

- Download and extract repository files.
- Download CSV available at: https://challenges.coode.sh/covid/data/covid-variants.csv.
- Move the CSV to the project folder.
- Create a database in  https://www.mongodb.com/cloud/atlas. Set user credentials and IP access.
- Create '.env' file with the database credentials (MONGO_USER and MONGO_PASSWORD) in the project folder.
- Run 'npm install' in the project folder path.
- Run 'node inserDataMongo.js' to load the CSV into the database.
- Run 'npm start' in the project folder path.
- Check the routes in https://localhost:8080.


This is a challenge by <a href="https://coodesh.com/">Coodesh</a>.



