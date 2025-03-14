# Read Me First

This document outlines the steps required to set up and run this project on your local machine.

## Prerequisites

Before starting, make sure the following are installed on your system:

1. **Java 1.8**  
   Check your Java version:
   ```
   java -version
   ```

2. **Maven**  
   Install Maven and check its version:
   ```
   mvn -version
   ```

3. **Git**  
   Clone the project repository with Git:
   ```
   git clone https://github.com/SivaPrinda/Test-a-full-stack-application.git
   ```

4. **MySQL Database**  
   Set up a MySQL server and run the following file to create the database:

   - Execute the file "Test-a-full-stack-application/resources/sql/script.sql".

   - Edit the `application.properties` file with your database connection information. For example:

   ```
   spring.datasource.url=jdbc:mysql://localhost:3306/yoga?allowPublicKeyRetrieval=true
   spring.datasource.username=example
   spring.datasource.password=example123
   ```

## Building and Running the Back-end

Navigate to the project directory:

```
cd back
```

Run the following command to build the project:

```
mvn clean install
```

Then, run the following command to start the project:

```
mvn spring-boot:run
```

## Building and Running the Front-end

Navigate to the project directory:

```
cd front
```

Run the following command to install project dependencies:

```
npm install
```

Then, run the following command to start the project:

```
ng serve
```

The application is available at the following address: [http://localhost:4200](http://localhost:4200). By default, the administrator account is:

- **Username**: yoga@studio.com  
- **Password**: test!1234

## Back-end Project Tests

Run the following command to test the project:

```
mvn clean test
```

The coverage report is available here :
```
back/target/site/jacoco/index.html
```
## Front-end Project Tests

### E2E Tests

To run E2E tests, use the following command:

```
npm run e2e
```

To run all tests in a single file:

```
npx cypress run --spec "cypress/e2e/all.cy.ts"
```

Alternatively, in GUI mode:

```
npx cypress open
```

Then select `all.cy.ts` in the Cypress interface.

To generate a coverage report (be sure to run the E2E tests from the `all.cy.ts` file beforehand):

```
npm run e2e:coverage
```

The coverage report is available here:

```
front/coverage/lcov-report/index.html
```

### Unit Tests

To run unit tests, use the following command:

```
npm run test
```

To watch for changes in real-time:

```
npm run test:watch
```