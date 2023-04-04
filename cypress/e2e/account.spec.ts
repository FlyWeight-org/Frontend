describe("Account page", () => {
  beforeEach(() => {
    cy.login();
    cy.dataCy("nav-account").click();
  });

  context("editing account", () => {
    it("displays errors", () => {
      cy.dataCy("account-name").clear()
      cy.dataCy("account-name").type(" ");
      cy.dataCy("account-password").type("supersecret");
      cy.dataCy("account-submit").click();

      cy.dataCy("account-name")
        .dataCy("field-errors")
        .should("contain", "can’t be blank");
      cy.dataCy("account-success").should("not.exist");
    });

    it("requires the user's password", () => {
      cy.dataCy("account-name").clear()
      cy.dataCy("account-name").type(" ");
      cy.dataCy("account-password").type("wrongpassword");
      cy.dataCy("account-submit").click();

      cy.dataCy("account-password")
        .dataCy("field-errors")
        .should("contain", "invalid");
      cy.dataCy("account-success").should("not.exist");
    });

    it("updates the user's account", () => {
      cy.dataCy("account-name").clear()
      cy.dataCy("account-name").type("New Name");
      cy.dataCy("account-password").type("supersecret");
      cy.dataCy("account-submit").click();

      cy.dataCy("account-success").should("exist");
    });
  });

  context("changing password", () => {
    it("requires the user's password", () => {
      cy.dataCy("account-password").type("wrongpassword");
      cy.dataCy("account-new-password").type("newpassword");
      cy.dataCy("account-new-password-confirmation").type("newpassword");
      cy.dataCy("account-submit").click();

      cy.dataCy("account-password")
        .dataCy("field-errors")
        .should("contain", "invalid");
      cy.dataCy("account-success").should("not.exist");
    });

    it("does not update the password if the confirmation doesn't match", () => {
      cy.dataCy("account-password").type("supersecret");
      cy.dataCy("account-new-password").type("newpassword");
      cy.dataCy("account-new-password-confirmation").type("doesntmatch");
      cy.dataCy("account-submit").click();

      cy.dataCy("account-new-password-confirmation")
        .dataCy("field-errors")
        .should("contain", "doesn’t match");
      cy.dataCy("account-success").should("not.exist");
    });

    it("changes the user's password", () => {
      cy.dataCy("account-password").type("supersecret");
      cy.dataCy("account-new-password").type("newpassword");
      cy.dataCy("account-new-password-confirmation").type("newpassword");
      cy.dataCy("account-submit").click();

      cy.dataCy("account-success").should("exist");

      cy.dataCy("nav-logout").click();
      cy.dataCy("login-email").type("cypress@example.com");
      cy.dataCy("login-password").type("newpassword");
      cy.dataCy("login-submit").click();
      cy.dataCy("flight-list").should("exist");
    });
  });
});
