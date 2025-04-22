import React from "react";
import { MDBAccordion, MDBAccordionItem, MDBContainer, MDBCard, MDBCardBody, MDBCardHeader, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from 'react-router-dom';
import { categories } from "./resources/Catagories";
// Import Material-UI icons
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import WorkIcon from '@mui/icons-material/Work';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import TvIcon from '@mui/icons-material/Tv';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ChairIcon from '@mui/icons-material/Chair';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PetsIcon from '@mui/icons-material/Pets';
import BusinessIcon from '@mui/icons-material/Business';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ConstructionIcon from '@mui/icons-material/Construction';

// Map categories to icons
const categoryIcons = {
  'Retrend (Cars)': DirectionsCarIcon,
  'Properties': ApartmentIcon,
  'Mobiles': SmartphoneIcon,
  'Jobs': WorkIcon,
  'Bikes': TwoWheelerIcon,
  'Electronics & Appliances': TvIcon,
  'Commercial Vehicles & Spares': LocalShippingIcon,
  'Furniture': ChairIcon,
  'Fashion': CheckroomIcon,
  'Books, Sports & Hobbies': SportsSoccerIcon,
  'Pets': PetsIcon,
  'Services': BusinessIcon,
  'Kids': ChildCareIcon,
  'Agriculture': AgricultureIcon,
  'Gaming': SportsEsportsIcon,
  'Music': MusicNoteIcon,
  'Tools & Machinery': ConstructionIcon,
};

function Sell() {
  
  const navigate = useNavigate();
  const handleClick = (category, item) => {
    navigate(`/attributes/${category}/${item}`);
  };

  return (
    <MDBContainer>
      <MDBCard alignment='center' background='light' border='primary' shadow='0' className="mt-3 mb-3 container text-center" style={{ maxWidth: "800px" }}>
        <MDBCardHeader>
          <h3 className="d-flex align-items-center justify-content-center">
            <MDBIcon fas icon="tags" className="me-2" /> CHOOSE A CATEGORY
          </h3>
        </MDBCardHeader>
        <MDBCardBody>
          <MDBAccordion alwaysOpen initialActive={1}>
            {categories.map(({ title, items }, index) => (
              <MDBAccordionItem 
                key={index} 
                collapseId={index + 1} 
                headerTitle={
                  <div className="d-flex align-items-center">
                    {categoryIcons[title] && React.createElement(categoryIcons[title], { 
                      style: { marginRight: '10px', color: '#3498db' },
                      fontSize: "small"
                    })}
                    <span>{title}</span>
                  </div>
                }
              >
                <div className="row g-2">
                  {items.map((item, i) => (
                    <div key={i} className="col-md-6 col-lg-4">
                      <MDBBtn 
                        key={i} 
                        className="btn btn-outline-primary mb-2 w-100 d-flex align-items-center justify-content-center" 
                        onClick={() => handleClick(title, item)}
                        style={{ 
                          borderRadius: '8px', 
                          transition: 'all 0.3s ease',
                          height: '48px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                        color="light"
                      >
                        <MDBIcon fas icon="arrow-right" className="me-2" size="sm" />
                        {item}
                      </MDBBtn>
                    </div>
                  ))}
                </div>
              </MDBAccordionItem>
            ))}
          </MDBAccordion>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Sell;
