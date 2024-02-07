import { AuthState, User } from "@/redux/types/auth.types";

let requestCount = 0;

const expectedUser: User = {
  id: '123',
  username: 'testuser',
  email: 'newuser@test.com'
};

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
    requestCount = 0;
  });

  it("should register a new user successfully", () => {
    cy.intercept("POST", "/api/auth/register", {
      statusCode: 201,
      body: {
        user: expectedUser,
        access_token: 'access_token',
      },
    }).as("register");

    cy.visit("/auth/register");

    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="email"]').type("newuser@test.com");
    cy.get('input[name="password"]').type("password123");

    cy.get('[data-testid="register-button"]').click();

    cy.wait("@register");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.eq("access-token");
        expect(authState.user).to.deep.equal(expectedUser);
      });
  });

  it("should log in a user successfully", () => {
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        user: expectedUser,
        access_token: 'access_token',
      },
    }).as("login");

    cy.login("testuser", "password123");

    cy.wait("@login");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.eq("access-token");
        expect(authState.user).to.deep.equal(expectedUser);
      });
  });

  it("should handle session expiry correctly", () => {
    cy.login("testuser", "password123");
    cy.clock();

    cy.intercept("POST", "/api/auth/logout", {
      statusCode: 200
    }).as("logout");
  
    cy.tick(15 * 60 * 1000 + 1);
    cy.wait("@logout");

    cy.url().should("include", "/auth/login");
  
    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.false;
      expect(cookies.some((cookie) => cookie.name === 'authenticated')).to.be.false;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.false;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.be.null;
      });
  });

  it("should refresh the token periodically", () => {
    cy.login("testuser", "password123");
    cy.clock();

    cy.intercept("POST", "/api/auth/refresh", {
      statusCode: 201,
      body: {
        access_token: "new-access-token",
        user: expectedUser,
      },
    }).as("tokenRefresh");

    const expiryFromToken = 15 * 60;
    const buffer = 1 * 60;
    const timeToAdvance = (expiryFromToken - buffer) * 1000;

    cy.tick(timeToAdvance);
    cy.wait("@tokenRefresh");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.eq("new-access-token");
        expect(authState.user).to.deep.equal(expectedUser);
      });

    cy.tick(timeToAdvance);
    cy.wait("@tokenRefresh");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.eq("new-access-token");
        expect(authState.user).to.deep.equal(expectedUser);
      });
  });

  it("should refresh the token on a 401 response and retry the request", () => {
    cy.login("testuser", "password123");

    cy.intercept("GET", "/api/tasks", (req) => {
      requestCount++;
      req.reply((res) => {
        res.send(401);
      });
    }).as("expiredTokenRequest");

    cy.intercept("POST", "/api/auth/refresh", {
      statusCode: 201,
      body: {
        access_token: "new-access-token",
        user: expectedUser,
      },
    }).as("tokenRefresh");

    cy.wait("@expiredTokenRequest");
    cy.wait("@tokenRefresh");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.eq("new-access-token");
        expect(authState.user).to.deep.equal(expectedUser);
      });

    expect(requestCount).to.be.greaterThan(1);
  });

  it("should verify the session periodically", () => {
    cy.login("testuser", "password123");
    cy.clock();

    cy.intercept("POST", "/api/auth/verify-session", {
      statusCode: 200,
      body: { verified: true },
    }).as("verifySession");

    cy.url().should("include", "dashboard");

    cy.tick(13 * 60 * 1000 + 1);
    cy.wait("@verifySession");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });

    cy.tick(13 * 60 * 1000);
    cy.wait("@verifySession");

    cy.url().should("include", "dashboard");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'authenticated' && cookie.value === 'true')).to.be.true;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.true;
    });
  });

  it("should log out a user successfully", () => {
    cy.login("testuser", "password123");

    cy.intercept("POST", "/api/auth/logout", {
      statusCode: 200
    }).as("logout");

    cy.get('[data-testid="logout-button"]').click();

    cy.wait("@logout");

    cy.url().should("include", "auth/login");

    cy.getCookies().should((cookies) => {
      expect(cookies.some((cookie) => cookie.name === 'refresh_token')).to.be.false;
      expect(cookies.some((cookie) => cookie.name === 'authenticated')).to.be.false;
      expect(cookies.some((cookie) => cookie.name === 'session')).to.be.false;
    });

    cy.window()
      .its("store")
      .invoke("getState")
      .its("auth")
      .then((authState: AuthState) => {
        expect(authState.token).to.be.null;
      });
  });
});
