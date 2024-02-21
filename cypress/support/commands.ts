declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user programmatically.
       * @example cy.login('user@example.com', 'password')
       */
      login(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.intercept("POST", "http://localhost:3001/api/auth/login").as("loginRequest");
  cy.visit("/auth/login");
  cy.get("input[name=username]").type(username);
  cy.get("input[name=password]").type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.wait("@loginRequest");
});

export {};