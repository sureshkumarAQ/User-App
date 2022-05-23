# User-App
## Getting Started
For setting up the development environment, follow the steps given below.

1. Clone this repository in your local
```sh
 git clone git@github.com:sureshkumarAQ/User-App.git
```
2. Install the required packages
```sh
 npm i
```
3. Create a config.env file in main folder
   - Make a variable name PORT and assign the value 3000 or 8000
   - Make another variable name MONGO_URI for mongodb atlas connection string 
   - And a JWT_SECRET which is helpful for creating jsonwebtoken 
   - here I added my config.env file you can use my database  you do not have to do anything in 3rd point ;)
4. Finally start the server 
   ```sh
   npm start
   ```
5. Now open postman and test APIs I added POSTMAN collection as a json file.
