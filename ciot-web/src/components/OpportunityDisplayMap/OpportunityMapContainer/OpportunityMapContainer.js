import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { CgCloseR } from "react-icons/cg";
import { GrMapLocation } from "react-icons/gr";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import OpportunitiesMap from "../OpportunitiesMap/OpportunitiesMap";
import "./OpportunityMapContainer.css";
import { fadeIn, fadeOut } from "../../../helpers/fade";

export default function OpportunityMapContainer({ totalCount, opportunities }) {
  const [showMap, setShowMap] = useState(true);
  const map = useRef(null);

  const toggleMap = () => {
    if (showMap) {
      fadeOut(map.current);
    } else {
      fadeIn(map.current);
    }
    setShowMap(!showMap);
  };

  const styles = {
    close: {
      height: "40px",
      width: "120px",
      position: "absolute",
      background: "transparent",
      right: 28,
      top: 28,
      zIndex: 1000,
      cursor: "pointer",
      border: "none",
    },
  };

  return (
    <Row className="row-relative" data-testid="opportunities-map">
      <div className={!showMap ? "map-hidden" : "map-visible"}>
        {showMap && (
          <button
            style={styles.close}
            className="btnLink"
            type="button"
            onClick={toggleMap}
          >
            <CgCloseR data-testid="close-map-icon" className="mapIcon" />
            Hide Map
          </button>
        )}
      </div>

      <div className="w-100" id="myMap" ref={map}>
        <OpportunitiesMap className="map" opportunities={opportunities} />
      </div>

      <Row className="w-100">
        <Col className="pt-3">
          {totalCount ? (
            <h4>{totalCount} Properties match your search</h4>
          ) : (
            <h4>
              {totalCount} Properties match your search. Please add or modify
              your filters.
            </h4>
          )}
        </Col>
        <Col
          className="pt-3 text-right"
          style={{ paddingRight: "0px", paddingTop: "0px" }}
        >
          <span>
            {" "}
            <Link
              to="/investmentopportunities/disclaimer-investor"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Use
            </Link>
          </span>{" "}
        </Col>
        {!showMap && (
          <Col className="d-flex justify-content-end">
            <button className="btnLink" type="button" onClick={toggleMap}>
              <GrMapLocation
                data-testid="show-map-icon"
                onClick={toggleMap}
                className="mapIcon"
              />
              Show Map
            </button>
          </Col>
        )}
      </Row>
    </Row>
  );
}

OpportunityMapContainer.defaultProps = {
  opportunities: null,
};

OpportunityMapContainer.propTypes = {
  totalCount: PropTypes.number.isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.shape()),
};
