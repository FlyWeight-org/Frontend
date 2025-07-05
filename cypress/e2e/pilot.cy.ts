describe("as a pilot", () => {
  beforeEach(() => {
    cy.login();
  });

  context("viewing flights", () => {
    it("displays a list of flights", () => {
      cy.findAllByTestId("flight-list").should("have.length", 1);
    });
  });

  context("creating a flight", () => {
    beforeEach(() => {
      cy.findByTestId("nav-add-flight").click();
    });

    it.skip("displays errors", () => {
      cy.findByTestId("flight-date").click();
      cy.findByTestId("flight-description").type("example flight description");
      cy.findByTestId("flight-submit").click();

      cy.errorsFor('date').should('contain', 'invalid');
    });

    it("creates a flight", () => {
      cy.findByTestId("flight-date").click();
      cy.get(".dp__calendar_item:not([aria-disabled])").first().click();
      cy.get(".dp__action_select").click();
      cy.findByTestId("flight-description").type("example flight description");
      cy.findByTestId("flight-submit").click();

      cy.findByTestId("authorized-flight").should("exist");
    });
  });

  context("editing a flight", () => {
    beforeEach(() => {
      cy.findByTestId("flight-list-item").click();
    });

    it.skip("displays errors", () => {
      cy.findByTestId("flight-date").click();
      cy.findByTestId("flight-submit").click();

      cy.errorsFor('date').should('contain', 'invalid');
    });

    it("edits a flight", () => {
      cy.findByTestId("flight-description").clear()
      cy.findByTestId("flight-description").type("new description");
      cy.findByTestId("flight-submit").click();
      cy.reload();

      cy.findByTestId("flight-description").should("have.value", "new description");
    });
  });

  context("loads", () => {
    beforeEach(() => {
      cy.findByTestId("flight-list-item").click();
    });

    context("passengers", () => {
      it("displays errors", () => {
        cy.findByTestId("passenger-manifest").within(() => {
          cy.findByTestId("add-load").click();

          cy.findByTestId("passenger-form").within(() => {
            cy.findByTestId("passenger-name").type("New Pax");
            cy.findByTestId("passenger-weight").type("0");
            cy.findByTestId("passenger-submit").click();
          });

          cy.errorsFor('weight').should('contain', 'greater than 0');
        });
      });

      it("adds a load", () => {
        cy.findByTestId("passenger-manifest").within(() => {
          cy.findByTestId("add-load").click();

          cy.findByTestId("passenger-form").within(() => {
            cy.findByTestId("passenger-name").type("New Pax");
            cy.findByTestId("passenger-weight").type("180");
            cy.findByTestId("passenger-bags-weight").type("25");
            cy.findByTestId("passenger-submit").click();
          });

          cy.findAllByTestId("passenger-list-item").should("have.length", 2);
          cy.findAllByTestId("passenger-list-item")
            .last()
            .within(() => {
              cy.findByTestId("passenger-name").should("contain", "New Pax");
              cy.findByTestId("passenger-weight").should("contain", "180");
              cy.findByTestId("passenger-bags-weight").should("contain", "25");
            });
        });

        cy.findByTestId("total-weight").should("contain", "390 lb");
        cy.findByTestId("total-weight-breakdown").should(
          "contain",
          "(165 lb avg. passenger, 60 lb total cargo)"
        );
      });

      it("updates an existing load", () => {
        cy.findByTestId("passenger-manifest").within(() => {
          cy.findByTestId("add-load").click();

          cy.findByTestId("passenger-form").within(() => {
            cy.findByTestId("passenger-name").type("Example Passenger");
            cy.findByTestId("passenger-weight").type("180");
            cy.findByTestId("passenger-bags-weight").type("25");
            cy.findByTestId("passenger-submit").click();
          });

          cy.findAllByTestId("passenger-list-item").should("have.length", 1);
          cy.findByTestId("passenger-list-item").within(() => {
            cy.findByTestId("passenger-name").should("contain", "Example Passenger");
            cy.findByTestId("passenger-weight").should("contain", "180");
            cy.findByTestId("passenger-bags-weight").should("contain", "25");
          });
        });

        cy.findByTestId("total-weight").should("contain", "230 lb");
        cy.findByTestId("total-weight-breakdown").should(
          "contain",
          "(180 lb avg. passenger, 50 lb total cargo)"
        );
      });

      it("disables a load", () => {
        cy.findByTestId("passenger-enabled").uncheck();
        cy.findByTestId("total-weight").should("contain", "25 lb");
        cy.findByTestId("total-weight-breakdown").should("not.exist");
      });

      it("removes a load", () => {
        cy.findByTestId("passenger-delete").click({ force: true });
        cy.findByTestId("no-passengers").should("exist");

        cy.findByTestId("total-weight").should("contain", "25 lb");
        cy.findByTestId("total-weight-breakdown").should("not.exist");
      });
    });

    context("cargo", () => {
      it("displays errors", () => {
        cy.findByTestId("cargo-manifest").within(() => {
          cy.findByTestId("add-load").click();

          cy.findByTestId("cargo-form").within(() => {
            cy.findByTestId("cargo-name").type("New Cargo");
            cy.findByTestId("cargo-weight").type("0");
            cy.findByTestId("cargo-submit").click();
          });

          cy.errorsFor('bags_weight').should('contain', 'greater than 0');
        });
      });

      it("adds a load", () => {
        cy.findByTestId("cargo-manifest").within(() => {
          cy.findByTestId("add-load").click();

          cy.findByTestId("cargo-form").within(() => {
            cy.findByTestId("cargo-name").type("New Cargo");
            cy.findByTestId("cargo-weight").type("50");
            cy.findByTestId("cargo-submit").click();
          });

          cy.findAllByTestId("cargo-list-item").should("have.length", 2);
          cy.findAllByTestId("cargo-list-item")
            .last()
            .within(() => {
              cy.findByTestId("cargo-name").should("contain", "New Cargo");
              cy.findByTestId("cargo-weight").should("contain", "50");
            });
        });

        cy.findByTestId("total-weight").should("contain", "235 lb");
        cy.findByTestId("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 85 lb total cargo)"
        );
      });

      it("updates an existing load", () => {
        cy.findByTestId("cargo-manifest").within(() => {
          cy.findByTestId("add-load").click();

          cy.findByTestId("cargo-form").within(() => {
            cy.findByTestId("cargo-name").type("Example Cargo");
            cy.findByTestId("cargo-weight").type("50");
            cy.findByTestId("cargo-submit").click();
          });

          cy.findAllByTestId("cargo-list-item").should("have.length", 1);
          cy.findByTestId("cargo-list-item").within(() => {
            cy.findByTestId("cargo-name").should("contain", "Example Cargo");
            cy.findByTestId("cargo-weight").should("contain", "50");
          });
        });

        cy.findByTestId("total-weight").should("contain", "210 lb");
        cy.findByTestId("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 60 lb total cargo)"
        );
      });

      it("disables a load", () => {
        cy.findByTestId("cargo-enabled").uncheck();

        cy.findByTestId("total-weight").should("contain", "160 lb");
        cy.findByTestId("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 10 lb total cargo)"
        );
      });

      it("removes a load", () => {
        cy.findByTestId("cargo-delete").click({ force: true });
        cy.findByTestId("no-cargo").should("exist");

        cy.findByTestId("total-weight").should("contain", "160 lb");
        cy.findByTestId("total-weight-breakdown").should(
          "contain",
          "(150 lb avg. passenger, 10 lb total cargo)"
        );
      });
    });
  });

  context("deleting a flight", () => {
    beforeEach(() => {
      cy.findByTestId("flight-list-item").click();
    });

    it("deletes a flight", () => {
      cy.findByTestId("delete-flight").click();
      cy.findByTestId("no-flights").should("exist");
    });
  });
});
