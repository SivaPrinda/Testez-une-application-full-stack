// User Account Management
describe('Account spec', () => {
  // Before each test, perform login
  beforeEach(() => {
    // Visit the login page
    cy.visit('/login');

    // Mock API response for successful login
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    // Fill in login form and submit
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
  });

  // Verify that user account information is displayed correctly
  it('displays user information correctly', () => {
    // Mock API response for fetching user details
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

    // Click on "Account" to access user details
    cy.contains('Account').click();

    // Verify user full name is displayed correctly (last name should be uppercase)
    cy.contains('p', 'Name: test TEST').should('be.visible');

    // Verify user email is displayed correctly
    cy.contains('p', 'Email: yoga@studio.com').should('be.visible');

    // Verify that "You are admin" text does not exist since user is not an admin
    cy.contains('p', 'You are admin').should('not.exist');

    // Verify that the "Detail" button is visible
    cy.contains('button', 'Detail').should('be.visible');

    // Verify account creation and last update timestamps
    cy.contains('p', 'Create at: January 1, 2025').should('be.visible');
    cy.contains('p', 'Last update: February 1, 2025').should('be.visible');
  });

  // Verify that user can log out successfully
  it('logs out successfully', () => {
    // Click on the "Logout" button
    cy.contains('Logout').click();
  });
});
