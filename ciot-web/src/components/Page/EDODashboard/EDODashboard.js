import { useState, useEffect, useRef } from "react";
import { Button, Alert } from "shared-components";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "./EDODashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { Col, Container, Grid, Row, Spinner } from "react-bootstrap";
import { MdError, MdCheckBox } from "react-icons/md";
import OpportunityTable from "../../OpportunityTable/OpportunityTable";
import { resetOpportunity } from "../../../store/actions/opportunity";
import {
  GET_OPPORTUNITIES_LIST_URL,
  PATCH_OPPORTUNITIES_URL,
} from "../../../store/constants/api-urls";
import { getUser } from "../../../store/actions/user";
import { useKeycloakWrapper } from "../../../hooks/useKeycloakWrapper";
import ConfirmCancelModal from "../../ConfirmCancelModal/ConfirmCancelModal";
import FooterLinks from "../../FooterLinks/FooterLinks";
import { closeNotification } from "../../../store/actions/notification";

export default function EDODashboard() {
  const [tableData, setTableData] = useState([]);
  const [communities, setCommunities] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isOpportunityLoaded, setIsOpportunityLoaded] = useState(false);
  const [currentId, setCurrentId] = useState(-1);
  const [markAsSoldStatus, setMarkAsSoldStatus] = useState(null);
  const resultRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const keycloak = useKeycloakWrapper();
  const user = useSelector((state) => state.user);

  // For returning to the correct page when cancelling a delete
  window.sessionStorage.setItem("back_url", window.location.pathname);

  const getUserOpportunities = () => {
    getUser({ email: keycloak.email }).then((response) => {
      const { data: users } = response;
      if (users.length) {
        const appUser = users[0];
        const places = [];
        appUser.municipalities.forEach((m) => places.push(m.name));
        appUser.regional_districts.forEach((r) => places.push(r.name));
        setCommunities(places.join(", "));
        axios
          .get(`${GET_OPPORTUNITIES_LIST_URL}?user_id=${appUser.id}`)
          .then((data) => {
            setTableData(data.data.results);
            setIsOpportunityLoaded(true);
          })
          .catch((err) => {
            /* eslint-disable-next-line */
            console.error(err);
            setTableData([]);
          });
      } else {
        setIsOpportunityLoaded(true);
      }
    });
  };
  useEffect(() => {
    getUserOpportunities();
  }, []);

  // Capture first login
  useEffect(() => {
    getUserOpportunities();
  }, [user]);

  const goToMap = () => {
    dispatch(resetOpportunity());
    dispatch(closeNotification());
    history.push("/investmentopportunities/add");
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const markAsSold = () => {
    axios
      .patch(
        `${PATCH_OPPORTUNITIES_URL}${currentId}/`,
        {
          approval_status: "CLOS",
        },
        { headers: { Authorization: `Bearer ${keycloak.obj.token}` } }
      )
      .then(() => {
        setShowModal(false);
        setMarkAsSoldStatus("Success");
        getUserOpportunities();
        resultRef.current.scrollIntoView();
      })
      .catch((err) => {
        setShowModal(false);
        setMarkAsSoldStatus("Error");
        resultRef.current.scrollIntoView();
      });
  };

  const handleModalOpen = (id) => {
    setCurrentId(id);
    setShowModal(true);
  };

  const modalBody = (
    <div>
      <p>Are you sure you wish to mark this opportunity as closed?</p>
    </div>
  );

  const modalLabel = "Mark as closed confirmation";

  let dataSection;
  let addOpportunityButton;

  if (!tableData) {
    dataSection = null;
    addOpportunityButton = null;
  } else if (tableData.length === 0) {
    dataSection = (
      <div className="edo-dashboard">
        <h1 className="dashboard-promoted-opps">
          Your Community Promoted Opportunities
        </h1>
        <p className="dashboard-text">
          As soon as you add opportunities, you can see the status and manage
          them here.
        </p>
      </div>
    );
    addOpportunityButton = (
      <Button
        onClick={goToMap}
        label="Add your first opportunity"
        styling="bcgov-normal-blue btn"
      />
    );
  } else {
    dataSection = (
      <>
        <h1 className="dashboard-opportunities">
          Your Investment Opportunities
        </h1>
        <OpportunityTable
          tableData={tableData}
          handleModalOpen={handleModalOpen}
        />
      </>
    );
    addOpportunityButton = (
      <Button
        onClick={goToMap}
        label="+ Add an opportunity"
        styling="bcgov-normal-blue btn"
      />
    );
  }

  return (
    <div className="edo-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-howitworks">
          <h1 className="dashboard-header">How it works</h1>
          <p className="dashboard-text">
            To create a new listing, follow a simple process to add some key
            information about the property. The tool will automatically provide
            additional location information to help investors and site selectors
            quickly evaluate whether the site meets their specific needs. All
            listings will be reviewed prior to publication and will go live
            within 3-5 business days.
          </p>
        </div>
        <Container className="dashboard-instructions">
          <h2 className="dashboard-header">
            Before you add a listing, review the eligibility criteria:
          </h2>
          <br />
          <h3 className="criteria-opportunities">Zoning</h3>
          <Row className="dashboard-row">
            <Col className="svg-box" xs={2}>
              <img
                style={{ padding: "3%" }}
                src="/images/building.svg"
                alt="Zoning"
              />
            </Col>
            <Col className="svg-box" xs={10}>
              Property is zoned for industrial, commercial, or agricultural use.
            </Col>
          </Row>
          <h3 className="criteria-opportunities">Restrictions</h3>
          <Row className="dashboard-row">
            <Col className="svg-box" xs={2}>
              <img
                style={{ padding: "3%" }}
                src="/images/environmental.svg"
                alt="Restrictions"
              />
            </Col>
            <Col className="svg-box" xs={10}>
              Property is free of potential development constraints (i.e.,
              restrictions on title, future planned roads, presence of
              significant cultural or natural heritage features, or other).
            </Col>
          </Row>
          <h3 className="criteria-opportunities">Approval</h3>
          <Row className="dashboard-row">
            <Col className="svg-box" xs={2}>
              <img
                style={{ padding: "3%" }}
                src="/images/team.svg"
                alt="Approval"
              />
            </Col>
            <Col className="svg-box" xs={10}>
              Opportunity is submitted by an authorized representative for a
              community (i.e., Economic Development Officer, Chief
              Administrative Officer, First Nations Lands Manager, or other).
            </Col>
          </Row>
        </Container>
        <div className="add-opportunity-button">{addOpportunityButton}</div>
        {markAsSoldStatus === "Error" ? (
          <Container className="p-0 mt-3">
            <Alert
              icon={<MdError size={32} />}
              type="error"
              styling="bcgov-error-background"
              element="There was an error marking your opportunity as sold. Please try again later."
            />
          </Container>
        ) : null}
        {markAsSoldStatus === "Success" ? (
          <Container className="p-0 mt-3 xyz">
            <Alert
              icon={<MdCheckBox size={32} />}
              type="success"
              styling="bcgov-success-background"
              element="Successfully updated!"
            />
          </Container>
        ) : null}
        {isOpportunityLoaded ? (
          dataSection
        ) : (
          <>
            <h1 className="dashboard-opportunities">
              Searching for Your Investment Opportunities
            </h1>
            <div className="center-spinner-opportunities">
              <Spinner animation="border" />
            </div>
          </>
        )}
        <ConfirmCancelModal
          show={showModal}
          handleClose={handleModalClose}
          handleSubmit={() => markAsSold(currentId)}
          body={modalBody}
          label={modalLabel}
        />
      </div>
      <FooterLinks type="add-opp" />
    </div>
  );
}
