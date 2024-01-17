import { AuthState } from "@/redux/types/auth.types";

describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.wait(500);
    cy.window().then((win) => {
      assert.isDefined(win.store, "store is defined on window");
    });
    cy.url().should("include", "/auth/login");
    cy.clearCookies();
    cy.window()
      .its("store")
      .invoke("dispatch", { type: "auth/resetAuthState" });
  });

  it("should register a new user successfully", () => {
    // Steps to navigate to the registration page
    // Fill out the registration form and submit
    // Assertions to confirm registration was successful
  });

  it("should log in a user successfully", () => {
    // Steps to navigate to the login page
    // Fill out the login form and submit
    // Assertions to confirm login was successful
  });

  it("should handle session expiry correctly", () => {
    // Logic to simulate a session expiry (if applicable)
    // Assertions to confirm the app behaves as expected after session expiry
  });

  it("should refresh the token periodically", () => {
    // Steps to perform actions that would trigger a token refresh
    // Assertions to confirm a new token was fetched and stored
  });

  it("should refresh the token on a 401 response and retry the request", () => {
    // Mock an API call that returns a 401
    cy.intercept("GET", "/api/protected-endpoint", (req) => {
      req.reply((res) => {
        res.send(401);
      });
    }).as("protectedEndpoint");

    // Mock the token refresh call
    cy.intercept("POST", "/api/refresh", {
      statusCode: 200,
      body: {
        accessToken: "new-access-token",
      },
    }).as("refreshToken");

    // Perform an action that triggers the protected API call
    // ...

    // Wait for the protected endpoint to return 401
    cy.wait("@protectedEndpoint");

    // Wait for the token refresh call
    cy.wait("@refreshToken");

    // Assert that the token was refreshed
    // (You might check the local state, Redux store, or localStorage, depending on your implementation)
    // ...

    // Optionally, assert that the original request was retried
    // ...
  });

  it("should verify the session periodically", () => {
    // Mock the verifyToken API call
    cy.intercept("POST", "/api/verifyToken", {
      statusCode: 200,
      body: {
        // Mocked response data
      },
    }).as("verifyToken");

    // Visit the page that initializes the session verification
    cy.visit("/");

    // Wait for the first verifyToken call to complete
    cy.wait("@verifyToken");

    // Use cy.clock() and cy.tick() to simulate the passage of time if your verification occurs at set intervals
    // cy.clock();
    // cy.tick(timeInMilliseconds);

    // Wait for the next verifyToken call
    // cy.wait('@verifyToken');

    // Assert any changes in the application state or UI as a result of session verification
    // ...
  });

  it.only("should log out a user successfully", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        message: "Successful login",
        access_token: "fake-token",
        user: {
          id: "fake-id",
          username: "testuser",
          email: "testuser@example.com",
        },
      },
    }).as("login");

    cy.intercept("POST", "/api/auth/logout", {
      statusCode: 200,
    }).as("logout");

    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="password"]').type("password123");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@login")

    cy.get('[data-testid="logout-button"]').click();
    cy.wait("@logout");

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.isAuthenticated).to.be.false;
        expect(authState.token).to.be.null;
      });
  });
});
