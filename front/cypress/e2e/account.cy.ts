describe('Account spec', () => {
  beforeEach(() => {
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

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
  });

  it('displays user information correctly', () => {
    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 1,
        email: 'yoga@studio.com',
        lastName: 'test',
        firstName: 'test',
        admin: false,
        createdAt: '2025-01-01T09:59:26',
        updatedAt: '2025-02-01T09:59:26',
      },
    }).as('user informations');

    // Click on Account to access to the account information
    cy.contains('Account').click();
    cy.contains('p', 'Name: test TEST').should('be.visible');

    cy.contains('p', 'Email: yoga@studio.com').should('be.visible');

    cy.contains('p', 'You are admin').should('not.exist');

    cy.contains('button', 'Detail').should('be.visible');

    cy.contains('p', 'Create at: January 1, 2025').should('be.visible');
    cy.contains('p', 'Last update: February 1, 2025').should('be.visible');
  });

  it('logs out successfully', () => {
    cy.contains('Logout').click();
  });
});
