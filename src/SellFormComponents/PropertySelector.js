import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBRadio,
  MDBBtn,
} from "mdb-react-ui-kit";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Checkbox,
  RadioGroup,
  Radio,
  Button,
  ButtonGroup,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import PropertyDetailsDisplay from '../components/PropertyDetailsDisplay';
import PropertyView from '../components/PropertyView';

export default function PropertySelector({ onPropertySelect }) {
  const { category, item } = useParams();
  
  // Property type
  const [propertyType, setPropertyType] = useState("Flats / Apartments");
  
  // BHK options
  const [bhk, setBhk] = useState("2");
  
  // Bathrooms
  const [bathrooms, setBathrooms] = useState("2");
  
  // Furnishing
  const [furnishing, setFurnishing] = useState("Semi-Furnished");
  
  // Project details
  const [projectStatus, setProjectStatus] = useState("Ready to Move");
  const [listedBy, setListedBy] = useState("Owner");
  
  // Area details
  const [superBuiltupArea, setSuperBuiltupArea] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  const [maintenance, setMaintenance] = useState("");
  
  // Building details
  const [totalFloors, setTotalFloors] = useState("");
  const [floorNo, setFloorNo] = useState("");
  
  // Parking
  const [carParking, setCarParking] = useState("1");
  
  // Direction
  const [facing, setFacing] = useState("East");
  
  // Additional details
  const [projectName, setProjectName] = useState("");
  
  // Amenities
  const [lift, setLift] = useState(false);
  const [powerBackup, setPowerBackup] = useState(false);
  const [security, setSecurity] = useState(false);
  const [garden, setGarden] = useState(false);
  const [clubhouse, setClubhouse] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);
  const [gym, setGym] = useState(false);
  const [waterSupply, setWaterSupply] = useState(false);
  
  // Other features
  const [age, setAge] = useState("New");
  const [balconies, setBalconies] = useState("1");

  // Set property data for parent
  useEffect(() => {
    onPropertySelect({
      propertyType,
      bhk,
      bathrooms,
      furnishing,
      projectStatus,
      listedBy,
      superBuiltupArea,
      carpetArea,
      maintenance,
      totalFloors,
      floorNo,
      carParking,
      facing,
      projectName,
      amenities: {
        lift,
        powerBackup,
        security,
        garden,
        clubhouse,
        swimmingPool,
        gym,
        waterSupply
      },
      age,
      balconies
    });
  }, [
    propertyType, bhk, bathrooms, furnishing, projectStatus, listedBy,
    superBuiltupArea, carpetArea, maintenance, totalFloors, floorNo,
    carParking, facing, projectName, lift, powerBackup, security, garden,
    clubhouse, swimmingPool, gym, waterSupply, age, balconies, onPropertySelect
  ]);

  // Available facing options
  const facingOptions = [
    "East", "West", "North", "South", 
    "North-East", "North-West", "South-East", "South-West"
  ];

  return (
    <div className="mt-3 mb-3">
      <MDBCard>
        <MDBCardBody>
          <Heading size="md" mb={4}>INCLUDE SOME DETAILS</Heading>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Type *</FormLabel>
            <Stack direction="row" spacing={4} wrap="wrap">
              <Button 
                colorScheme={propertyType === "Flats / Apartments" ? "blue" : "gray"}
                variant={propertyType === "Flats / Apartments" ? "solid" : "outline"}
                onClick={() => setPropertyType("Flats / Apartments")}
              >
                Flats / Apartments
              </Button>
              <Button 
                colorScheme={propertyType === "Independent / Builder Floors" ? "blue" : "gray"}
                variant={propertyType === "Independent / Builder Floors" ? "solid" : "outline"}
                onClick={() => setPropertyType("Independent / Builder Floors")}
              >
                Independent / Builder Floors
              </Button>
              <Button 
                colorScheme={propertyType === "Farm House" ? "blue" : "gray"}
                variant={propertyType === "Farm House" ? "solid" : "outline"}
                onClick={() => setPropertyType("Farm House")}
              >
                Farm House
              </Button>
              <Button 
                colorScheme={propertyType === "House & Villa" ? "blue" : "gray"}
                variant={propertyType === "House & Villa" ? "solid" : "outline"}
                onClick={() => setPropertyType("House & Villa")}
              >
                House & Villa
              </Button>
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">BHK *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={bhk === "1" ? "blue" : "gray"}
                variant={bhk === "1" ? "solid" : "outline"}
                onClick={() => setBhk("1")}
              >
                1
              </Button>
              <Button 
                colorScheme={bhk === "2" ? "blue" : "gray"}
                variant={bhk === "2" ? "solid" : "outline"}
                onClick={() => setBhk("2")}
              >
                2
              </Button>
              <Button 
                colorScheme={bhk === "3" ? "blue" : "gray"}
                variant={bhk === "3" ? "solid" : "outline"}
                onClick={() => setBhk("3")}
              >
                3
              </Button>
              <Button 
                colorScheme={bhk === "4" ? "blue" : "gray"}
                variant={bhk === "4" ? "solid" : "outline"}
                onClick={() => setBhk("4")}
              >
                4
              </Button>
              <Button 
                colorScheme={bhk === "4+" ? "blue" : "gray"}
                variant={bhk === "4+" ? "solid" : "outline"}
                onClick={() => setBhk("4+")}
              >
                4+
              </Button>
            </ButtonGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Bathrooms *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={bathrooms === "1" ? "blue" : "gray"}
                variant={bathrooms === "1" ? "solid" : "outline"}
                onClick={() => setBathrooms("1")}
              >
                1
              </Button>
              <Button 
                colorScheme={bathrooms === "2" ? "blue" : "gray"}
                variant={bathrooms === "2" ? "solid" : "outline"}
                onClick={() => setBathrooms("2")}
              >
                2
              </Button>
              <Button 
                colorScheme={bathrooms === "3" ? "blue" : "gray"}
                variant={bathrooms === "3" ? "solid" : "outline"}
                onClick={() => setBathrooms("3")}
              >
                3
              </Button>
              <Button 
                colorScheme={bathrooms === "4" ? "blue" : "gray"}
                variant={bathrooms === "4" ? "solid" : "outline"}
                onClick={() => setBathrooms("4")}
              >
                4
              </Button>
              <Button 
                colorScheme={bathrooms === "4+" ? "blue" : "gray"}
                variant={bathrooms === "4+" ? "solid" : "outline"}
                onClick={() => setBathrooms("4+")}
              >
                4+
              </Button>
            </ButtonGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Furnishing *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={furnishing === "Furnished" ? "blue" : "gray"}
                variant={furnishing === "Furnished" ? "solid" : "outline"}
                onClick={() => setFurnishing("Furnished")}
              >
                Furnished
              </Button>
              <Button 
                colorScheme={furnishing === "Semi-Furnished" ? "blue" : "gray"}
                variant={furnishing === "Semi-Furnished" ? "solid" : "outline"}
                onClick={() => setFurnishing("Semi-Furnished")}
              >
                Semi-Furnished
              </Button>
              <Button 
                colorScheme={furnishing === "Unfurnished" ? "blue" : "gray"}
                variant={furnishing === "Unfurnished" ? "solid" : "outline"}
                onClick={() => setFurnishing("Unfurnished")}
              >
                Unfurnished
              </Button>
            </ButtonGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Project Status *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={projectStatus === "New Launch" ? "blue" : "gray"}
                variant={projectStatus === "New Launch" ? "solid" : "outline"}
                onClick={() => setProjectStatus("New Launch")}
              >
                New Launch
              </Button>
              <Button 
                colorScheme={projectStatus === "Ready to Move" ? "blue" : "gray"}
                variant={projectStatus === "Ready to Move" ? "solid" : "outline"}
                onClick={() => setProjectStatus("Ready to Move")}
              >
                Ready to Move
              </Button>
              <Button 
                colorScheme={projectStatus === "Under Construction" ? "blue" : "gray"}
                variant={projectStatus === "Under Construction" ? "solid" : "outline"}
                onClick={() => setProjectStatus("Under Construction")}
              >
                Under Construction
              </Button>
            </ButtonGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Listed by *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={listedBy === "Builder" ? "blue" : "gray"}
                variant={listedBy === "Builder" ? "solid" : "outline"}
                onClick={() => setListedBy("Builder")}
              >
                Builder
              </Button>
              <Button 
                colorScheme={listedBy === "Dealer" ? "blue" : "gray"}
                variant={listedBy === "Dealer" ? "solid" : "outline"}
                onClick={() => setListedBy("Dealer")}
              >
                Dealer
              </Button>
              <Button 
                colorScheme={listedBy === "Owner" ? "blue" : "gray"}
                variant={listedBy === "Owner" ? "solid" : "outline"}
                onClick={() => setListedBy("Owner")}
              >
                Owner
              </Button>
            </ButtonGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Super Builtup area sqft *</FormLabel>
            <Input 
              type="number" 
              value={superBuiltupArea} 
              onChange={(e) => setSuperBuiltupArea(e.target.value)} 
              placeholder="Enter Super Builtup area" 
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Carpet Area sqft *</FormLabel>
            <Input 
              type="number" 
              value={carpetArea} 
              onChange={(e) => setCarpetArea(e.target.value)} 
              placeholder="Enter Carpet Area" 
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Maintenance (Monthly)</FormLabel>
            <Input 
              type="number" 
              value={maintenance} 
              onChange={(e) => setMaintenance(e.target.value)} 
              placeholder="Enter Monthly Maintenance" 
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Total Floors</FormLabel>
            <Input 
              type="number" 
              value={totalFloors} 
              onChange={(e) => setTotalFloors(e.target.value)} 
              placeholder="Enter Total Floors" 
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Floor No</FormLabel>
            <Input 
              type="number" 
              value={floorNo} 
              onChange={(e) => setFloorNo(e.target.value)} 
              placeholder="Enter Floor Number" 
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Car Parking</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={carParking === "0" ? "blue" : "gray"}
                variant={carParking === "0" ? "solid" : "outline"}
                onClick={() => setCarParking("0")}
              >
                0
              </Button>
              <Button 
                colorScheme={carParking === "1" ? "blue" : "gray"}
                variant={carParking === "1" ? "solid" : "outline"}
                onClick={() => setCarParking("1")}
              >
                1
              </Button>
              <Button 
                colorScheme={carParking === "2" ? "blue" : "gray"}
                variant={carParking === "2" ? "solid" : "outline"}
                onClick={() => setCarParking("2")}
              >
                2
              </Button>
              <Button 
                colorScheme={carParking === "3" ? "blue" : "gray"}
                variant={carParking === "3" ? "solid" : "outline"}
                onClick={() => setCarParking("3")}
              >
                3
              </Button>
              <Button 
                colorScheme={carParking === "3+" ? "blue" : "gray"}
                variant={carParking === "3+" ? "solid" : "outline"}
                onClick={() => setCarParking("3+")}
              >
                3+
              </Button>
            </ButtonGroup>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Facing</FormLabel>
            <Select value={facing} onChange={(e) => setFacing(e.target.value)}>
              {facingOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Project Name</FormLabel>
            <Input 
              value={projectName} 
              onChange={(e) => setProjectName(e.target.value)} 
              placeholder="Enter Project Name" 
              maxLength={70}
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'gray' }}>
              {projectName.length} / 70
            </div>
          </FormControl>

          <Divider my={4} />

          <Heading size="sm" mb={4}>Amenities</Heading>
          
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            <Checkbox isChecked={lift} onChange={(e) => setLift(e.target.checked)}>
              Lift
            </Checkbox>
            
            <Checkbox isChecked={powerBackup} onChange={(e) => setPowerBackup(e.target.checked)}>
              Power Backup
            </Checkbox>
            
            <Checkbox isChecked={security} onChange={(e) => setSecurity(e.target.checked)}>
              Security
            </Checkbox>
            
            <Checkbox isChecked={garden} onChange={(e) => setGarden(e.target.checked)}>
              Garden
            </Checkbox>
            
            <Checkbox isChecked={clubhouse} onChange={(e) => setClubhouse(e.target.checked)}>
              Clubhouse
            </Checkbox>
            
            <Checkbox isChecked={swimmingPool} onChange={(e) => setSwimmingPool(e.target.checked)}>
              Swimming Pool
            </Checkbox>
            
            <Checkbox isChecked={gym} onChange={(e) => setGym(e.target.checked)}>
              Gym
            </Checkbox>
            
            <Checkbox isChecked={waterSupply} onChange={(e) => setWaterSupply(e.target.checked)}>
              24x7 Water Supply
            </Checkbox>
          </SimpleGrid>

          <Divider my={4} />

          <Heading size="sm" mb={4}>Additional Details</Heading>
          
          <SimpleGrid columns={[1, 2]} spacing={4}>
            <FormControl>
              <FormLabel>Property Age</FormLabel>
              <Select value={age} onChange={(e) => setAge(e.target.value)}>
                <option value="New">New Construction</option>
                <option value="<1">Less than 1 year</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value=">10">More than 10 years</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Number of Balconies</FormLabel>
              <Select value={balconies} onChange={(e) => setBalconies(e.target.value)}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4+">4+</option>
              </Select>
            </FormControl>
          </SimpleGrid>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
} 