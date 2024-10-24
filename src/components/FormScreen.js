import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import '../componentCSS/Form.css';
import { updateDocument, executeErrorNextProcess, updateCurrentScreen, initializeWebSDK, setCurrentScreenDetails } from '../LouieSDK/LouieSDK';
import { addScreenOffReceiver, removeScreenOffReceiver } from '../LouieSDK/utils/ScreenOffReceiver';
import LouieImage from '../res/louie_img_icn_1.png';
import { handleVoiceError } from '../LouieSDK/VoiceHandler/VoiceEventProcessor';
import { eventEmitter } from '../LouieSDK/Interfaces/Callbacks';

const Form = () => {

  useEffect(() => {
    console.log("inside useEffect of form screen");
    setCurrentScreenDetails(document, "FlatList", null);
    // console.log("setCurrentScreenDetails", setCurrentScreenDetails);
    //addScreenOffReceiver(document);
    // Cleanup event listener on component unmount
    return () => {
      console.log("Cleaning up event listeners");
      //removeScreenOffReceiver();
    };
  }, []);

  const [name, setName] = useState('');
  const [date_of_birth, setDateofbirth] = useState('');
  const [gender, setGender] = useState('');
  const [marital, setMarital] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [last_name, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pin_code, setPincode] = useState('');
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
    nameRef: useRef(null),
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
    const actionListenerNew = (input, result, node) => {
      console.log("0000", input);
      handleCallbackNew(input, result, node);
    };
    eventEmitter.removeAllListeners('handlePaste');
    eventEmitter.addListener('handlePaste', actionListenerNew);
    return () => {
      eventEmitter.removeListener('handlePaste', actionListenerNew);
    };
  }, []);

  const handleCallbackNew = (action, result, field) => {
    console.log("1111", action);
    console.log("2222", typeof result);
    console.log("3333", result);
    if (field === 'name') {
      console.log("2222", "2222");
      // setSearchQuery(result);
      setName(result);
      scrollToField('name');
      createAndUpdateRootWindow(action);
    } else if (field === 'phone') {
      console.log("3333", "2222");
      // setSearchQuery(result);
      setPhone(result);
      scrollToField('phone');
      createAndUpdateRootWindow(action);
    } else if (field === 'pin_code') {
      console.log("3333", "2222");
      // setSearchQuery(result);
      setPincode(result);
      scrollToField('pin_code');
      createAndUpdateRootWindow(action);
    } else if (field === 'email') {
      console.log("3333", "2222");
      // setSearchQuery(result);
      setEmail(result);
      scrollToField('email');
      createAndUpdateRootWindow(action);
    }
    else if (field === 'date_of_birth') {
      console.log("inside setting date of birth ", field, result, action);
      // dateInputRef.current.value = result; // Update the date input field
      // dateInputRef.current.focus();
      setDateofbirth(result);
      scrollToField('dateofbirth');
      createAndUpdateRootWindow(action);
    } else if (field === 'city') {
      scrollToField('city');
    } else if (action === 'process_ask_country') {
      if (dropdowns.country.includes(result)) {
        setCountry(result);
        scrollToField('country');
        createAndUpdateRootWindow(action);
      }
      else {
        // executeErrorNextProcess(action);
        handleVoiceError();
      }
    } else if (action === 'process_ask_state') {
      if (dropdowns.state.includes(result)) {
        setState(result);
        scrollToField('state');
        createAndUpdateRootWindow(action);
      }
      else {
        // executeErrorNextProcess(action);
        handleVoiceError();
      }
    } else if (field === 'gender') {
      setGender(result);
      scrollToField('gender');
      createAndUpdateRootWindow(action);
    } else if (action === 'process_set_marital') {
      setMarital(result);
      scrollToField('marital');
      createAndUpdateRootWindow(action);
    } else if (field === 'education') {
      console.log("inside setting education", result);
      setEducation([]);
      setEducation((prevEducation) => {
        // Create a new set by merging previous education and new matchedKeys
        const updatedEducation = [...new Set([...prevEducation, ...result])];
        return updatedEducation;
      });
      console.log("inside setting education", education);
      scrollToField('education');
      createAndUpdateRootWindow(action);
    } else if (field === 'submit') {
      setName('');
      setDateofbirth('');
      setGender('');
      setMarital('');
      setCity('');
      setCountry('');
      setState('');
      setLastname('');
      setPhone('');
      setEmail('');
      setPincode('');
      setEducation([]);
    } else {
      executeErrorNextProcess(action);
    }
    console.log('handleCallbackNew function has been triggered.', "11");
  };

  const createAndUpdateRootWindow = (action) => {
    setTimeout(() => {
      updateCurrentScreen(document, action);
    }, 1000);
  }
  const handleNameChange = (e) => {
    const newFirstName = e.target.value;
    setName(newFirstName);
  };
  const handleDateOfBirthChange = (e) => {
    const newFirstName = e.target.value;
    setDateofbirth(newFirstName);
  };
  const handleGenderChange = (e) => {
    const res = e.target.value;
    setGender(res);
  };
  const handleCityChange = (e) => {
    const newFirstName = e.target.value;
    setCity(newFirstName);
    createAndUpdateRootWindow("process_ask_city");
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
          <div className='name'>
            <label className="form-label">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={handleNameChange} ref={refs[`nameRef`]} />
          </div>
          <div className='phone'>
            <label className="form-label">Phone No:</label>
            <input type="text" id="phone" name="phone" value={phone} onChange={handlePhoneChange} ref={refs[`phoneRef`]} />
          </div>
          <div className='pin-code'>
            <label className="form-label">Pin-Code:</label>
            <input type="text" id="pin_code" name="pin_code" value={pin_code} onChange={handlePinCodeChange} ref={refs[`pin_codeRef`]} />
          </div>
          <div className='email'>
            <label className="form-label">Email:</label>
            <input type="text" id="email" name="email" value={email} onChange={handleEmailChange} ref={refs[`emailRef`]} />
          </div>
          <div className='date-of-birth'>
            <label className="form-label">Date of Birth:</label>
            <div className="date-input-wrapper" ref={refs[`dateofbirthRef`]}>
              <input type="date" id="date_of_birth" name="date_of_birth" value={date_of_birth} onChange={handleDateOfBirthChange} ref={refs[`dateInputRef`]} />
              <FaCalendarAlt className="calendar-icon" onClick={handleCalendarClick} />
            </div>
          </div>
          <div className='gender' id='gender' ref={refs[`genderRef`]}>
            <label className="form-label">Gender:</label>
            <div className="radio-group">
              <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} /> Male
              <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} /> Female
              <input type="radio" id="other" name="gender" value="other" checked={gender === 'other'} onChange={handleGenderChange} /> Other
            </div>
          </div>
          <div className='city' ref={refs[`cityRef`]}>
            <label className="form-label">City:</label>
            <select id="city" name="city" value={city} onChange={handleCityChange} className="form-select">
              <option value="">Select City</option>
              {dropdowns.city.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
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