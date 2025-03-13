describe('Session spec', () => {
  beforeEach(() => {
    // Given - User is on the login page and intercepts session-related APIs
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'test',
          date: '2025-01-23T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'just a test',
          users: [],
          createdAt: '2025-01-31T18:52:19',
          updatedAt: '2025-01-31T18:52:19',
        },
        {
          id: 2,
          name: 'test2',
          date: '2025-01-23T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'just a test2',
          users: [],
          createdAt: '2025-01-31T18:52:19',
          updatedAt: '2025-01-31T18:52:19',
        },
      ],
    });

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'test',
        date: '2025-01-23T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'just a test',
        users: [],
        createdAt: '2025-01-31T18:52:19',
        updatedAt: '2025-01-31T18:52:19',
      },
    });
    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          lastName: 'Ben',
          firstName: 'Sab',
          createdAt: '2025-01-31T18:52:19',
          updatedAt: '2025-01-31T18:52:19',
        },
        {
          id: 2,
          lastName: 'Doe',
          firstName: 'John',
          createdAt: '2025-01-31T18:52:19',
          updatedAt: '2025-01-31T18:52:19',
        },
      ],
    });
  });

  it('displays the list of sessions', () => {
    // Given - User is on the login page
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    // Then - User should be redirected to the sessions page
    cy.url().should('include', '/sessions');
  });

  it('shows "Create" and "Detail" buttons for admin users', () => {
    // Then - "Create" and "Detail" buttons should be visible for admin users
    cy.contains('button', 'Create').should('be.visible');
    cy.contains('button', 'Detail').should('be.visible');
  });

  it('displays session information correctly', () => {
    // When - User clicks on the Detail button
    cy.contains('Detail').click();
    // Then - Session information should be displayed
  });

  it('displays "Delete" button for admin user', () => {
    // Then - "Delete" button should be visible for admin users
    cy.contains('button', 'Delete').should('be.visible');
  });

  it('shows an error when a required field is missing during session creation', () => {
    // Given - User is on the session creation page
    cy.contains('Session').click();
    cy.contains('Create').click();

    // When - User submits the form without filling all required fields
    cy.intercept('POST', '/api/session', {
      statusCode: 401,
      body: {
        path: '/api/session',
        error: 'Unauthorized',
        message: 'Bad credentials',
        status: 401,
      },
    });

    cy.get('button[type=submit]').should('be.disabled');

    cy.get('input[formControlName=name]').type('test');
    cy.get('input[formControlName=date]').type('2025-01-03');
    cy.get('textarea[formControlName="description"]').type(
      `${'Description de la session'}{enter}{enter}`
    );
    cy.get('form').submit();

    // Then - The submit button should remain disabled
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('session created successfuly', () => {
    // Given - User is on the session creation page
    cy.intercept('POST', '/api/session', {
      body: {
        id: 3,
        name: 'Session de test',
        date: '2012-01-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'Description de la session',
        users: [],
        createdAt: '2025-01-03T21:56:33.456',
        updatedAt: '2025-01-03T21:56:33.467',
      },
    });
    cy.contains('Session').click();
    cy.contains('Create').click();

    // When - User fills the session form and submits
    cy.get('input[formControlName="name"]').type('Session de test');
    cy.get('input[formControlName="date"]').type('2025-01-03');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('John Doe').click();
    cy.get('textarea[formControlName="description"]').type(
      'Description de la session'
    );
    cy.get('button[type="submit"]').click();

    // Then - The session should be created successfully
    cy.url().should('include', '/sessions');
  });

  it('shows an error when a required field is missing during session editing', () => {
    // When - User clicks on Edit button
    cy.contains('Edit').click();
    cy.intercept('POST', '/api/session', {
      statusCode: 401,
      body: {
        path: '/api/session',
        error: 'Unauthorized',
        message: 'Bad credentials',
        status: 401,
      },
    });
    // When - User clears the name field and loses focus
    cy.get('input[formControlName="name"]').clear().blur();
    cy.get('input[formControlName="name"]').should('have.class', 'ng-invalid');
    cy.get('input[formControlName="name"]').clear();
    // Then - The submit button should be disabled
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('edits a session successfully', () => {
    // Given - User is on the session editing page
    cy.intercept('PUT', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session de test',
        date: '2025-01-23T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'just a test',
        users: [],
        createdAt: '2025-01-31T18:52:19',
        updatedAt: '2025-01-31T18:52:19',
      },
    });
    cy.get('input[formControlName="name"]')
      .clear()
      .should('have.value', '')
      .type('Session de test');
    // When - User clicks on Save button
    cy.contains('Save').click();
    // Then - The session should be edited successfully
    cy.url().should('include', '/sessions');
  });

  it('deletes a session successfully', () => {
    // When - User clicks on Detail button and then Delete button
    cy.contains('Detail').click();
    cy.intercept('DELETE', '/api/session/1', {});
    cy.contains('Delete').click();
    // Then - The session should be deleted successfully
    cy.url().should('include', '/sessions');
  });
});
