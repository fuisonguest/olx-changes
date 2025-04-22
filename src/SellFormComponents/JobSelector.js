import React, { useState, useEffect } from "react";
import {
  MDBCard,
  MDBCardBody,
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
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export default function JobSelector({ onJobSelect }) {
  const { category, item } = useParams();
  
  // Salary details
  const [salaryPeriod, setSalaryPeriod] = useState("Monthly");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  
  // Position type
  const [positionType, setPositionType] = useState("Full-time");
  
  // Education
  const [educationRequired, setEducationRequired] = useState("Any");
  
  // Experience
  const [experienceRequired, setExperienceRequired] = useState("Fresher");
  
  // Job location
  const [jobLocation, setJobLocation] = useState("");
  
  // Company name
  const [companyName, setCompanyName] = useState("");
  
  // Job role/title
  const [jobRole, setJobRole] = useState("");
  
  // Skills required
  const [skills, setSkills] = useState("");
  
  // Number of openings
  const [openings, setOpenings] = useState("1");
  
  // Job category - specific type of job based on the selection
  const [jobCategory, setJobCategory] = useState("");

  // Set job data for parent
  useEffect(() => {
    onJobSelect({
      salaryPeriod,
      salaryFrom,
      salaryTo,
      positionType,
      educationRequired,
      experienceRequired,
      jobLocation,
      companyName,
      jobRole,
      skills,
      openings,
      jobCategory
    });
  }, [
    salaryPeriod, salaryFrom, salaryTo, positionType, educationRequired,
    experienceRequired, jobLocation, companyName, jobRole, skills, openings,
    jobCategory, onJobSelect
  ]);

  // Handle job category selection based on item param
  useEffect(() => {
    if (item) {
      setJobCategory(item);
    }
  }, [item]);

  // Available job categories
  const jobCategories = [
    "Data entry & Back office",
    "Sales & Marketing",
    "BPO & Telecaller",
    "Driver",
    "Office Assistant",
    "Delivery & Collection",
    "Teacher",
    "Cook",
    "Receptionist & Front office",
    "Operator & Technician",
    "IT Engineer & Developer",
    "Hotel & Travel Executive",
    "Accountant",
    "Designer",
    "Other Jobs"
  ];

  // Available education options
  const educationOptions = [
    "Any",
    "10th Pass",
    "12th Pass",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Professional Certification"
  ];

  // Available experience options
  const experienceOptions = [
    "Fresher",
    "0-1 Years",
    "1-3 Years",
    "3-5 Years",
    "5-10 Years",
    "10+ Years"
  ];

  return (
    <div className="mt-3 mb-3">
      <MDBCard>
        <MDBCardBody>
          <Heading size="md" mb={4}>JOB DETAILS</Heading>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Job Category *</FormLabel>
            <Select 
              value={jobCategory} 
              onChange={(e) => setJobCategory(e.target.value)}
              placeholder="Select Job Category"
            >
              {jobCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Job Role/Title *</FormLabel>
            <Input 
              value={jobRole} 
              onChange={(e) => setJobRole(e.target.value)} 
              placeholder="e.g. Data Entry Operator, Sales Executive"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Company Name</FormLabel>
            <Input 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
              placeholder="Enter company name"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Salary Period *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={salaryPeriod === "Hourly" ? "blue" : "gray"}
                variant={salaryPeriod === "Hourly" ? "solid" : "outline"}
                onClick={() => setSalaryPeriod("Hourly")}
              >
                Hourly
              </Button>
              <Button 
                colorScheme={salaryPeriod === "Monthly" ? "blue" : "gray"}
                variant={salaryPeriod === "Monthly" ? "solid" : "outline"}
                onClick={() => setSalaryPeriod("Monthly")}
              >
                Monthly
              </Button>
              <Button 
                colorScheme={salaryPeriod === "Weekly" ? "blue" : "gray"}
                variant={salaryPeriod === "Weekly" ? "solid" : "outline"}
                onClick={() => setSalaryPeriod("Weekly")}
              >
                Weekly
              </Button>
              <Button 
                colorScheme={salaryPeriod === "Yearly" ? "blue" : "gray"}
                variant={salaryPeriod === "Yearly" ? "solid" : "outline"}
                onClick={() => setSalaryPeriod("Yearly")}
              >
                Yearly
              </Button>
            </ButtonGroup>
          </FormControl>

          <SimpleGrid columns={[1, 2]} spacing={4} mb={4}>
            <FormControl>
              <FormLabel fontWeight="bold">Salary From</FormLabel>
              <InputGroup>
                <InputLeftAddon children="₹" />
                <Input 
                  type="number" 
                  value={salaryFrom} 
                  onChange={(e) => setSalaryFrom(e.target.value)} 
                  placeholder="Minimum salary"
                />
              </InputGroup>
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="bold">Salary To</FormLabel>
              <InputGroup>
                <InputLeftAddon children="₹" />
                <Input 
                  type="number" 
                  value={salaryTo} 
                  onChange={(e) => setSalaryTo(e.target.value)} 
                  placeholder="Maximum salary"
                />
              </InputGroup>
            </FormControl>
          </SimpleGrid>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Position Type *</FormLabel>
            <ButtonGroup isAttached>
              <Button 
                colorScheme={positionType === "Full-time" ? "blue" : "gray"}
                variant={positionType === "Full-time" ? "solid" : "outline"}
                onClick={() => setPositionType("Full-time")}
              >
                Full-time
              </Button>
              <Button 
                colorScheme={positionType === "Part-time" ? "blue" : "gray"}
                variant={positionType === "Part-time" ? "solid" : "outline"}
                onClick={() => setPositionType("Part-time")}
              >
                Part-time
              </Button>
              <Button 
                colorScheme={positionType === "Contract" ? "blue" : "gray"}
                variant={positionType === "Contract" ? "solid" : "outline"}
                onClick={() => setPositionType("Contract")}
              >
                Contract
              </Button>
              <Button 
                colorScheme={positionType === "Temporary" ? "blue" : "gray"}
                variant={positionType === "Temporary" ? "solid" : "outline"}
                onClick={() => setPositionType("Temporary")}
              >
                Temporary
              </Button>
            </ButtonGroup>
          </FormControl>

          <Divider my={4} />

          <SimpleGrid columns={[1, 2]} spacing={4} mb={4}>
            <FormControl>
              <FormLabel fontWeight="bold">Education Required</FormLabel>
              <Select 
                value={educationRequired} 
                onChange={(e) => setEducationRequired(e.target.value)}
              >
                {educationOptions.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel fontWeight="bold">Experience Required</FormLabel>
              <Select 
                value={experienceRequired} 
                onChange={(e) => setExperienceRequired(e.target.value)}
              >
                {experienceOptions.map((exp) => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Job Location *</FormLabel>
            <Input 
              value={jobLocation} 
              onChange={(e) => setJobLocation(e.target.value)} 
              placeholder="e.g. Mumbai, Delhi, Remote"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Skills Required</FormLabel>
            <Input 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
              placeholder="e.g. Excel, Communication, Programming"
            />
            <Text fontSize="sm" color="gray.500">Separate multiple skills with commas</Text>
          </FormControl>
          
          <FormControl mb={4}>
            <FormLabel fontWeight="bold">Number of Openings</FormLabel>
            <Select 
              value={openings} 
              onChange={(e) => setOpenings(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2-5">2-5</option>
              <option value="5-10">5-10</option>
              <option value="10+">10+</option>
            </Select>
          </FormControl>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
} 