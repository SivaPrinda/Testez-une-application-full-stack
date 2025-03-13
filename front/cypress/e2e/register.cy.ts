describe('Register spec', () => {
  it('shows an error when a required field is missing during account creation', () => {
    // Given - User is on the register page
    cy.visit('/register');

    // When - User attempts to submit the form without filling all required fields
    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=password]').type(
      `${'john123'}{enter}{enter}`
    );

    cy.get('form').submit();

    // Then - The submit button should remain disabled and an error message should be displayed
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('.error').should('contain', 'An error occurred');
  });

  it('Register successfull', () => {
    // Given - User is on the register page and intercepts the registration API
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', {
      body: {
        message: 'User registered successfully!',
      },
    });

    // When - User fills the registration form and submits
    cy.get('input[formControlName=firstName]').type('test');
    cy.get('input[formControlName=lastName]').type('test');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Then - User should be redirected to the login page
    cy.url().should('include', '/login');
  });
});