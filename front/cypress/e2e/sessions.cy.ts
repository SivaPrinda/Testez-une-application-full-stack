describe('Session spec', () => {
  // Before Each Test: Mock API Responses
  beforeEach(() => {
    // Mock login response
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true, // Admin user
      },
    });

    // Mock GET request for retrieving all sessions
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

    // Mock GET request for retrieving a specific session by ID
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

    // Mock GET request for retrieving teachers
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

  // Test 1: User login and redirection to session page
  it('displays the list of sessions', () => {
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.url().should('include', '/sessions'); // Verify redirection
  });

  // Test 2: Ensure admin can see "Create" and "Detail" buttons
  it('shows "Create" and "Detail" buttons for admin users', () => {
    cy.contains('button', 'Create').should('be.visible');
    cy.contains('button', 'Detail').should('be.visible');
  });

  // Test 3: Click "Detail" button to view session details
  it('displays session information correctly', () => {
    //  Navigate to the session detail page
    cy.contains('Detail').click();

    //  Verify session image is displayed
    cy.get('img.picture').should('have.attr', 'src', 'assets/sessions.png');

    //  Verify number of attendees
    cy.get('span.ml1').contains('0 attendees');

    //  Verify session date format is correct
    cy.get('span.ml1').contains('January 23, 2025');

    //  Verify session description is displayed
    cy.get('.description').should('contain.text', 'just a test');

    //  Verify created at & last update dates
    cy.get('.created')
      .invoke('text') // Get the text inside the element
      .then((text) => text.trim().replace(/\s+/g, ' ')) //  Normalize spaces
      .should('contain', 'Create at: January 31, 2025');

    cy.get('.updated')
      .invoke('text')
      .then((text) => text.trim().replace(/\s+/g, ' '))
      .should('contain', 'Last update: January 31, 2025');
  });

  // Test 4: Verify admin can see the "Delete" button
  it('displays "Delete" button for admin user', () => {
    cy.contains('button', 'Delete').should('be.visible');
  });

  // Test 5: Ensure an error appears when required fields are missing during session creation
  it('shows an error when a required field is missing during session creation', () => {
    cy.contains('Session').click();
    cy.contains('Create').click();

    // Mock unsuccessful session creation request (Unauthorized)
    cy.intercept('POST', '/api/session', {
      statusCode: 401,
      body: {
        path: '/api/session',
        error: 'Unauthorized',
        message: 'Bad credentials',
        status: 401,
      },
    });

    // Ensure submit button is disabled before filling fields
    cy.get('button[type=submit]').should('be.disabled');

    // Fill session form
    cy.get('input[formControlName=name]').type('test');
    cy.get('input[formControlName=date]').type('2025-01-03');
    cy.get('textarea[formControlName="description"]').type(
      'Description de la session'
    );

    // Submit form
    cy.get('form').submit();

    // Ensure submit button is still disabled due to error
    cy.get('button[type=submit]').should('be.disabled');
  });

  // Test 6: Successfully create a session
  it('session created successfully', () => {
    cy.intercept('POST', '/api/session', {
      body: {
        id: 3,
        name: 'Session de test',
        date: '2025-01-01T00:00:00.000+00:00',
        teacher_id: 2,
        description: 'Description de la session',
        users: [],
        createdAt: '2025-01-03T21:56:33.456',
        updatedAt: '2025-01-03T21:56:33.467',
      },
    });

    cy.contains('Session').click();
    cy.contains('Create').click();
    cy.get('input[formControlName="name"]').type('Session de test');
    cy.get('input[formControlName="date"]').type('2025-01-03');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.get('mat-option').contains('John Doe').click();
    cy.get('textarea[formControlName="description"]').type(
      'Description de la session'
    );
    cy.get('button[type="submit"]').click();
  });

  // Test 7: Ensure an error appears when required fields are missing during session editing
  it('shows an error when a required field is missing during session editing', () => {
    cy.contains('Edit').click();

    // Mock unsuccessful session edit request (Unauthorized)
    cy.intercept('POST', '/api/session', {
      statusCode: 401,
      body: {
        path: '/api/session',
        error: 'Unauthorized',
        message: 'Bad credentials',
        status: 401,
      },
    });

    cy.get('input[formControlName="name"]').clear().blur();
    cy.get('input[formControlName="name"]').should('have.class', 'ng-invalid');
    cy.get('button[type=submit]').should('be.disabled');
  });

  // Test 8: Successfully edit a session
  it('edits a session successfully', () => {
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

    cy.get('input[formControlName="name"]').clear().type('Session de test');
    cy.contains('Save').click();
  });

  // Test 9: Successfully delete a session
  it('deletes a session successfully', () => {
    cy.contains('Detail').click();
    cy.intercept('DELETE', '/api/session/1', {});
    cy.contains('Delete').click();
  });
});
