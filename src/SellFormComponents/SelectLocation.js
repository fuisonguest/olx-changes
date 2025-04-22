import React, { useState, useEffect } from "react";
import {
  MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBInput,
} from "mdb-react-ui-kit";
import { MDBCard, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import axios from "axios";

import { State, City } from "country-state-city";
import ReactLoading from "react-loading";

const CurrentLocation = ({
  onaddressSelect,
  onlocationSelect,
  setAddOrLoc,
}) => {
  const apiKey = "da21fad825e941559ab482bf919488a0";
  const [iconsActive, setIconsActive] = useState("tab1");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stateDropdownValue, setStateDropdownValue] = useState(null);
  const [stateCode, setStateCode] = useState(null);
  const [cityDropdownValue, setCityDropdownValue] = useState(null);
  const [address, setAddress] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    setAddOrLoc("location");
  }, []);

  const handleIconsClick = (value) => {
    if (value === iconsActive) {
      return;
    }
    setIconsActive(value);

    if (value === "tab2") {
      setLoading(true);
      setAddOrLoc("address");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLoading(false);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      setLoading(false);
      setAddOrLoc("location");
    }
  };
  const states = State.getStatesOfCountry("IN");
  const cities =
    stateDropdownValue != null ? City.getCitiesOfState("IN", stateCode) : [];
  useEffect(() => {
    setLoading(true);
    if (latitude && longitude) {
      axios
        .get(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
        )
        .then((response) => {
          //   const address = response.data.features[0].properties.formatted;
          const address = {
            state: response.data.features[0].properties.state,
            city: response.data.features[0].properties.city,
            area: response.data.features[0].properties.suburb,
            postcode: response.data.features[0].properties.postcode,
          };
          console.log(response);
          setAddress(address);
          onaddressSelect(address);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [latitude, longitude]);

  const handleAddressChange = (event) => {
    const location = {
      state: stateDropdownValue,
      city: cityDropdownValue,
      area: event.target.value,
    };
    setLocation(location);
    if (stateDropdownValue && cityDropdownValue) {
      onlocationSelect(location);
    }
  };

  return (
    <>
      <MDBTabs className="mb-3 mt-3">
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleIconsClick("tab1")}
            active={iconsActive === "tab1"}
          >
            <MDBIcon fas icon="search-location" className="me-2" />
            Select Location
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleIconsClick("tab2")}
            active={iconsActive === "tab2"}
          >
            <MDBIcon fas icon="map-marked-alt" className="me-2" /> Current
            Location
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane className="mt-2 mb-2" show={iconsActive === "tab1"}>
          {" "}
          <MDBDropdown>
            <MDBDropdownToggle
              caret
              color="secondary"
              className="dropdown-toggle"
            >
              {stateDropdownValue || "Select State"}
            </MDBDropdownToggle>
            <MDBDropdownMenu className="dropdown-menu">
              {states.map((state) => (
                <MDBDropdownItem
                  key={state.id}
                  onClick={() => {
                    setStateDropdownValue(state.name);
                    setStateCode(state.isoCode);
                  }}
                >
                  {state.name}
                </MDBDropdownItem>
              ))}
            </MDBDropdownMenu>
          </MDBDropdown>
          <MDBDropdown className="mt-2">
            <MDBDropdownToggle
              caret
              color="secondary"
              className="dropdown-toggle"
            >
              {cityDropdownValue || "Select City"}
            </MDBDropdownToggle>
            <MDBDropdownMenu className="dropdown-menu">
              {cities.map((city) => (
                <MDBDropdownItem
                  key={city.id}
                  onClick={() => setCityDropdownValue(city.name)}
                >
                  {city.name}
                </MDBDropdownItem>
              ))}
            </MDBDropdownMenu>
          </MDBDropdown>
          <div
            className="mt-3 custom-file-input"
            style={{ alignItems: "center" }}
          >
            <MDBInput
              onChange={handleAddressChange}
              label="Enter Area Details"
            />
          </div>
        </MDBTabsPane>
        <MDBTabsPane show={iconsActive === "tab2"}>
          {loading ? (
            <div className="container">
              <ReactLoading
                type="spin"
                color="blue"
                height={"5%"}
                width={"5%"}
              />
            </div>
          ) : (
            <div className="row">
              <div className="col-md-8 mb-3">
                <MDBCard>
                  <MDBListGroup flush>
                    <MDBListGroupItem>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">State</small>
                        <small>{address.state}</small>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">City</small>
                        <small>{address.city}</small>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Area</small>
                        <small>{address.area}</small>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">Pincode</small>
                        <small>{address.postcode}</small>
                      </div>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCard>
              </div>
              <div className="col-md-4">
                <div className="embed-responsive embed-responsive-4by3">
                  <iframe
                    title="Your Location"
                    className="embed-responsive-item"
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3507.743908551197!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1684765091573!5m2!1sen!2sin`}
                    allowFullScreen=""
                    loading="lazy"
                    style={{ width: '100%', height: '200px', border: '1px solid #ccc', borderRadius: '4px' }}
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </MDBTabsPane>
      </MDBTabsContent>
    </>
  );
};

export default CurrentLocation;
