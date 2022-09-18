describe("signing up", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.dataCy("signup-tab").click();
  });

  it("handles validation errors", () => {
    cy.dataCy("signup-name").type("Sancho Sample");
    cy.dataCy("signup-email").type("sancho@example.com");
    cy.dataCy("signup-password").type("supersecret");
    cy.dataCy("signup-password-confirmation").type("doesntmatch");
    cy.dataCy("signup-submit").click();

    cy.dataCy("signup-password-confirmation")
      .closest("fieldset")
      .dataCy("field-errors")
      .should("contain", "doesn’t match");
  });

  it("signs up a user", () => {
    cy.dataCy("signup-name").type("Sancho Sample");
    cy.dataCy("signup-email").type("sancho@example.com");
    cy.dataCy("signup-password").type("supersecret");
    cy.dataCy("signup-password-confirmation").type("supersecret");
    cy.dataCy("signup-submit").click();

    cy.dataCy("no-flights").should("exist");
  });
});

describe("logging in", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("does not authenticate an invalid login", () => {
    cy.dataCy("login-email").type("cypress@example.com");
    cy.dataCy("login-password").type("wrongpassword");
    cy.dataCy("login-submit").click();

    cy.dataCy("login-error").should("contain", "Incorrect email or password");
  });

  it("authenticates a valid login", () => {
    cy.dataCy("login-email").type("cypress@example.com");
    cy.dataCy("login-password").type("supersecret");
    cy.dataCy("login-submit").click();

    cy.dataCy("flight-list").should("exist");
  });
});

describe("forgot password", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("does not send an email for an unknown email", () => {
    cy.dataCy("forgot-password-link").click();
    cy.dataCy("forgot-password-email").type("unknown@example.com");
    cy.dataCy("forgot-password-submit").click();

    cy.dataCy("forgot-password-success").should("exist");
    cy.lastEmail().should("be.null");
  });

  context("known email", () => {
    beforeEach(() => {
      cy.dataCy("forgot-password-link").click();
      cy.dataCy("forgot-password-email").type("cypress@example.com");
      cy.dataCy("forgot-password-submit").click();
    });

    it("shows an error if the password doesn't match the confirmation", () => {
      cy.dataCy("forgot-password-success").should("exist");
      cy.lastEmail()
        .its("text")
        .then((email: string) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const url = email.match(/\[http:\/\/127\.0\.0\.1:4173(.+?)]/)![1];
          cy.visit(url);

          cy.dataCy("reset-password-password").type("newpassword");
          cy.dataCy("reset-password-password-confirmation").type("doesntmatch");
          cy.dataCy("reset-password-submit").click();

          cy.dataCy("reset-password-password-confirmation")
            .dataCy("field-errors")
            .should("contain", "doesn’t match");
        });
    });

    it("resets the password", () => {
      cy.dataCy("forgot-password-success").should("exist");
      cy.lastEmail()
        .its("text")
        .then((email: string) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const url = email.match(/\[http:\/\/127\.0\.0\.1:4173(.+?)]/)![1];
          cy.visit(url);

          cy.dataCy("reset-password-password").type("newpassword");
          cy.dataCy("reset-password-password-confirmation").type("newpassword");
          cy.dataCy("reset-password-submit").click();

          cy.dataCy("reset-password-success").should(
            "contain",
            "Your password has been changed."
          );

          cy.visit("/");
          cy.dataCy("login-email").type("cypress@example.com");
          cy.dataCy("login-password").type("newpassword");
          cy.dataCy("login-submit").click();

          cy.dataCy("flight-list").should("exist");
        });
    });
  });
});

describe("logging out", () => {
  beforeEach(() => {
    cy.login();
  });

  it("logs the user out", () => {
    cy.dataCy("nav-logout").click();
    cy.dataCy("nav-logout").should("not.exist");
    cy.dataCy("login-email").should("exist");
  });
});
