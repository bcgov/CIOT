import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "shared-components/build/components/button/Button";
import { Col, Container, NavLink, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOpportunityName } from "../../store/actions/opportunity";
import styles from "./ReviewAndSubmitCallout.module.css";
import TextInput from "../FormComponents/TextInput";
import { closeNotification } from "../../store/actions/notification";

const ReviewAndSubmitCallout = ({
  prevRoute,
  submitOpportunity,
  cancelOpportunity,
  isSubmitted,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.opportunity.name);
  const goToPrevPage = () => {
    dispatch(closeNotification());
    history.push("/investmentopportunities/additional-details");
  };

  return (
    <Container
      className={styles.ReviewAndSubmitCallout}
      data-testid="ReviewAndSubmitCallout"
    >
      <Row>
        <Col>
          <p>
            Please review your listing below. Your listing includes open source
            location data, as well as information you have added.
          </p>
          <p>
            Once you submit your listing, it will be reviewed within 3-5 days.
            Your listing will then be published publicly or you may be contacted
            for more information. You can track the status of your submission on
            your dashboard.
          </p>
          <div role="form">
            <TextInput
              name="opportunity-name"
              aria-label="set opportunity name"
              heading="Name this Opportunity"
              notes="This field is optional and will only be seen by you on your
              dashboard"
              id="opportunity-name"
              rows={1}
              placeholder="Enter Name here. (eg. Old mill on Main St)"
              value={name}
              handleChange={(_, value) => dispatch(setOpportunityName(value))}
            />
          </div>
          <hr className="hr-bold" />
        </Col>
      </Row>
      {prevRoute && (
        <Row className="mb-4">
          <Col>
            <NavLink onClick={goToPrevPage} id="back" to={prevRoute} replace>
              {"<<"} Previous Page
            </NavLink>
          </Col>
        </Row>
      )}
      <Row>
        <Col>
          <Button
            id="cancel"
            onClick={() => {
              cancelOpportunity();
              dispatch(closeNotification());
            }}
            label="Cancel & Return to Dashboard"
            styling="BC-Gov-SecondaryButton bc-gov-btn"
          />
        </Col>
        <Col className="d-flex justify-content-end">
          <Button
            id="submit"
            onClick={submitOpportunity}
            label="Submit my Opportunity"
            styling="bcgov-normal-blue btn primary"
            disabled={isSubmitted}
            hasLoader={isSubmitted}
          />
        </Col>
      </Row>
    </Container>
  );
};

ReviewAndSubmitCallout.propTypes = {
  submitOpportunity: PropTypes.func.isRequired,
  cancelOpportunity: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  prevRoute: PropTypes.string,
};

ReviewAndSubmitCallout.defaultProps = {
  prevRoute: null,
};

export default ReviewAndSubmitCallout;
