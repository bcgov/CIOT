import React from "react";
import axios from "axios";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import OpportunityDeletePage from "./OpportunityDeletePage";
import { store } from "../../../store";

describe("<OpportunityDeletePage />", () => {
  test("it should mount", () => {
    const history = createMemoryHistory();
    const route = "/place-name-1";
    history.push(route);

    axios.get.mockResolvedValueOnce({
      id: 1,
      opportunity_address: "1234 Test Pl.",
      point: "SRID=4326;POINT (-123.8687427 48.4774108)",
      approval_status: "PEND",
      date_created: "2021-02-16T17:34:38.184663Z",
    });

    render(
      <Provider store={store}>
        <Router history={history}>
          <OpportunityDeletePage id={1} />
        </Router>
      </Provider>
    );

    const opportunityDeletePage = screen.getByTestId("OpportunityDeletePage");

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(opportunityDeletePage).toBeInTheDocument();
  });
});
