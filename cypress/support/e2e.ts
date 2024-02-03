declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user programmatically.
     * @example cy.login('user@example.com', 'password')
     */
    login(username: string, password: string): Chainable<void>;
  }
};
