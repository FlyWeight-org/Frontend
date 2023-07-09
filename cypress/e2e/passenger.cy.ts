describe("as a passenger", () => {
  beforeEach(() => {
    cy.visit(`/flights/${Cypress.env("flightUUID")}`);
  });

  it("displays the unauthorized flight page", () => {
    cy.dataCy("flight-unauth-title").should(
      "contain",
      "Are you going on a flight with Cypress User on"
    );
  });

  it("handles form errors", () => {
    cy.dataCy("passenger-name").type(" ");
    cy.dataCy("passenger-weight").type("123");
    cy.dataCy("passenger-submit").click();

    cy.dataCy("passenger-name")
      .dataCy("field-errors")
      .should("contain", "can’t be blank");
  });

  it("adds a passenger", () => {
    cy.dataCy("passenger-name").type("New Pax");
    cy.dataCy("passenger-weight").type("123");
    cy.dataCy("passenger-bags-weight").type("23");
    cy.dataCy("passenger-covid19-vaccination").click();
    cy.dataCy("passenger-submit").click();

    cy.dataCy("flight-finished").should("exist");

    cy.login();
    cy.dataCy("flight-list-item").click();
    cy.dataCy("passenger-list-item").should("have.length", 2);
    cy.dataCy("passenger-list-item")
      .last()
      .within(() => {
        cy.dataCy("passenger-name").should("contain", "New Pax");
        cy.dataCy("passenger-weight").should("contain", "123");
        cy.dataCy("passenger-bags-weight").should("contain", "23");
        cy.dataCy("passenger-covid19-vaccination").should("exist");
      });

    cy.dataCy("total-weight").should("contain", "331 lb");
    cy.dataCy("total-weight-breakdown").should(
      "contain",
      "(137 lb avg. passenger, 58 lb total cargo)"
    );
  });

  it("updates a passenger", () => {
    cy.dataCy("passenger-name").type("Example Passenger");
    cy.dataCy("passenger-weight").type("123");
    cy.dataCy("passenger-bags-weight").type("23");
    cy.dataCy("passenger-submit").click();

    cy.dataCy("flight-finished").should("exist");

    cy.login();
    cy.dataCy("flight-list-item").click();
    cy.dataCy("passenger-list-item").should("have.length", 1);
    cy.dataCy("passenger-list-item")
      .last()
      .within(() => {
        cy.dataCy("passenger-name").should("contain", "Example Passenger");
        cy.dataCy("passenger-weight").should("contain", "123");
        cy.dataCy("passenger-bags-weight").should("contain", "23");
      });

    cy.dataCy("total-weight").should("contain", "171 lb");
    cy.dataCy("total-weight-breakdown").should(
      "contain",
      "(123 lb avg. passenger, 48 lb total cargo)"
    );
  });
});
