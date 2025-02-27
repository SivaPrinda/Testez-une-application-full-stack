describe('Register spec', () => {
  it('shows an error when a required field is missing during account creation', () => {
    cy.visit('/register')

    cy.get('button[type=submit]').should('be.disabled')

    cy.get('input[formControlName=firstName]').type("John")
    cy.get('input[formControlName=lastName]').type("Doe")
    cy.get('input[formControlName=password]').type(`${"john123"}{enter}{enter}`)

    cy.get('form').submit();

    cy.get('button[type=submit]').should('be.disabled')
    cy.get('.error').should('contain', 'An error occurred');
  })

  it('Register successfull', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', {
      body: {
        message: 'User registered successfully!',
      },
    });

    cy.get('input[formControlName=firstName]').type('test');
    cy.get('input[formControlName=lastName]').type('test');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/login');
  });
});
