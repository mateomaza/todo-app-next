Cypress.Commands.add("login", (username, password) => {
    cy.visit('/auth/login');
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('[data-testid="login-button"]').click();
  });