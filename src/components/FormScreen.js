import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import '../componentCSS/Form.css';
import { updateDocument, executeErrorNextProcess, updateCurrentScreen ,initializeWebSDK, setCurrentScreenDetails } from '../LouieSDK/LouieSDK'; 
import { addScreenOffReceiver, removeScreenOffReceiver } from '../LouieSDK/utils/ScreenOffReceiver';
import LouieImage from '../res/louie_img_icn_1.png'; 
import { handleVoiceError } from '../LouieSDK/VoiceHandler/VoiceEventProcessor';
import {eventEmitter } from '../LouieSDK/Interfaces/Callbacks';

const Form = () => {

  const [first_name,setFirstname] = useState('');
  const [date_of_birth,setDateofbirth] = useState('');
  const [gender,setGender] = useState('');
  const [marital,setMarital] = useState('');
  const [city,setCity] = useState('');
  const [country,setCountry] = useState('');
  const [state,setState] = useState('');
  const [last_name,setLastname] = useState('');
  const [phone,setPhone] = useState('');
  const [email,setEmail] = useState('');
  const [pin_code,setPincode] = useState('');
  const [education, setEducation] = useState([]);

  const dropdowns = {
    city: [
      'mumbai', 'delhi', 'bangalore', 'hyderabad', 'ahmedabad', 'chennai', 
      'kolkata', 'surat', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 
      'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri-chinchwad', 
      'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 
      'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 'vijayawada', 
      'aurangabad', 'madurai', 'mysore', 'jammu', 'amritsar', 
      'jabalpur', 'kota', 'dehradun', 'rourkela', 'cuttack', 'trichy', 
      'salem', 'durgapur', 'siliguri', 'ranchi'
    ],
    state: [
      'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 
      'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 
      'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 
      'mizoram', 'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 
      'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 
      'west bengal'
    ],
    country: [
      'india', 'usa', 'uk', 'canada', 'australia', 'germany', 'france', 
      'italy', 'spain', 'china', 'japan', 'south korea', 'brazil', 
      'mexico', 'south africa', 'nigeria', 'argentina', 'colombia', 
      'chile', 'peru', 'sweden', 'norway', 'denmark', 'netherlands', 
      'belgium', 'switzerland', 'austria', 'new zealand', 'singapore', 
      'malaysia', 'thailand', 'philippines', 'indonesia', 'pakistan', 
      'bangladesh', 'nepal', 'sri lanka', 'uae', 'saudi arabia', 'qatar', 
      'kuwait', 'oman', 'bahrain'
    ]
  };
  const educationLevels = [
    'Graduate',
    'Postgraduate',
    'Doctorate',
    'Diploma',
    'High School',
    'Professional Certification',
  ];
  const refs = {
    first_nameRef: useRef(null),
    last_nameRef: useRef(null),
    dateofbirthRef: useRef(null),
    emailRef: useRef(null),
    genderRef: useRef(null), 
    maritalRef: useRef(null),
    phoneRef: useRef(null),
    cityRef: useRef(null),
    stateRef: useRef(null),
    countryRef: useRef(null),
    pin_codeRef: useRef(null),
    educationRef: useRef(null)
  };

  useEffect(() => {
    const actionListenerNew = (input, result) => {
      console.log("0000", input);
      handleCallbackNew(input, result);
    };
    eventEmitter.removeAllListeners('handlePaste');
    eventEmitter.addListener('handlePaste', actionListenerNew);
    return () => {
      eventEmitter.removeListener('handlePaste', actionListenerNew);
    };
  }, []);

  const handleCallbackNew = (action, result) => {
    console.log("1111", action);
    console.log("2222", typeof result);    
    console.log("3333", result);    
    if (action === 'process_ask_first_name'|| action === 'process_modify_first_name') {
      console.log("2222","2222");
      // setSearchQuery(result);
      setFirstname(result);
      scrollToField('first_name');
      createAndUpdateRootWindow(action);
    } else if(action === 'process_ask_last_name' || action === 'process_modify_last_name'){
      console.log("3333","2222");
      // setSearchQuery(result);
      setLastname(result);
      scrollToField('last_name');
      createAndUpdateRootWindow(action);
    }else if(action === 'process_ask_phone' || action === 'process_modify_phone'){
      console.log("3333","2222");
      // setSearchQuery(result);
      setPhone(result);
      scrollToField('phone');
      createAndUpdateRootWindow(action);
    }else if(action === 'process_ask_pin_code' || action === 'process_modify_pin_code'){
      console.log("3333","2222");
      // setSearchQuery(result);
      setPincode(result);
      scrollToField('pin_code');
      createAndUpdateRootWindow(action);
    }else if(action === 'process_ask_email' || action === 'process_modify_email'){
      console.log("3333","2222");
      // setSearchQuery(result);
      setEmail(result);
      scrollToField('email');
      createAndUpdateRootWindow(action);
    }
    else if(action === 'process_ask_date_of_birth' || action === 'process_modify_date_of_birth'){
      dateInputRef.current.value = result; // Update the date input field
      dateInputRef.current.focus();
      setDateofbirth(result);
      scrollToField('dateofbirth');
      createAndUpdateRootWindow(action);
    }else if(action === 'process_ask_city' || action === 'process_modify_city'){
      if(dropdowns.city.includes(result)){
        setCity(result);
        scrollToField('city');
        createAndUpdateRootWindow(action);
      }
      else{
        // executeErrorNextProcess(action);
        handleVoiceError();
      }
    }else if(action === 'process_ask_country' || action === 'process_modify_country'){
      if(dropdowns.country.includes(result)){
        setCountry(result);
        scrollToField('country');
        createAndUpdateRootWindow(action);
      }
      else{
        // executeErrorNextProcess(action);
        handleVoiceError();
      }
    }else if(action === 'process_ask_state' || action === 'process_modify_state'){
      if(dropdowns.state.includes(result)){
        setState(result);
        scrollToField('state');
        createAndUpdateRootWindow(action);
      }
      else{
        // executeErrorNextProcess(action);
        handleVoiceError();
      }
    }else if(action === 'process_set_gender' || action === 'process_ask_gender'){
      setGender(result);
      scrollToField('gender');
      createAndUpdateRootWindow(action);
    }else if(action === 'process_set_marital' || action === 'process_ask_marital'){
      setMarital(result);
      scrollToField('marital');
      createAndUpdateRootWindow(action);
    }else if(action === 'process_ask_education' || action === 'process_modify_education'){
      console.log("3333","2121");
      console.log("inside setting education",result);
      setEducation((prevEducation) => {
        // Create a new set by merging previous education and new matchedKeys
        const updatedEducation = [...new Set([...prevEducation, ...result])];
        return updatedEducation;
      });
      console.log("inside setting education",education);
      scrollToField('education');
      createAndUpdateRootWindow(action);
    }
    else {
      executeErrorNextProcess(action);
    }
    console.log('handleCallbackNew function has been triggered.',"11");
  };

  const createAndUpdateRootWindow = (action) => {
    setTimeout(() => {
      updateCurrentScreen(document, action);
      }, 1000);
  }
  const handleFirstNameChange = (e) => {
    const newFirstName = e.target.value;
    setFirstname(newFirstName);
  };
  const handleLastNameChange = (e) => {
    const newFirstName = e.target.value;
    setLastname(newFirstName);
  };
  const handleDateOfBirthChange = (e) => {
    const newFirstName = e.target.value;
    setDateofbirth(newFirstName);
  };
  const handleGenderChange = (e) => {
    const res = e.target.value;
    setGender(res);
  };
  const handleMaritalChange = (e) => {
    const res = e.target.value;
    setMarital(res);
  };
  const handleCityChange = (e) => {
    const newFirstName = e.target.value;
    setCity(newFirstName);
  };
  const handleCountryChange = (e) => {
    const newFirstName = e.target.value;
    setCountry(newFirstName);
  };
  const handleStateChange = (e) => {
    const newFirstName = e.target.value;
    setState(newFirstName);
  };
  const handleCalendarClick = () => {
    if (dateInputRef.current) {
       dateInputRef.current.focus(); // Trigger the date picker
    }
  };
  const handlePhoneChange = (e) => {
    const newFirstName = e.target.value;
    setPhone(newFirstName);
  };
  const handleEmailChange = (e) => {
    const newFirstName = e.target.value;
    setEmail(newFirstName);
  };
  const handlePinCodeChange = (e) => {
    const newFirstName = e.target.value;
    setPincode(newFirstName);
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // Add to selected education levels if checked
      setEducation([...education, value]);
    } else {
      // Remove from selected education levels if unchecked
      setEducation(education.filter((item) => item !== value));
    }
  };

  const scrollToField = (field) => {
    console.log('Scrolling to field:', field);
    const ref = refs[`${field}Ref`];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const startVoiceSession = () => {
    // console.log("ane chal na bhaiii");
    initializeWebSDK(document, "eng", false);
  };
  const dateInputRef = useRef(null);

  return (
  <div className="form-carousel-wrapper" id="form_screen" style={{ display: "flex" }}>
  <div className="form-container">
    <form>
      <div className='first-name'>
        <label className="form-label">Name:</label>
        <input type={'text'} id="first-name" name={first_name} value={first_name} onChange={handleFirstNameChange} ref={refs[`first_nameRef`]} />
      </div>
      {/* <div className='last-name'>
        <label className="form-label">Last Name:</label>
        <input type="text" id="last-name" name={last_name} value={last_name} onChange={handleLastNameChange} ref={refs[`last_nameRef`]} />
      </div> */}
      <div className='phone'>
        <label className="form-label">phoneNo:</label>
        <input type="text" id="phone" name={phone} value={phone} onChange={handlePhoneChange} ref={refs[`phoneRef`]}/>
      </div>
      <div className='pin-code'>
        <label className="form-label">Pin-Code:</label>
        <input type="text" id="pin" name={pin_code} value={pin_code} onChange={handlePinCodeChange} ref={refs[`pin_codeRef`]}/>
      </div>
      <div className='email'>
        <label className="form-label">Email:</label>
        <input type="text" id="email" name={email} value={email} onChange={handleEmailChange} ref={refs[`emailRef`]}/>
      </div>
      <div className='date-of-birth'>
        <label className="form-label">Date of Birth:</label>
        <div className="date-input-wrapper" ref={refs[`dateofbirthRef`]}>
          <input type="date" id="date-of-birth" name={date_of_birth} value={date_of_birth} onChange={handleDateOfBirthChange} ref={dateInputRef} />
          <FaCalendarAlt className="calendar-icon" onClick={handleCalendarClick} />
        </div>
      </div>
      <div className='gender' id= 'gender' ref={refs[`genderRef`]}>
        <label className="form-label">Gender:</label>
        <div className="radio-group">
          <input type="radio" id="male" name={gender} value="male" checked={gender === 'male'} onChange={handleGenderChange} /> Male
          <input type="radio" name={gender} value="female" id="female" checked={gender === 'female'} onChange={handleGenderChange} /> Female
          <input type="radio" name={gender} value="other" id="other" checked={gender === 'other'} onChange={handleGenderChange} /> Other
        </div>
      </div>
      {/* <div className='marital' id= 'marital' ref={refs[`maritalRef`]}>
        <label className="form-label">Marital-Status:</label>
        <div className="radio-group">
          <input type="radio" id="single" name={marital} value="single" checked={marital === 'single'} onChange={handleMaritalChange} /> Single
          <input type="radio" name={marital} value="married" id="married" checked={marital === 'married'} onChange={handleMaritalChange} /> Married
          <input type="radio" name={marital} value="divorced" id="divorced" checked={marital === 'divorced'} onChange={handleMaritalChange} /> Divorced
        </div>
      </div> */}
      <div className='city' ref={refs[`cityRef`]}>
        <label className="form-label">City:</label>
        <select id="city" name="city" value={city} onChange={handleCityChange} className="form-select">
          <option value="">Select City</option>
          {dropdowns.city.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      {/* <div className='state' ref={refs[`stateRef`]}>
        <label className="form-label">State:</label>
        <select id="state" name="state" value={state} onChange={handleStateChange} className="form-select">
          <option value="">Select State</option>
          {dropdowns.state.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className='country' ref={refs[`countryRef`]}>
        <label className="form-label">Country:</label>
        <select id="country" name="country" value={country} onChange={handleCountryChange} className="form-select">
          <option value="">Select Country</option>
          {dropdowns.country.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div> */}
      <div className='education' ref={refs['educationRef']}>
        <label className="form-label">Education:</label>
          {educationLevels.map((level, index) => (
            <div key={index} id='education'>
              <input
                type="checkbox"
                value={level}
                checked={education.includes(level)} 
                onChange={handleCheckboxChange}
                id={`education-${index}`}
              />
              <label htmlFor={`education-${index}`}>{level}</label>
            </div>
          ))}
      </div>
    </form>
    <button className="louie-button" onClick={startVoiceSession}>
        <img src={LouieImage} alt="Louie Button" />
    </button>
  </div>
</div>
  );
};

export default Form;