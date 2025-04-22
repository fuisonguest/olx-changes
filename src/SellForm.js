import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import {
  MDBCard,
  MDBCardHeader,
  MDBContainer,
  MDBListGroup,
  MDBListGroupItem,
  MDBBtn,
} from "mdb-react-ui-kit";
import Sell from "./Sell";
import MultipleImageUploadComponent from "./SellFormComponents/multiple-image-upload.component";
import Price from "./SellFormComponents/Price";
import SelectLocation from "./SellFormComponents/SelectLocation";
import Details from "./SellFormComponents/Details";
import Addetails from "./SellFormComponents/Addetails";
import VehicleSelector from "./SellFormComponents/VehicleSelector";
import PropertySelector from "./SellFormComponents/PropertySelector";
import JobSelector from "./SellFormComponents/JobSelector";
import CategoryFields from "./SellFormComponents/CategoryFields";
import axios from "axios";
import { categories } from "./resources/Catagories";
import NotFound from "./resources/NotFound";
import { useToast } from "@chakra-ui/react";
import { API_BASE_URL } from "./utils/config";


export default function SellForm() {
  const { category } = useParams();
  const { item } = useParams();

  // Update the validation to check against all valid categories
  const isValidCategory = categories.some(cat => 
    cat.title.toLowerCase() === category.toLowerCase() || 
    cat.items.includes(item)
  );

  const handleClick = () => {
    // Redirect to the sell page
    navigate('/sell');
  };

  const [formInputs, setFormInputs] = useState([]);

  const handleAddForm = () => {
    if (formInputs.length < 12) {
      // check if the length of formInputs is less than 12
      setFormInputs((prevFormInputs) => [
        ...prevFormInputs,
        <MultipleImageUploadComponent
          key={prevFormInputs.length}
          onFileSelect={(file) => handleFileChange(file)}
        />,
      ]);
    }
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [price, setPrice] = useState();
  const [location, setLocation] = useState([]);
  const [address, setaddress] = useState([]);
  const [addorloc, setaddorloc] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [vehicleData, setVehicleData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [propertyData, setPropertyData] = useState({});
  const [jobData, setJobData] = useState({});
  const toast = useToast();


  const handleFileChange = (file) => {
    // Handle the uploaded file here
    setUploadedFiles((prevUploadedFiles) => [...prevUploadedFiles, file]);
  };
  const handlePriceChange = (price) => {
    // Handle the uploaded Price here
    setPrice(price);
  };

  const handleAddressChange = ({ location, address, addorloc }) => {
    setLocation(location);
    setaddress(address);
    setaddorloc(addorloc);
  };

  const handleDetailsChange = ({ title, description }) => {
    // Handle the Details here
    setTitle(title);
    setDescription(description);
  };

  const handleVehicleDataChange = (data) => {
    // Handle the vehicle data here
    setVehicleData(data);
  };

  const handlePropertyDataChange = (data) => {
    // Handle the property data here
    console.log("Property data changed (type):", typeof data);
    console.log("Property data changed:", data);
    
    // Make sure property data is always an object
    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        setPropertyData(parsedData);
        console.log("Parsed property data from string:", parsedData);
      } catch (e) {
        console.error("Failed to parse property data string:", e);
        setPropertyData({});
      }
    } else if (data && typeof data === 'object') {
      // Ensure all fields are in the right format (strings for text fields)
      const processedData = {
        ...data,
        propertyType: String(data.propertyType || ''),
        bhk: String(data.bhk || ''),
        bathrooms: String(data.bathrooms || ''),
        furnishing: String(data.furnishing || ''),
        projectStatus: String(data.projectStatus || ''),
        listedBy: String(data.listedBy || ''),
        superBuiltupArea: String(data.superBuiltupArea || ''),
        carpetArea: String(data.carpetArea || ''),
        maintenance: String(data.maintenance || ''),
        totalFloors: String(data.totalFloors || ''),
        floorNo: String(data.floorNo || ''),
        carParking: String(data.carParking || ''),
        facing: String(data.facing || ''),
        projectName: String(data.projectName || ''),
        age: String(data.age || ''),
        balconies: String(data.balconies || ''),
        amenities: {
          lift: Boolean(data.amenities?.lift),
          powerBackup: Boolean(data.amenities?.powerBackup),
          security: Boolean(data.amenities?.security),
          garden: Boolean(data.amenities?.garden),
          clubhouse: Boolean(data.amenities?.clubhouse),
          swimmingPool: Boolean(data.amenities?.swimmingPool),
          gym: Boolean(data.amenities?.gym),
          waterSupply: Boolean(data.amenities?.waterSupply)
        }
      };
      
      setPropertyData(processedData);
      console.log("Processed property data:", processedData);
    } else {
      console.error("Property data is not in expected format:", data);
      setPropertyData({});
    }
  };

  const handleCategoryDataChange = (data) => {
    // Handle the category data here
    setCategoryData(data);
  };

  const handleJobDataChange = (data) => {
    console.log("Job data changed (type):", typeof data);
    console.log("Job data changed:", data);
    
    // Update job data directly without excessive processing
    setJobData(data);
  };

  function handleNameSelect(name) {
    setName(name);
  }
  function handleImageSelect(img) {
   setImage(img);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log property data before submission
    console.log("Property data being submitted (type):", typeof propertyData);
    console.log("Property data being submitted:", propertyData);
    
    // Ensure propertyData is a valid object before submitting
    let processedPropertyData = propertyData;
    if (typeof propertyData === 'string') {
      try {
        processedPropertyData = JSON.parse(propertyData);
        console.log("Parsed property data from string to object");
      } catch (e) {
        console.error("Failed to parse property data:", e);
        processedPropertyData = {}; // Fallback to empty object
      }
    } else if (!propertyData || Array.isArray(propertyData)) {
      processedPropertyData = {}; // Ensure it's an object, not null or an array
    }
    
    // Validate required fields
    const errors = [];

    if (!title) {
      errors.push("Please add title");
    }
    if (!description) {
      errors.push("Please add description");
    }
    if ((address.length === 0 && addorloc === "address") || (location.length === 0 && addorloc === "location")) {
      errors.push("Please add address or location");
    }
    if (uploadedFiles.length === 0) {
      errors.push("Please upload a file");
    }
    if (!name) {
      errors.push("Please add your name");
    }
    if (!price) {
      errors.push("Please provide a price");
    }
    
    // Only validate vehicle data for vehicle categories
    if ((category.toLowerCase().includes("cars") || category.toLowerCase() === "bikes") && 
        (!vehicleData.brand || !vehicleData.model || !vehicleData.vehicleType)) {
      errors.push("Please complete all vehicle details");
    }
    
    // Validate spare parts data
    if ((category.toLowerCase().includes("spare") || item?.toLowerCase().includes("spare") ||
         category.toLowerCase().includes("parts") || item?.toLowerCase().includes("parts")) && 
        (!vehicleData.brand || !vehicleData.model)) {
      errors.push("Please complete all spare part details");
    }

    // Validate property data
    if ((category.toLowerCase() === "properties" || 
         item?.toLowerCase().includes("house") ||
         item?.toLowerCase().includes("apartment") ||
         item?.toLowerCase().includes("flat") ||
         item?.toLowerCase().includes("villa") ||
         item?.toLowerCase().includes("property")) && 
        (!processedPropertyData.propertyType || !processedPropertyData.bhk || !processedPropertyData.bathrooms || 
         !processedPropertyData.superBuiltupArea || !processedPropertyData.carpetArea)) {
      errors.push("Please complete all property details");
    }

    // Validate mobile data
    if ((category.toLowerCase() === "mobiles" || 
         item?.toLowerCase().includes("mobile") ||
         item?.toLowerCase().includes("phone")) && 
        (!categoryData.brand)) {
      errors.push("Please select a brand for your mobile phone");
    }

    // Validate job data
    if ((category.toLowerCase() === "jobs" || 
         item?.toLowerCase().includes("job") ||
         item?.toLowerCase().includes("jobs")) && 
        (!jobData.jobRole || !jobData.jobCategory || !jobData.positionType || !jobData.jobLocation)) {
      errors.push("Please complete the required job details");
    }

    if (errors.length > 0) {
      toast({
        title: "Error",
        description: <div dangerouslySetInnerHTML={{ __html: errors.join("<br>") }} />,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading("post");

    try {
      // Process image uploads
      const picUrls = await Promise.all(
        uploadedFiles.map(async (file) => {
          // Check if file is already a URL string (already uploaded)
          if (typeof file === 'string' && file.startsWith('http')) {
            return file;
          }
          
          // Otherwise upload the file
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "random");
          const { data } = await axios.post(
            "https://api.cloudinary.com/v1_1/dlpjayfhf/image/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          return data.secure_url;
        })
      );

      // Process profile image if exists
      let profileImageUrl = "";
      if (image) {
        if (typeof image === 'string' && image.startsWith('http')) {
          profileImageUrl = image;
        } else {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "random");
          const { data } = await axios.post(
            "https://api.cloudinary.com/v1_1/dlpjayfhf/image/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          profileImageUrl = data.secure_url;
        }
      }

      // Process job data if it exists and has fields
      let processedJobData = jobData;
      if (typeof jobData === 'object' && Object.keys(jobData).length > 0) {
        // Log the raw job data before any processing
        console.log("Raw job data before processing:", jobData);
        
        // Make sure all fields are preserved exactly as entered in the form
        processedJobData = {
          jobRole: jobData.jobRole || '',
          jobCategory: jobData.jobCategory || '',
          companyName: jobData.companyName || '',
          positionType: jobData.positionType || 'Full-time',
          salaryPeriod: jobData.salaryPeriod || 'Monthly',
          salaryFrom: jobData.salaryFrom || '',
          salaryTo: jobData.salaryTo || '',
          educationRequired: jobData.educationRequired || 'Any',
          experienceRequired: jobData.experienceRequired || 'Fresher',
          jobLocation: jobData.jobLocation || '',
          skills: jobData.skills || '',
          openings: jobData.openings || '1'
        };
        
        console.log("Processed job data to be included:", processedJobData);
      }
      
      // Prepare the data to be sent to the server
      const productData = {
        title,
        description,
        address: addorloc === "address" ? address : location,
        price,
        uploadedFiles: picUrls,
        image: profileImageUrl,
        name,
        catagory: category,
        subcatagory: item,
        vehicleData: vehicleData,
        categoryData: categoryData,
        propertyData: processedPropertyData, // Use the actual processed data
        jobData: processedJobData // Use the processed job data
      };
      
      console.log("Full product data being sent:", productData);
      console.log("Property data included (processed):", processedPropertyData);
      console.log("Job data included (processed):", processedJobData);
      
      const token = localStorage.getItem('authToken');
      const response = await axios.post("https://chages-new-olx.onrender.com/add_product", productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Server response:", response.data);
      
      setLoading("redirect");

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Failed to post your ad. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading("");
    }
  };

  return (
    <div>
      {isValidCategory ? (
        <MDBContainer style={{ textAlign: "start" }} className="mt-3 mb-3">
          {loading === "post"? (
            <div className="back">
              <div className="lo-container">
                <ReactLoading
                  type="spin"
                  color="green"
                  height={"10%"}
                  width={"10%"}
                />
              </div>
            </div>
          ) : (
            <MDBCard>
              <MDBCardHeader>                
                <h5>
                  <b>SELECTED CATEGORY</b>
                </h5>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p className="mt-2">
                    {category} / {item}
                  </p>
                  <p onClick={handleClick}>
                    <u>
                      <b>Change</b>
                    </u>
                  </p>
                </div>
              </MDBCardHeader>
              <MDBListGroup flush>
                <MDBListGroupItem>
                  <h5>
                    <b>INCLUDE SOME DETAILS</b>
                    <Details
                      onTitleSelect={(title) =>
                        handleDetailsChange({ title, description })
                      }
                      onDescriptionSelect={(description) =>
                        handleDetailsChange({ title, description })
                      }
                    />{" "}
                  </h5>
                </MDBListGroupItem>
                
                {(category.toLowerCase().includes("cars") || 
                  category.toLowerCase() === "bikes" || 
                  item?.toLowerCase() === "motorcycles" ||
                  category.toLowerCase().includes("spare") || 
                  item?.toLowerCase().includes("spare") ||
                  category.toLowerCase().includes("parts") || 
                  item?.toLowerCase().includes("parts")) && (
                  <MDBListGroupItem>
                    <h5>
                      <b>VEHICLE DETAILS</b>
                      <VehicleSelector onVehicleSelect={handleVehicleDataChange} />
                    </h5>
                  </MDBListGroupItem>
                )}

                {(category.toLowerCase() === "properties" || 
                  item?.toLowerCase().includes("house") ||
                  item?.toLowerCase().includes("apartment") ||
                  item?.toLowerCase().includes("flat") ||
                  item?.toLowerCase().includes("villa") ||
                  item?.toLowerCase().includes("property")) && (
                  <MDBListGroupItem>
                    <h5>
                      <b>PROPERTY DETAILS</b>
                      <PropertySelector onPropertySelect={handlePropertyDataChange} />
                    </h5>
                  </MDBListGroupItem>
                )}
                
                {/* Add Jobs selector for job categories */}
                {(category.toLowerCase() === "jobs" || 
                  item?.toLowerCase().includes("job") ||
                  item?.toLowerCase().includes("jobs")) && (
                  <MDBListGroupItem>
                    <h5>
                      <b>JOB DETAILS</b>
                      <JobSelector onJobSelect={handleJobDataChange} />
                    </h5>
                  </MDBListGroupItem>
                )}
                
                {/* Add category fields for non-vehicle, non-property, and non-job categories */}
                {!(category.toLowerCase().includes("cars") || 
                   category.toLowerCase() === "bikes" || 
                   item?.toLowerCase() === "motorcycles" ||
                   category.toLowerCase().includes("spare") || 
                   item?.toLowerCase().includes("spare") ||
                   category.toLowerCase().includes("parts") || 
                   item?.toLowerCase().includes("parts") ||
                   category.toLowerCase() === "properties" || 
                   item?.toLowerCase().includes("house") ||
                   item?.toLowerCase().includes("apartment") ||
                   item?.toLowerCase().includes("flat") ||
                   item?.toLowerCase().includes("villa") ||
                   item?.toLowerCase().includes("property") ||
                   category.toLowerCase() === "jobs" ||
                   item?.toLowerCase().includes("job") ||
                   item?.toLowerCase().includes("jobs")) && (
                  <MDBListGroupItem>
                    <h5>
                      <b>CATEGORY DETAILS</b>
                      <CategoryFields category={category} onCategoryDataChange={handleCategoryDataChange} />
                    </h5>
                  </MDBListGroupItem>
                )}
                
                <MDBListGroupItem>
                  <h5>
                    <b>SET A PRICE</b>
                    <Price
                      onPriceSelect={(price) => handlePriceChange(price)}
                    />
                  </h5>
                </MDBListGroupItem>

                <MDBListGroupItem>
                  <h5>
                    <b>UPLOAD UP TO 12 PHOTOS</b>
                    <br />
                    {formInputs.map((formInput) => formInput)}
                    <MDBBtn
                      type="button"
                      className="mt-2"
                      onClick={handleAddForm}
                    >
                      Add Image
                    </MDBBtn>
                  </h5>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <h5>
                    <b>CONFIRM YOUR LOCATION</b>
                    <SelectLocation
                      onlocationSelect={(location) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                      onaddressSelect={(address) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                      setAddOrLoc={(addorloc) =>
                        handleAddressChange({ location, address, addorloc })
                      }
                    />
                  </h5>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <h5>
                    <b>REVIEW YOUR DETAILS</b>
                    <Addetails onNameSelect={handleNameSelect} onImageSelect={handleImageSelect} />
                  </h5>
                </MDBListGroupItem>
                <MDBListGroupItem>
                  <h5>
                    <form onSubmit={handleSubmit}>
                      <MDBBtn
                        className="mt-3"
                        type="submit"
                        size="lg"
                        color="info"
                        border="success"
                      >
                        POST
                      </MDBBtn>
                    </form>
                  </h5>
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCard>
          )}
        </MDBContainer>
      ) : (
        <NotFound />
      )}
      {loading === "redirect" && navigate('/adsuccess')}
    </div>
  );
}
