# Read Me First
The following was discovered as part of building this project:

# Getting Started

Follow these steps to set up and run the project on your local machine.Follow these steps to set up and run the project on your local machine.

Ensure the following are installed on your system:

## Prerequisites

1. **Java 11**  
   Check your Java version:
```
   java -version
```
2. Maven
   Install Maven and verify its version:
```
   mvn -version
```

3. Git
   Clone the project repository with Git:
```
   git clone https://github.com/SivaPrinda/Testez-une-application-full-stack.git
```

4. MySQL Database
   
   Set up a MySQL server

   - Run the file "Testez-une-application-full-stack/ressources/sql/script.sql" to create a database for the project.

   - Change the application.properties with your database connection information

   Example :
 ```  
   spring.datasource.url=jdbc:mysql://localhost:3306/yoga?allowPublicKeyRetrieval=true
   spring.datasource.username=exemple
   spring.datasource.password=exemple123
 ```
## Build and Run

Go inside the project:
```
   cd Testez-une-application-full-stackback/back
```
Run the following command to build and run the project:
```
   mvn clean install
```
```
   mvn spring-boot:run
```
## Testing the project 
Run the following command to test the project
```
   mvn clean test 
```
Run the file "Testez-une-application-full-stack/back/target/site/jacoco/index.html" to have the coverage of the tests

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/3.3.4/maven-plugin)
* [Create an OCI image](https://docs.spring.io/spring-boot/3.3.4/maven-plugin/build-image.html)
* [Spring Web](https://docs.spring.io/spring-boot/docs/3.3.4/reference/htmlsingle/index.html#web)
* [Spring Security](https://docs.spring.io/spring-boot/docs/3.3.4/reference/htmlsingle/index.html#web.security)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
* [Spring Boot and OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
* [Authenticating a User with LDAP](https://spring.io/guides/gs/authenticating-ldap/)

### Maven Parent overrides

Due to Maven's design, elements are inherited from the parent POM to the project POM.
While most of the inheritance is fine, it also inherits unwanted elements like `<license>` and `<developers>` from the parent.
To prevent this, the project POM contains empty overrides for these elements.
If you manually switch to a different parent and actually want the inheritance, you need to remove those overrides.

