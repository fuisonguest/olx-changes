import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBSelect,
  MDBRadio,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import {
  FormControl,
  FormLabel,
  Select,
  RadioGroup,
  Stack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Checkbox,
  Input
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

// Data for Indian cars and their models
const indianCarsData = {
  "Maruti Suzuki": ["Swift", "Baleno", "Dzire", "Alto", "Brezza", "Ertiga", "WagonR", "Celerio"],
  "Hyundai": ["i10", "i20", "Creta", "Venue", "Verna", "Aura", "Alcazar", "Tucson"],
  "Tata Motors": ["Nexon", "Tiago", "Altroz", "Harrier", "Safari", "Punch", "Tigor", "Hexa"],
  "Mahindra": ["Scorpio", "XUV700", "XUV300", "Thar", "Bolero", "Marazzo", "KUV100", "XUV500"],
  "Honda": ["City", "Amaze", "WR-V", "Jazz", "Civic", "CR-V"],
  "Toyota": ["Innova", "Fortuner", "Glanza", "Urban Cruiser", "Camry", "Vellfire"],
  "Kia": ["Seltos", "Sonet", "Carens", "Carnival"],
  "MG": ["Hector", "Astor", "ZS EV", "Gloster"],
  "Skoda": ["Kushaq", "Slavia", "Octavia", "Superb", "Kodiaq"],
  "Volkswagen": ["Taigun", "Virtus", "Polo", "Vento", "Tiguan"]
};

// Data for Indian bikes and their models
const indianBikesData = {
  "Hero": ["Splendor", "HF Deluxe", "Passion", "Glamour", "Xtreme", "Xpulse", "Destini", "Pleasure"],
  "Bajaj": ["Pulsar", "Platina", "CT", "Avenger", "Dominar", "Chetak"],
  "TVS": ["Apache", "Jupiter", "XL100", "Ntorq", "Raider", "iQube", "Sport", "Star City"],
  "Honda": ["Activa", "Shine", "Unicorn", "SP", "Dio", "Hornet", "CB", "Livo"],
  "Royal Enfield": ["Classic", "Bullet", "Meteor", "Himalayan", "Continental GT", "Interceptor", "Hunter"],
  "Yamaha": ["FZ", "R15", "MT", "Fascino", "RayZR", "FZS", "Aerox"],
  "Suzuki": ["Access", "Burgman", "Gixxer", "Avenis", "Hayabusa", "V-Strom"],
  "KTM": ["Duke", "RC", "Adventure", "390", "250", "200", "125"],
  "Jawa": ["Jawa", "42", "Perak", "42 Bobber"],
  "Triumph": ["Street Triple", "Tiger", "Trident", "Rocket", "Speed Triple"]
};

export default function VehicleSelector({ onVehicleSelect }) {
  const { category, item } = useParams();
  
  // Check if category is bike or motorcycle related
  const isBike = category?.toLowerCase() === 'bikes' || 
                 item?.toLowerCase() === 'motorcycles' || 
                 item?.toLowerCase()?.includes('motorcycle');

  // Check if category is spares related
  const isSpare = category?.toLowerCase()?.includes('spare') || 
                  item?.toLowerCase()?.includes('spare') ||
                  category?.toLowerCase()?.includes('parts') || 
                  item?.toLowerCase()?.includes('parts');
  
  const [vehicleType, setVehicleType] = useState(isBike ? "bike" : "car");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [fuelType, setFuelType] = useState("petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  
  // Additional vehicle details
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [ownership, setOwnership] = useState("1st");
  const [kmDriven, setKmDriven] = useState("");
  const [color, setColor] = useState("");
  const [registrationPlace, setRegistrationPlace] = useState("");
  const [insurance, setInsurance] = useState("Comprehensive");
  
  // Spare parts specific details
  const [partCondition, setPartCondition] = useState("New");
  
  // Features
  const [abs, setAbs] = useState(false);
  const [accidental, setAccidental] = useState(false);
  const [adjustableMirror, setAdjustableMirror] = useState(false);
  const [adjustableSteering, setAdjustableSteering] = useState(false);
  const [airConditioning, setAirConditioning] = useState(false);
  const [airbags, setAirbags] = useState("0");
  const [alloyWheels, setAlloyWheels] = useState(false);
  const [bluetooth, setBluetooth] = useState(false);
  const [cruiseControl, setCruiseControl] = useState(false);
  const [parkingSensors, setParkingSensors] = useState(false);
  const [powerSteering, setPowerSteering] = useState(false);
  const [powerWindows, setPowerWindows] = useState(false);
  const [rearCamera, setRearCamera] = useState(false);

  useEffect(() => {
    // Set available brands based on vehicle type when component mounts
    if (vehicleType === "car") {
      setAvailableBrands(Object.keys(indianCarsData));
    } else if (vehicleType === "bike") {
      setAvailableBrands(Object.keys(indianBikesData));
    } else {
      setAvailableBrands([]);
    }
    
    // Reset brand and model when vehicle type changes
    setBrand("");
    setModel("");
  }, [vehicleType]);

  useEffect(() => {
    // Set available models based on selected brand and vehicle type
    if (vehicleType === "car" && brand) {
      setAvailableModels(indianCarsData[brand] || []);
    } else if (vehicleType === "bike" && brand) {
      setAvailableModels(indianBikesData[brand] || []);
    } else {
      setAvailableModels([]);
    }
    
    // Reset model when brand changes
    setModel("");
  }, [brand, vehicleType]);

  useEffect(() => {
    // Pass vehicle data to parent component
    if (isSpare) {
      onVehicleSelect({
        vehicleType,
        brand,
        model,
        partCondition,
        year
      });
    } else {
      onVehicleSelect({
        vehicleType,
        brand,
        model,
        fuelType,
        transmission,
        year,
        month,
        ownership,
        kmDriven,
        color,
        registrationPlace,
        insurance,
        features: {
          abs,
          accidental,
          adjustableMirror,
          adjustableSteering,
          airConditioning,
          airbags,
          alloyWheels,
          bluetooth,
          cruiseControl,
          parkingSensors,
          powerSteering,
          powerWindows,
          rearCamera
        }
      });
    }
  }, [
    isSpare, vehicleType, brand, model, fuelType, transmission, year, 
    month, ownership, kmDriven, color, registrationPlace, insurance, 
    partCondition, abs, accidental, adjustableMirror, adjustableSteering, 
    airConditioning, airbags, alloyWheels, bluetooth, cruiseControl, 
    parkingSensors, powerSteering, powerWindows, rearCamera, onVehicleSelect
  ]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const renderContent = () => {
    if (isSpare) {
      // Spare parts form fields
      return (
        <>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Brand *</FormLabel>
            <Select 
              placeholder="Select brand" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
            >
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FormControl>

          {brand && (
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Compatible Model *</FormLabel>
              <Select 
                placeholder="Select model" 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Condition *</FormLabel>
            <Stack direction="row" spacing={4}>
              <MDBRadio 
                value="New" 
                name="partCondition" 
                id="new" 
                label="New" 
                checked={partCondition === "New"}
                onChange={() => setPartCondition("New")}
              />
              <MDBRadio 
                value="Used" 
                name="partCondition" 
                id="used" 
                label="Used" 
                checked={partCondition === "Used"}
                onChange={() => setPartCondition("Used")}
              />
              <MDBRadio 
                value="Refurbished" 
                name="partCondition" 
                id="refurbished" 
                label="Refurbished" 
                checked={partCondition === "Refurbished"}
                onChange={() => setPartCondition("Refurbished")}
              />
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Year (Optional)</FormLabel>
            <Select 
              placeholder="Select year" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </FormControl>
        </>
      );
    } else if (isBike) {
      // Bike form fields
      return (
        <>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Brand *</FormLabel>
            <Select 
              placeholder="Select brand" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
            >
              {Object.keys(indianBikesData).map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FormControl>

          {brand && (
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Model *</FormLabel>
              <Select 
                placeholder="Select model" 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
              >
                {(indianBikesData[brand] || []).map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Year *</FormLabel>
            <Select 
              placeholder="Select year" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">KM driven *</FormLabel>
            <Input 
              type="number" 
              value={kmDriven} 
              onChange={(e) => setKmDriven(e.target.value)}
              placeholder="Enter KM driven"
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'gray' }}>
              {kmDriven ? kmDriven.toString().length : 0} / 6
            </div>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">No. of Owners *</FormLabel>
            <Stack direction="row" spacing={2} wrap="wrap">
              <MDBRadio value="1st" name="ownership" id="owner1" label="1st" 
                checked={ownership === "1st"} 
                onChange={() => setOwnership("1st")}
              />
              <MDBRadio value="2nd" name="ownership" id="owner2" label="2nd" 
                checked={ownership === "2nd"} 
                onChange={() => setOwnership("2nd")}
              />
              <MDBRadio value="3rd" name="ownership" id="owner3" label="3rd" 
                checked={ownership === "3rd"} 
                onChange={() => setOwnership("3rd")}
              />
              <MDBRadio value="4th" name="ownership" id="owner4" label="4th" 
                checked={ownership === "4th"} 
                onChange={() => setOwnership("4th")}
              />
              <MDBRadio value="4+" name="ownership" id="owner5" label="4+" 
                checked={ownership === "4+"} 
                onChange={() => setOwnership("4+")}
              />
            </Stack>
          </FormControl>

          <Divider my={4} />
          
          <Heading size="sm" mb={4}>Additional Information</Heading>
          
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            <FormControl>
              <FormLabel>Color</FormLabel>
              <Input 
                type="text" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Registration Place</FormLabel>
              <Input 
                type="text" 
                value={registrationPlace} 
                onChange={(e) => setRegistrationPlace(e.target.value)}
                placeholder="e.g. TN"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Insurance</FormLabel>
              <Select 
                value={insurance} 
                onChange={(e) => setInsurance(e.target.value)}
              >
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third Party">Third Party</option>
                <option value="Zero Dep">Zero Dep</option>
                <option value="Expired">Expired</option>
              </Select>
            </FormControl>
          </SimpleGrid>
          
          <Divider my={4} />
          
          <Heading size="sm" mb={4}>Features</Heading>
          
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            <Checkbox isChecked={abs} onChange={(e) => setAbs(e.target.checked)}>
              ABS
            </Checkbox>
            
            <Checkbox isChecked={alloyWheels} onChange={(e) => setAlloyWheels(e.target.checked)}>
              Alloy Wheels
            </Checkbox>
            
            <Checkbox isChecked={bluetooth} onChange={(e) => setBluetooth(e.target.checked)}>
              Bluetooth
            </Checkbox>
            
            <Checkbox isChecked={accidental} onChange={(e) => setAccidental(e.target.checked)}>
              Accidental
            </Checkbox>
          </SimpleGrid>
        </>
      );
    } else {
      // Car form fields
      return (
        <>
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Brand *</FormLabel>
            <Select 
              placeholder="Select brand" 
              value={brand} 
              onChange={(e) => setBrand(e.target.value)}
            >
              {availableBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </Select>
          </FormControl>

          {brand && (
            <FormControl mb={4}>
              <FormLabel fontWeight="bold">Model *</FormLabel>
              <Select 
                placeholder="Select model" 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Year *</FormLabel>
            <Select 
              placeholder="Select year" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Fuel *</FormLabel>
            <Stack direction="row" spacing={4} wrap="wrap">
              <MDBRadio value="CNG & Hybrids" name="fuelType" id="cng-hybrid" label="CNG & Hybrids" 
                checked={fuelType === "cng" || fuelType === "hybrid"} 
                onChange={() => setFuelType("cng")}
              />
              <MDBRadio value="Diesel" name="fuelType" id="diesel" label="Diesel" 
                checked={fuelType === "diesel"} 
                onChange={() => setFuelType("diesel")}
              />
              <MDBRadio value="Electric" name="fuelType" id="electric" label="Electric" 
                checked={fuelType === "electric"} 
                onChange={() => setFuelType("electric")}
              />
              <MDBRadio value="LPG" name="fuelType" id="lpg" label="LPG" 
                checked={fuelType === "lpg"} 
                onChange={() => setFuelType("lpg")}
              />
              <MDBRadio value="Petrol" name="fuelType" id="petrol" label="Petrol" 
                checked={fuelType === "petrol"} 
                onChange={() => setFuelType("petrol")}
              />
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Transmission *</FormLabel>
            <Stack direction="row" spacing={4}>
              <MDBRadio 
                value="Automatic" 
                name="transmission" 
                id="automatic" 
                label="Automatic" 
                checked={transmission === "Automatic"}
                onChange={() => setTransmission("Automatic")}
              />
              <MDBRadio 
                value="Manual" 
                name="transmission" 
                id="manual" 
                label="Manual" 
                checked={transmission === "Manual"}
                onChange={() => setTransmission("Manual")}
              />
            </Stack>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">KM driven *</FormLabel>
            <Input 
              type="number" 
              value={kmDriven} 
              onChange={(e) => setKmDriven(e.target.value)}
              placeholder="Enter KM driven"
            />
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'gray' }}>
              {kmDriven ? kmDriven.toString().length : 0} / 6
            </div>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">No. of Owners *</FormLabel>
            <Stack direction="row" spacing={2} wrap="wrap">
              <MDBRadio value="1st" name="ownership" id="owner1" label="1st" 
                checked={ownership === "1st"} 
                onChange={() => setOwnership("1st")}
              />
              <MDBRadio value="2nd" name="ownership" id="owner2" label="2nd" 
                checked={ownership === "2nd"} 
                onChange={() => setOwnership("2nd")}
              />
              <MDBRadio value="3rd" name="ownership" id="owner3" label="3rd" 
                checked={ownership === "3rd"} 
                onChange={() => setOwnership("3rd")}
              />
              <MDBRadio value="4th" name="ownership" id="owner4" label="4th" 
                checked={ownership === "4th"} 
                onChange={() => setOwnership("4th")}
              />
              <MDBRadio value="4+" name="ownership" id="owner5" label="4+" 
                checked={ownership === "4+"} 
                onChange={() => setOwnership("4+")}
              />
            </Stack>
          </FormControl>

          <Divider my={4} />
          
          <Heading size="sm" mb={4}>Additional Information</Heading>
          
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            <FormControl>
              <FormLabel>Month</FormLabel>
              <Select 
                placeholder="Select month" 
                value={month} 
                onChange={(e) => setMonth(e.target.value)}
              >
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Color</FormLabel>
              <Input 
                type="text" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. White"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Registration Place</FormLabel>
              <Input 
                type="text" 
                value={registrationPlace} 
                onChange={(e) => setRegistrationPlace(e.target.value)}
                placeholder="e.g. TN"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Insurance</FormLabel>
              <Select 
                value={insurance} 
                onChange={(e) => setInsurance(e.target.value)}
              >
                <option value="Comprehensive">Comprehensive</option>
                <option value="Third Party">Third Party</option>
                <option value="Zero Dep">Zero Dep</option>
                <option value="Expired">Expired</option>
              </Select>
            </FormControl>
          </SimpleGrid>
          
          <Divider my={4} />
          
          <Heading size="sm" mb={4}>Features</Heading>
          
          <SimpleGrid columns={[2, 3, 4]} spacing={4}>
            <Checkbox isChecked={abs} onChange={(e) => setAbs(e.target.checked)}>
              ABS
            </Checkbox>
            
            <Checkbox isChecked={accidental} onChange={(e) => setAccidental(e.target.checked)}>
              Accidental
            </Checkbox>
            
            <Checkbox isChecked={adjustableMirror} onChange={(e) => setAdjustableMirror(e.target.checked)}>
              Adjustable Mirrors
            </Checkbox>
            
            <Checkbox isChecked={adjustableSteering} onChange={(e) => setAdjustableSteering(e.target.checked)}>
              Adjustable Steering
            </Checkbox>
            
            <Checkbox isChecked={airConditioning} onChange={(e) => setAirConditioning(e.target.checked)}>
              Air Conditioning
            </Checkbox>
            
            <Box>
              <FormLabel fontSize="sm">Airbags</FormLabel>
              <Select 
                size="sm"
                value={airbags} 
                onChange={(e) => setAirbags(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6+">6+</option>
              </Select>
            </Box>
            
            <Checkbox isChecked={cruiseControl} onChange={(e) => setCruiseControl(e.target.checked)}>
              Cruise Control
            </Checkbox>
            
            <Checkbox isChecked={powerWindows} onChange={(e) => setPowerWindows(e.target.checked)}>
              Power Windows
            </Checkbox>
            
            <Checkbox isChecked={alloyWheels} onChange={(e) => setAlloyWheels(e.target.checked)}>
              Alloy Wheels
            </Checkbox>
            
            <Checkbox isChecked={bluetooth} onChange={(e) => setBluetooth(e.target.checked)}>
              Bluetooth
            </Checkbox>
            
            <Checkbox isChecked={parkingSensors} onChange={(e) => setParkingSensors(e.target.checked)}>
              Parking Sensors
            </Checkbox>
            
            <Checkbox isChecked={powerSteering} onChange={(e) => setPowerSteering(e.target.checked)}>
              Power Steering
            </Checkbox>
            
            <Checkbox isChecked={rearCamera} onChange={(e) => setRearCamera(e.target.checked)}>
              Rear Camera
            </Checkbox>
          </SimpleGrid>
        </>
      );
    }
  };

  return (
    <div className="mt-3 mb-3">
      <MDBCard>
        <MDBCardBody>
          {renderContent()}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}