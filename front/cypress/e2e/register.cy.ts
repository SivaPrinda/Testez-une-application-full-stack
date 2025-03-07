describe('Register spec', () => {
  //  Display an error when a required field is missing
  it('shows an error when a required field is missing during account creation', () => {
    // Visit the registration page
    cy.visit('/register');

    // Ensure the "Submit" button is initially disabled
    cy.get('button[type=submit]').should('be.disabled');

    // Fill in some fields but leave the email field empty
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=password]').type(
      `${'john123'}{enter}{enter}`
    );

    // Attempt to submit the form
    cy.get('form').submit();

    // Verify that the "Submit" button remains disabled due to missing fields
    cy.get('button[type=submit]').should('be.disabled');

    // Check that an error message appears
    cy.get('.error').should('contain', 'An error occurred');
  });

  //  Successful user registration
  it('Register successful', () => {
    // Visit the registration page
    cy.visit('/register');

    // Mock the API response for successful registration
    cy.intercept('POST', '/api/auth/register', {
      body: {
        message: 'User registered successfully!',
      },
    });

    // Fill in all required fields
    cy.get('input[formControlName=firstName]').type('test');
    cy.get('input[formControlName=lastName]').type('test');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Verify that the user is redirected to the login page upon successful registration
    cy.url().should('include', '/login');
  });
});
