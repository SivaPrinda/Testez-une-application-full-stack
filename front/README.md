# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

Git clone:

> git clone https://github.com/SivaPrinda/Testez-une-application-full-stack.git

Go inside folder:

> cd front

Install dependencies:

> npm install

Launch Front-end:

> npm run start;


## Ressources

### Mockoon env 

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman


### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


## Test

### E2E
 
Launching e2e test:
 
> npm run e2e
 
To execute all tests from a single file:
 
> npx cypress run --spec "cypress/e2e/all.cy.ts"
 
Alternatively, in GUI mode:
 
> npx cypress open
```
Then select `all.cy.ts` from the Cypress interface.

Generate coverage report (you should launch E2E tests from the `all.cy.ts` file before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:watch
