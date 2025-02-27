describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('displays an error for incorrect login or password', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        path: '/api/auth/login',
        error: 'Unauthorized',
        message: 'Bad credentials',
        status: 401,
      },
    });

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(`${'test'}{enter}{enter}`);

    cy.get('div.login')
      .find('mat-card')
      .find('form.login-form')
      .find('p')
      .contains('An error occurred')
      .should('be.visible');
  });

  it('shows an error when a required field is missing', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        path: '/api/auth/login',
        error: 'Unauthorized',
        message: 'Bad credentials',
        status: 401,
      },
    });

    cy.get('input[formControlName=email]').type('{enter}{enter}{enter}');

    cy.get('div.login')
      .find('mat-card')
      .find('form.login-form')
      .find('mat-card-content')
      .each(($row) => {
        cy.wrap($row)
          .find('mat-form-field')
          .should('have.class', 'mat-form-field-invalid');
      });

    cy.get('div.login')
      .find('mat-card')
      .find('form.login-form')
      .find('p')
      .contains('An error occurred')
      .should('be.visible');
  });
});
