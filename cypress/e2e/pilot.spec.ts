describe("as a pilot", () => {
  beforeEach(() => {
    cy.login();
  });

  context("viewing flights", () => {
    it("displays a list of flights", () => {
      cy.dataCy("flight-list").should("have.length", 1);
    });
  });

  context("creating a flight", () => {
    beforeEach(() => {
      cy.dataCy("nav-add-flight").click();
    });

    it.skip("displays errors", () => {
      cy.dataCy("flight-date").click();
      cy.dataCy("flight-description").type("example flight description");
      cy.dataCy("flight-submit").click();

      cy.dataCy("flight-date")
        .dataCy("field-errors")
        .should("contain", "invalid");
    });

    it("creates a flight", () => {
      cy.dataCy("flight-date").click();
      cy.get(".dp__calendar_item[aria-disabled=false]").first().click();
      cy.get(".dp__select").click();
      cy.dataCy("flight-description").type("example flight description");
      cy.dataCy("flight-submit").click();

      cy.dataCy("authorized-flight").should("exist");
    });
  });

  context("editing a flight", () => {
    beforeEach(() => {
      cy.dataCy("flight-list-item").click();
    });

    it.skip("displays errors", () => {
      cy.dataCy("flight-date").click();
      cy.dataCy("flight-submit").click();

      cy.dataCy("flight-date")
        .dataCy("field-errors")
        .should("contain", "invalid");
    });

    it("edits a flight", () => {
      cy.dataCy("flight-description").clear().type("new description");
      cy.dataCy("flight-submit").click();
      cy.reload();

      cy.dataCy("flight-description").should("have.value", "new description");
    });
  });

  context("loads", () => {
    beforeEach(() => {
      cy.dataCy("flight-list-item").click();
    });

    context("passengers", () => {
      it("displays errors", () => {
        cy.dataCy("passenger-manifest").within(() => {
          cy.dataCy("add-load").click();

          cy.dataCy("passenger-form").within(() => {
            cy.dataCy("passenger-name").type("New Pax");
            cy.dataCy("passenger-weight").type("0");
            cy.dataCy("passenger-submit").click();
          });

          cy.dataCy("passenger-weight")
            .dataCy("field-errors")
            .should("contain", "greater than 0");
        });
      });

      it("adds a load", () => {
        cy.dataCy("passenger-manifest").within(() => {
          cy.dataCy("add-load").click();

          cy.dataCy("passenger-form").within(() => {
            cy.dataCy("passenger-name").type("New Pax");
            cy.dataCy("passenger-weight").type("180");
            cy.dataCy("passenger-bags-weight").type("25");
            cy.dataCy("passenger-covid19-vaccination").click();
            cy.dataCy("passenger-submit").click();
          });

          cy.dataCy("passenger-list-item").should("have.length", 2);
          cy.dataCy("passenger-list-item")
            .last()
            .within(() => {
              cy.dataCy("passenger-name").should("contain", "New Pax");
              cy.dataCy("passenger-weight").should("contain", "180");
              cy.dataCy("passenger-bags-weight").should("contain", "25");
              cy.dataCy("passenger-covid19-vaccination").should("exist");
            });
        });

        cy.dataCy("total-weight").should("contain", "390 lb");
        cy.dataCy("total-weight-breakdown").should(
          "contain",
          "(165 lb avg. passenger, 60 lb total cargo)"
        );
      });

      it("updates an existing load", () => {
        cy.dataCy("passenger-manifest").within(() => {
          cy.dataCy("add-load").click();

          cy.dataCy("passenger-form").within(() => {
            cy.dataCy("passenger-name").type("Example Passenger");
            cy.dataCy("passenger-weight").type("180");
            cy.dataCy("passenger-bags-weight").type("25");
            cy.dataCy("passenger-submit").click();
          });

          cy.dataCy("passenger-list-item").should("have.length", 1);
          cy.dataCy("passenger-list-item").within(() => {
            cy.dataCy("passenger-name").should("contain", "Example Passenger");
            cy.dataCy("passenger-weight").should("contain", "180");
            cy.dataCy("passenger-bags-weight").should("contain", "25");
            cy.dataCy("passenger-covid19-vaccination").should("not.exist");
          });
        });

        cy.dataCy("total-weight").should("contain", "230 lb");
        cy.dataCy("total-weight-breakdown").should(
          "contain",
          "(180 lb avg. passenger, 50 lb total cargo)"
        );
      });

      it("disables a load", () => {
        cy.dataCy("passenger-enabled").uncheck();
        cy.dataCy("total-weight").should("contain", "25 lb");
        cy.dataCy("total-weight-breakdown").should("not.exist");
      });

      it("removes a load", () => {
        cy.dataCy("passenger-delete").click({ force: true });
        cy.dataCy("no-passengers").should("exist");

        cy.dataCy("total-weight").should("contain", "25 lb");
        cy.dataCy("total-weight-breakdown").should("not.exist");
      });
    });

    context("cargo", () => {
      it("displays errors", () => {
        cy.dataCy("cargo-manifest").within(() => {
          cy.dataCy("add-load").click();

          cy.dataCy("cargo-form").within(() => {
            cy.dataCy("cargo-name").type("New Cargo");
            cy.dataCy("cargo-weight").type("0");
            cy.dataCy("cargo-submit").click();
          });

          cy.dataCy("cargo-weight")
            .dataCy("field-errors")
            .should("contain", "greater than 0");
        });
      });

      it("adds a load", () => {
        cy.dataCy("cargo-manifest").within(() => {
          cy.dataCy("add-load").click();

          cy.dataCy("cargo-form").within(() => {
            cy.dataCy("cargo-name").type("New Cargo");
            cy.dataCy("cargo-weight").type("50");
            cy.dataCy("cargo-submit").click();
          });

          cy.dataCy("cargo-list-item").should("have.length", 2);
          cy.dataCy("cargo-list-item")
            .last()
            .within(() => {
              cy.dataCy("cargo-name").should("contain", "New Cargo");
              cy.dataCy("cargo-weight").should("contain", "50");
            });
        });

        cy.dataCy("total-weight").should("contain", "235 lb");
        cy.dataCy("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 85 lb total cargo)"
        );
      });

      it("updates an existing load", () => {
        cy.dataCy("cargo-manifest").within(() => {
          cy.dataCy("add-load").click();

          cy.dataCy("cargo-form").within(() => {
            cy.dataCy("cargo-name").type("Example Cargo");
            cy.dataCy("cargo-weight").type("50");
            cy.dataCy("cargo-submit").click();
          });

          cy.dataCy("cargo-list-item").should("have.length", 1);
          cy.dataCy("cargo-list-item").within(() => {
            cy.dataCy("cargo-name").should("contain", "Example Cargo");
            cy.dataCy("cargo-weight").should("contain", "50");
          });
        });

        cy.dataCy("total-weight").should("contain", "210 lb");
        cy.dataCy("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 60 lb total cargo)"
        );
      });

      it("disables a load", () => {
        cy.dataCy("cargo-enabled").uncheck();

        cy.dataCy("total-weight").should("contain", "160 lb");
        cy.dataCy("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 10 lb total cargo)"
        );
      });

      it("removes a load", () => {
        cy.dataCy("cargo-delete").click({ force: true });
        cy.dataCy("no-cargo").should("exist");

        cy.dataCy("total-weight").should("contain", "160 lb");
        cy.dataCy("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 10 lb total cargo)"
        );
      });
    });
  });

  context("deleting a flight", () => {
    beforeEach(() => {
      cy.dataCy("flight-list-item").click();
    });

    it("deletes a flight", () => {
      cy.dataCy("delete-flight").click();
      cy.dataCy("no-flights").should("exist");
    });
  });
});
