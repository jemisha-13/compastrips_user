import React, { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, Modal, Col, Row, Form, Button } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import Buttons from "../../components/Buttons";
import Select from "react-select";
import InputField from "../../components/Inputfield";
import CheckBox from "../../components/Checkbox";
import { ApiGetNoAuth, ApiPostNoAuth, ApiPost } from "../../helper/API/ApiData";
import AuthStorage from "../../helper/AuthStorage";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Dropdown, DropdownButton } from "react-bootstrap";
import STORAGEKEY from "../../config/APP/app.config";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import NumberInput from "../../components/NumberInput";

import { useDispatch } from 'react-redux'
import { changeLoginState } from '../../redux/actions/loginAction'
import PrivacyPolicy from "../../pages/Terms&Conditions/PrivacyPolicy";
import { getCookie } from "../../helper/utils";
import Terms from "../../pages/Terms&Conditions/Terms&Condition";
import moment from "moment";
interface selectOption {
    value: string;
    label: string;
}

interface countryRes {
    data: any;
    message: string;
    status: number;
}

const Header: React.FC = () => {
    const dispatch = useDispatch()

    const [termPopup, setTermPopup] = useState(false);
    const [privacyPolicy, setPrivacyPolicy] = useState(false);

    const customStyles = {
        option: (provided: any, state: { isSelected: any; }) => ({
            ...provided,

            color: state.isSelected ? '#ffffff' : '#979797',
            padding: 10,
        }),

    }


    const resetForm = {
        firstName: "",
        lastName: "",
        userName: "",
        emali: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        nationality: "",
        gender: "",
        bDay: "",
        bMonth: "",
        bYear: "",
        countryCode: "",
        verificationCode: "",
        agreeTerms: false,
        tremsOfUse: false,
    };

    const resetFormError = {
        firstNameError: "",
        lastNameError: "",
        userNameError: "",
        emailError: "",
        passwordError: "",
        confirmPassError: "",
        phoneNumberError: "",
        nationalityError: "",
        genderError: "",
        bDayError: "",
        countryCodeError: "",
        verificationError: "",
        bMonthError: "",
        bYearError: "",
        agreeTerms: "",
    };

    const history = useHistory();

    //i18n
    const { t } = useTranslation();

    const [sendVCode, setSendVCode] = useState(false);

    const [signuppopup, setsignuppopup] = useState(false);
    const [welcome, setwelcome] = useState(false);
    const [userName, setUserName] = useState("");

    const [nationality, setNationality] = useState<selectOption[]>([]);
    const [countryCode, setCountryCode] = useState<selectOption[]>([]);

    const [state, setState] = useState(resetForm);
    const [formError, setFormError] = useState(resetFormError);

    const [isSubmited, setIsSubmited] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [loginpopup, setloginpopup] = useState(false);
    const [forgotpasspopup, setforgotpasspopup] = useState(false);

    const [terms, setTerms] = useState(false);
    const [termsOfUse, settermsOfUse] = useState(false);
    const [privacyAndCookis, setPrivacyAndCookis] = useState(false);

    const validateForm = () => {
        let errors = {
            firstNameError: "",
            lastNameError: "",
            userNameError: "",
            emailError: "",
            passwordError: "",
            confirmPassError: "",
            phoneNumberError: "",
            nationalityError: "",
            genderError: "",
            bDayError: "",
            countryCodeError: "",
            verificationError: "",
            bMonthError: "",
            bYearError: "",
            agreeTerms: "",
        };

        if (!state.firstName) {
            errors.firstNameError = `${t("signUp.Errors.First_Name")}`;
        }

        if (!state.lastName) {
            errors.lastNameError = `${t("signUp.Errors.Last_Name")}`;
        }

        if (!state.userName) {
            errors.userNameError = `${t("signUp.Errors.Username")}`;
        }
        const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

        if (!validEmail.test(state.emali)) {
            errors.emailError = `${t("signUp.Errors.Email")}`;
        }

        const validPassword: any = new RegExp(
            "^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})"
        );

        if (!validPassword.test(state.password)) {
            errors.passwordError = `${t("signUp.Errors.Password")}`;
        }

        if (state.password !== state.confirmPassword) {
            errors.confirmPassError = `${t("signUp.Errors.Confirm_Password")}`;
        }

        if (!state.confirmPassword) {
            errors.confirmPassError = `${t("signUp.Errors.Confirm_Password")}`;
        }

        if (!state.phoneNumber) {
            errors.phoneNumberError = `${t("signUp.Errors.Phone_Number")}`;
        }

        if (!state.nationality) {
            errors.nationalityError = `${t("signUp.Errors.Country")}`;
        }

        if (!state.gender) {
            errors.genderError = `${t("signUp.Errors.Gender")}`;
        }

        if (!state.bDay) {
            errors.bDayError = `${t("signUp.Errors.DOB")}`;
        }

        if (!state.bMonth) {
            errors.bMonthError = `${t("signUp.Errors.DOB")}`;
        }

        if (!state.bYear) {
            errors.bYearError = `${t("signUp.Errors.DOB")}`;
        }

        if (!state.countryCode) {
            errors.countryCodeError = "Select country code";
        }

        if (!isVerified || !state.verificationCode) {
            errors.verificationError = `${t("signUp.Errors.Phone_Number")}`;
        }

        if (isVerified) {
            errors.verificationError = "";
        }

        if (!terms) {
            errors.agreeTerms = `${t('signUp.Errors.TermErr')}`;
        }

        setFormError(errors);

        if (
            !errors.firstNameError &&
            !errors.lastNameError &&
            !errors.userNameError &&
            !errors.emailError &&
            !errors.passwordError &&
            !errors.confirmPassError &&
            !errors.phoneNumberError &&
            !errors.nationalityError &&
            !errors.genderError &&
            !errors.bDayError &&
            !errors.verificationError &&
            !errors.confirmPassError &&
            !errors.agreeTerms
        ) {
            return true;
        }

        return false;
    };


    //Send OTP
    const sendOTP = () => {
        setSendVCode(true);
        setShowCountDown(true);
        setStart(true);
        setOtpErr("");
        reset();
        ApiPostNoAuth("user/otp-send", {
            mobile: state.countryCode + state.phoneNumber,
        });
    };
    //----------

    //Mobile Number Verification
    const mobileVerification = () => {
        ApiPostNoAuth("user/otp-verify", {
            mobile: state.countryCode + state.phoneNumber,
            code: state.verificationCode,
        })
            .then((res) => {
                setIncorrectOTP("");
                setIsVerified(true);
                setOver(true);
                setShowCountDown(false);
            })
            .catch((error) => {
                setIncorrectOTP(error);
                // setOver(true);
            });
    };

    useEffect(() => {
        if (isVerified) {
            validateForm();
        }
    }, [isVerified])




    //-----------

    //Sign Up---------
    const SignUp = async () => {
        setIsSubmited(true);

        if (!validateForm()) {
            return;
        }

        ApiPostNoAuth("user/auth/signup", {
            first_name: state.firstName,
            last_name: state.lastName,
            user_name: state.userName,
            email: state.emali,
            password: state.password,
            gender: state.gender,
            nationality: state.nationality,
            mobile: `${state.countryCode} ${state.phoneNumber}`,
            dob: `${state.bYear}-${state.bMonth}-${state.bDay}`,
            is_verified: isVerified,
        })
            .then((res) => {
                setUserName(state.userName);
                setState(resetForm);
                setwelcome(true);
                setsignuppopup(false);
                setFormError(resetFormError);
                setIsVerified(false);
                setSendVCode(false);
            })
            .catch((error) => {
                setIsVerified(false);
                // console.error(error);
            });
    };
    //---------


    //Country Data
    const getCountryData = async () => {
        try {
            const res = (await ApiGetNoAuth("general/country")) as countryRes;
            setNationality(
                res.data.map((x: any) => {
                    return {
                        value: x.name,
                        label: x.name,
                    };
                })
            );
            setCountryCode(
                res.data.map((x: any) => {
                    return {
                        value: `${x.code.toString()}`,
                        label: `(${x.code.toString()}) ${x.name}`,
                    };
                })
            );
        } catch (error) {
            console.log(error);
        }
    };
    //---------------


    //Login-----------
    const loginCredential = {
        email: "",
        pass: "",
    };

    const login_Err = {
        emailError: "",
        emailFormatErr: "",
        passError: "",
    };

    const [statelogin, setStatelogin] = useState(loginCredential);
    const [loginErrors, setLoginErrors] = useState(login_Err);
    const [isloginSubmit, setIsLoginSubmit] = useState(false);
    const [keepMeLogin, setKeepMeLogin] = useState(false);
    const [saveEmail, setSaveEmail] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState("");
    const [invalidEmail, setInvalidEmail] = useState("");

    const loginValidation = () => {
        let login_Err = {
            emailError: "",
            emailFormatErr: "",
            passError: "",
        };

        const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");



        if (statelogin.email && !validEmail.test(statelogin.email)) {
            login_Err.emailFormatErr = `${t("logIn.Errors.InvalidEmail")}`;
        }

        if (!statelogin.email) {
            login_Err.emailError = `${t("logIn.Errors.Email")}`;
        }

        if (statelogin.pass === "") {
            login_Err.passError = `${t("logIn.Errors.Password")}`;
        }

        setLoginErrors(login_Err);
        setIncorrectPass("");

        if (!loginErrors.emailError && !loginErrors.passError && !loginErrors.emailFormatErr) {
            return true;
        }

        return false;
    };

    const Login = () => {
        setIsLoginSubmit(true);

        if (!loginValidation()) {
            return;
        }

        ApiPost("user/auth/login", {
            email: statelogin.email,
            password: statelogin.pass,
        })
            .then((res: any) => {
                setStatelogin(loginCredential);

                if (saveEmail) {
                    AuthStorage.setStorageData(STORAGEKEY.email, statelogin.email, true);
                } else {
                    AuthStorage.deleteKey(STORAGEKEY.email)
                }

                AuthStorage.setStorageData(
                    STORAGEKEY.token,
                    res.data.token,
                    keepMeLogin
                );
                delete res.data.token;
                AuthStorage.setStorageJsonData(
                    STORAGEKEY.userData,
                    res.data,
                    keepMeLogin
                );
                dispatch(changeLoginState(true))
                history.push("/");
            })
            .catch((error) => {
                console.log("err", typeof error);
                if (error === "Wrong Email") {
                    setIncorrectPass("")
                    setInvalidEmail(`${t('logIn.Errors.InvalidEmail')}`);
                }

                if (error === "Wrong Password") {
                    setInvalidEmail("")
                    setIncorrectPass(`${t("logIn.Errors.IncorrectPass")}`);
                }
            });
    };
    //---------------

    //Reset Password ---------
    const [resetpassError, setResetpassError] = useState("");
    const [resetPassEmail, setResetPassEmail] = useState("");
    const [isResetPassSubmited, setIsResetPassSubmited] = useState(false);
    const [noUserFound, setNoUserFound] = useState("");
    const [successMsg, setSuccessMsg] = useState(false);

    const resetPassValidation = () => {
        let resetpassError = "";

        if (resetPassEmail === "") {
            resetpassError = `${t("Reset_Password.Errors.Email")}`;
        }
        setResetpassError(resetpassError);
        setNoUserFound("");

        if (!resetpassError) {
            return true;
        }
        return false;
    };

    const ResetPassword = () => {
        setIsResetPassSubmited(true);
        if (!resetPassValidation()) {
            return;
        }

        ApiPostNoAuth("user/sendForgotlink", {
            email: resetPassEmail,
        })
            .then((res: any) => {
                setSuccessMsg(true);
            })
            .catch((error) => {
                setNoUserFound(`${t("Reset_Password.Errors.User_Not_Found")}`);
            });
    };
    //---------------

    const showsignupmodalbtn = () => {

        setsignuppopup(true);
        setloginpopup(false);
    };

    const loginbtn = () => {
        setFormError(resetFormError);
        setsignuppopup(false);
        setloginpopup(true);
        setwelcome(false);
    };

    const forgotpassmodal = () => {
        setloginpopup(false);
        setforgotpasspopup(true);
    };

    const genderoptions = [
        { value: "MALE", label: t("signUp.Placeholder.Male") },
        { value: "FEMALE", label: t("signUp.Placeholder.Female") },
    ];


    // Calander Dropdown
    const months = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
    ];

    //For year list
    const [years, setYears] = useState([{}])
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        let years = [];
        for (let i = currentYear; i >= (currentYear - 100); i--) {
            years.push({ value: i.toString(), label: i.toString() })
        }
        setYears(years)
    }

    //For date list
    const [days, setDays] = useState<selectOption[]>([])
    const getDays = () => {

        let lastDate = new Date(+state.bYear, +state.bMonth, 0).getDate();

        let monthsDeys = []
        for (let i = 1; i <= lastDate; i++) {
            monthsDeys.push({ value: i.toString(), label: i.toString() })
        }
        setDays(monthsDeys);
    }

    useEffect(() => {
        setDays([])
        setState({
            ...state,
            bDay: "",
        })

        if (!state.bMonth || !state.bYear) {
            return
        }

        getDays();
    }, [state.bMonth, state.bYear])
    //------------------


    useEffect(() => {
        //Sign Up
        if (isSubmited) {
            validateForm();
        }

        //Reset Password
        if (isResetPassSubmited) {
            resetPassValidation();
        }

    }, [state, resetPassEmail, terms]);


    //Login
    useEffect(() => {
        if (isloginSubmit) {
            loginValidation();
        }
    }, [statelogin])



    //For Language  DropDown Title Changing
    const [selectedLang, setSelectedLang] = useState("한국어(KR)");



    useEffect(() => {
        // let currentPath = location.pathname + location.search;
        // history.replace(currentPath)
        // window.location.href = currentPath
    }, [selectedLang])


    const [temp, setTemp] = useState(false);

    useEffect(() => {
        // let val = "ko";
        let getLangLocal = localStorage.getItem("i18nextLng");
        let getLangCookie = getCookie('i18next');
        let getLangTag = document.documentElement.lang;


        if (getLangLocal === "en" || getLangCookie === "en" || getLangTag === "en") {
            // setSelectedLang("English(EN)")
            changeLanguage("en", "English(EN)")
        }
        else {
            // setSelectedLang("한국어(KR)")
            changeLanguage("ko", "한국어(KR)")
        }
    }, [])

    const changeLanguage = (lang: string, name: string) => {
        setSelectedLang(name)
        i18next.changeLanguage(lang)
        if (temp) {
            let currentPath = location.pathname + location.search;
            window.location.href = currentPath;
        }
        setTemp(true)
    }
    //------------

    const location = useLocation();

    useEffect(() => {
        const header: any = document.getElementById("myHeader");
        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky && location.pathname === '/') {
                header.classList.add("sticky");

            } else {
                header.classList.remove("sticky");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, [location])

    //Hero Section
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    //Count Down Timer
    const [start, setStart] = useState(false);
    const [otpErr, setOtpErr] = useState("");
    const [incorrectOTP, setIncorrectOTP] = useState("");
    const [showCountDown, setShowCountDown] = useState(false)

    const [over, setOver] = useState(false);
    const [[m, s], setTime] = useState([parseInt("3"), parseInt("0")]);

    const tick = () => {
        if (over) return;
        if (m === 0 && s === 0) {
            setOver(true);
            setOtpErr(`${t('signUp.Errors.Time_excede')}`);
        } else if (s === 0) {
            setTime([m - 1, 59]);
        } else {
            setTime([m, s - 1]);
        }
    };

    const reset = () => {
        setTime([parseInt("3"), parseInt("0")]);
        setOver(false);
    };

    useEffect(() => {
        if (start) {
            const timerID = setInterval(() => tick(), 1000);
            return () => clearInterval(timerID);
        }
    });
    //------------


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });

        setStatelogin({
            ...statelogin,
            [e.target.name]: e.target.value,
        });
    };


    useEffect(() => {
        getCountryData();
        getYears();
        setLocalEmail();

    }, []);


    //For Save Email Functionality in Login Part
    const setLocalEmail = () => {
        const email = AuthStorage.getStorageData(STORAGEKEY.email);
        if (email) {
            setStatelogin({
                ...statelogin,
                email: email
            })
        }
    }

    //For Terms and Condition
    const changeTerm = (type: string) => {
        if (type === 'terms') {
            if (terms === false) {
                setTerms(true)
                settermsOfUse(true);
                setPrivacyAndCookis(true);
            } else {
                setTerms(false)
                settermsOfUse(false);
                setPrivacyAndCookis(false);
            }
        }
        if (type === 'termsOfUse') {
            if (termsOfUse === false) {
                settermsOfUse(true)
            } else {
                settermsOfUse(false)
                setTerms(false)
            }
        }
        if (type === 'privacyAndCookis') {
            if (privacyAndCookis === false) {
                setPrivacyAndCookis(true)
            } else {
                setPrivacyAndCookis(false)
                setTerms(false)
            }
        }
    }

    useEffect(() => {
        if (termsOfUse === true && privacyAndCookis === true) {
            setTerms(true)
        }
    }, [termsOfUse])

    useEffect(() => {
        if (termsOfUse === true && privacyAndCookis === true) {
            setTerms(true)
        }
    }, [privacyAndCookis])


    const onDatePickerClick = (id: string) => {
        document.getElementById(id)?.click();
    }


    //Homepage search filter
    const [searchTerm, setSearchTerm] = useState<string>("");
    const Search = () => {
        let searchParam =
            "?keyword=" +
            searchTerm +
            "&startDate=" +
            moment(startDate).format("YYYY-MM-DD") +
            "&endDate=" +
            moment(endDate).format("YYYY-MM-DD");
        history.push({
            pathname: "/",
            search: searchParam,
        });
    };


    return (
        <>
            <div className="container-fluid">
                <div>
                    <Navbar
                        collapseOnSelect
                        expand="lg"
                        className={location.pathname === "/" ? "header align-items-start" : "white-header align-items-start"}
                    >
                        <Container fluid className="align-items-start">
                            <Navbar.Brand className="homepagelogo">
                                <Link
                                    to="/"
                                    className={location.pathname === "/" ? "d-block" : "d-none"}
                                >
                                    <Image src="./img/logo.png" alt="" />
                                </Link>
                            </Navbar.Brand>
                            <Navbar.Brand className="mainlogo">
                                <Link
                                    to="/"
                                    className={location.pathname === "/" ? "d-none" : "d-block"}
                                >
                                    <Image src="./img/Group.png" alt="" />
                                </Link>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav ">
                                <Nav className="ml-auto menu-link align-items-start">
                                    <Buttons
                                        onClick={() => {
                                            return setloginpopup(true);
                                        }}
                                        children={t("logIn.Log_In")}
                                        ButtonStyle={
                                            location.pathname === "/"
                                                ? "log-white-button"
                                                : "log-trans-button"
                                        }
                                    />
                                    <DropdownButton
                                        title={
                                            <div>
                                                {location.pathname === "/"
                                                    ? <img className="mr-2" src="./img/Education.png" alt="" />
                                                    : <img className="mr-2" src="./img/Education-blue.png" alt="" />}

                                                {selectedLang}
                                                <img className="downarrow" src="./img/downarrowhite.svg" alt="" />
                                            </div>}
                                        onSelect={function (evt) {
                                            i18next.changeLanguage();
                                        }}
                                        className={
                                            location.pathname === "/"
                                                ? "select-btn "
                                                : "select-btn select-btn-two "
                                        }

                                    >
                                        <Dropdown.Item>
                                            <Button onClick={() => { changeLanguage("en", "English(EN)") }} >English(EN)  </Button>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <Button onClick={() => { changeLanguage('ko', "한국어(KR)") }}>한국어(KR)  </Button>
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </div>

                {/* <Hero/> */}
                <div
                    className={location.pathname === "/forgotpass" ? "d-none" : "d-block"}
                >
                    <section className={location.pathname === "/" ? "bg-hero" : ""}>
                        <Container>
                            <Row className="justify-content-center custom-flex-margin noauthheader">
                                <div

                                    className={location.pathname === "/" ? "hero-content" : "custom-fixed"}
                                >
                                    <h1 className="text-white text-center">
                                        <span className="h-88">  {t("Homepage.Hero.Title1")} </span>
                                        <div className="mt-10"></div>
                                        <span className="h-88"> {t("Homepage.Hero.Title2")}</span>

                                    </h1>
                                    <div
                                        id="myHeader"
                                        className={
                                            location.pathname === "/"
                                                ? "input-search row align-items-center"
                                                : "hero-search-bar row align-items-center"
                                        }
                                    >
                                        <div className="hero-search search-tab">
                                            <input
                                                type="search"
                                                className="custom-search"
                                                placeholder={t("Homepage.Hero.Search_Placeholder")}
                                                onChange={(e: any) => { setSearchTerm(e.target.value) }}
                                            />
                                            <div className="hero-serach-icon">
                                                <img src="./img/Vector.png" alt="" />
                                            </div>
                                        </div>

                                        <div className="hero-search2  custom-datapicker d-flex hero-date1">
                                            <div className="d-flex">
                                                <div className="mx-20 color-gray">
                                                    <p className="mb-0 calender-info">
                                                        {t("Homepage.Hero.From")}
                                                    </p>
                                                </div>
                                                <div className="">
                                                    {" "}
                                                    <img src="./img/calendar.png" onClick={() => { onDatePickerClick("startDate") }} alt="" />{" "}
                                                </div>
                                            </div>
                                            <div>
                                                <DatePicker
                                                    id="startDate"
                                                    selected={startDate}
                                                    onChange={(date: Date | null) => setStartDate(date)}
                                                    dateFormat="EEE MM/dd"
                                                >

                                                </DatePicker>
                                            </div>
                                        </div>

                                        <div className="hero-search3 custom-datapicker d-flex">
                                            <div className="d-flex">
                                                <div className="mx-20 color-gray">
                                                    <p className="mb-0 calender-info">
                                                        {t("Homepage.Hero.Until")}
                                                    </p>
                                                </div>
                                                <div className="">
                                                    {" "}
                                                    <img src="./img/calendar.png" onClick={() => { onDatePickerClick("endDate") }} alt="" />{" "}
                                                </div>
                                            </div>
                                            <div>
                                                <DatePicker
                                                    id="endDate"
                                                    selected={endDate}
                                                    onChange={(date: Date | null) => setEndDate(date)}
                                                    dateFormat="EEE MM/dd"
                                                />
                                            </div>
                                        </div>

                                        <div className="">
                                            <Buttons
                                                ButtonStyle="btn-customs"
                                                onClick={() => Search()}
                                            >
                                                <FontAwesomeIcon icon={faSearch} className="mr-1" />{" "}
                                                <span className="font-16-bold">{t("Homepage.Hero.Find_Tours")}</span>
                                            </Buttons>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                        </Container>
                        <Container
                            className={
                                location.pathname === "/" ? "form-hero-button" : "d-none"
                            }
                        >
                            <Row className="custom-flex-margin">
                                <Col md={12} className="text-center justify-content-center my-button-hero">
                                    <Buttons
                                        ButtonStyle="btn-customs-transparent h-64-trans w-240"
                                        onClick={() => { }}
                                    >
                                        <img src="./img/UserIcon.svg" alt="" />
                                        <span>{t("Homepage.Hero.View_Hosts")}</span>
                                    </Buttons>

                                    <Buttons
                                        ButtonStyle="btn-customs-transparent   h-64-trans w-240"
                                        onClick={() => { }}
                                    >
                                        <img src="./img/HomeCalender.svg" alt="" />
                                        <span>{t("Homepage.Hero.Host_MyOwn")}</span>
                                    </Buttons>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </div>
            </div>
            <Modal
                show={signuppopup}
                onHide={() => {
                    setsignuppopup(false);
                    setState(resetForm);
                    setTerms(false);
                    settermsOfUse(false);
                    setPrivacyAndCookis(false);
                    setIsSubmited(false)
                    setFormError(resetFormError);
                    setIncorrectOTP("");
                    setOtpErr("")
                    setShowCountDown(false);
                    setIsVerified(false)
                    setSendVCode(false);
                    reset()
                }}

                dialogClassName="signmodal"
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header className="p-0" closeButton></Modal.Header>
                <Modal.Body className="mt-0 p-0">

                    <Col lg={12} className="modal-signup p-0">
                        <div className="modal-signup-title">
                            <Form>
                                <h3 className="">{t("signUp.Sign_Up")}</h3>
                                <div className="d-flex">
                                    <div>
                                        <InputField
                                            label={t("signUp.Name")}
                                            fromrowStyleclass=""
                                            name="firstName"
                                            value={state.firstName}
                                            placeholder={t("signUp.Placeholder.First_Name")}
                                            type="text"
                                            InputstyleClass={
                                                formError.firstNameError
                                                    ? "custom-input firstName w-210-one danger-border mt-20"
                                                    : "custom-input firstName w-210-one mt-20"
                                            }
                                            lablestyleClass="color-black font-20-bold h-24"
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                        />
                                        {isSubmited && formError.firstNameError && (
                                            <p className="font-16-normal error-color">
                                                {formError.firstNameError}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <InputField
                                            label=""
                                            fromrowStyleclass=""
                                            name="lastName"
                                            value={state.lastName}
                                            placeholder={t("signUp.Placeholder.Last_Name")}
                                            type="text"
                                            InputstyleClass={
                                                formError.lastNameError
                                                    ? "custom-input firstName w-210 mt-45 danger-border"
                                                    : "custom-input firstName w-210 mt-45"
                                            }
                                            lablestyleClass="color-black font-20-bold "
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                        />
                                        {isSubmited && formError.lastNameError && (
                                            <p className="font-16-normal error-color">{formError.lastNameError}</p>
                                        )}
                                    </div>
                                </div>

                                <Row>
                                    <Col>
                                        <InputField
                                            label={t("signUp.Username")}
                                            fromrowStyleclass=""
                                            name="userName"
                                            maxLength={10}
                                            value={state.userName}
                                            placeholder={t("signUp.Placeholder.Username")}
                                            type="text"
                                            InputstyleClass={
                                                formError.userNameError
                                                    ? "custom-input danger-border mt-20"
                                                    : "custom-input mt-20"
                                            }
                                            lablestyleClass="color-black font-20-bold h-24 mt-40"
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                        />
                                        {isSubmited && formError.userNameError && (
                                            <p className="font-16-normal error-color">{formError.userNameError}</p>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <InputField
                                            label={t("signUp.Email")}
                                            fromrowStyleclass=""
                                            name="emali"
                                            value={state.emali}
                                            placeholder={t("signUp.Placeholder.Email")}
                                            type="email"
                                            InputstyleClass={
                                                formError.emailError
                                                    ? "custom-input  danger-border mt-16"
                                                    : "custom-input mt-16"
                                            }
                                            lablestyleClass="color-black font-20-bold h-24 mt-40"
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                        />
                                        {isSubmited && formError.emailError && (
                                            <p className="font-16-normal error-color">{formError.emailError}</p>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <InputField
                                            label={t("signUp.Password")}
                                            fromrowStyleclass=""
                                            name="password"
                                            value={state.password}
                                            placeholder={t("signUp.Placeholder.Password")}
                                            type="password"
                                            InputstyleClass={
                                                formError.passwordError
                                                    ? "custom-input  danger-border mt-16"
                                                    : "custom-input mt-16"
                                            }
                                            lablestyleClass="color-black font-20-bold h-24 mt-40"
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                        />
                                        {isSubmited && formError.passwordError && (
                                            <p className="font-18-normal error-color">{formError.passwordError}</p>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <InputField
                                            label={t("signUp.Confirm_Password")}
                                            fromrowStyleclass=""
                                            name="confirmPassword"
                                            value={state.confirmPassword}
                                            placeholder={t("signUp.Placeholder.Confirm_Password")}
                                            type="password"
                                            InputstyleClass={
                                                formError.confirmPassError
                                                    ? "custom-input  danger-border mt-16"
                                                    : "custom-input mt-16"
                                            }
                                            lablestyleClass="color-black font-20-bold h-24 mt-40"
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                        />
                                        {isSubmited && formError.confirmPassError && (
                                            <p className="font-18-normal error-color">
                                                {formError.confirmPassError}
                                            </p>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="">
                                        <label className="color-black font-20-bold h-24 mt-30">
                                            {t("signUp.Country")}
                                        </label>
                                        <Select
                                            className={
                                                formError.nationalityError
                                                    ? "css-e56m7-control danger-border mt-15"
                                                    : "css-e56m7-control mt-15"
                                            }
                                            options={nationality}
                                            name="nationality"
                                            placeholder={t("signUp.Placeholder.Country")}
                                            onChange={(e: any) =>
                                                setState({
                                                    ...state,
                                                    nationality: e.value,
                                                })
                                            }
                                            styles={customStyles}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#d9eff9",
                                                    primary: "#42B6E6 ",
                                                    fontsize: "15px",
                                                },
                                            })}
                                        />
                                        {isSubmited && formError.nationalityError && (
                                            <p className="font-18-normal error-color">
                                                {formError.nationalityError}
                                            </p>
                                        )}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className="">
                                        <label className="color-black font-20-bold h-24 mt-32">
                                            {t("signUp.Gender")}
                                        </label>
                                        <Select
                                            className={
                                                formError.genderError
                                                    ? "css-e56m7-control danger-border mt-18"
                                                    : "css-e56m7-control mt-18"
                                            }
                                            options={genderoptions}
                                            label=""
                                            select={state.gender}
                                            name="gender"
                                            placeholder={t("signUp.Placeholder.Gender")}
                                            onChange={(e: any) =>
                                                setState({
                                                    ...state,
                                                    gender: e.value,
                                                })
                                            }
                                            styles={customStyles}
                                            theme={(theme) => ({
                                                ...theme,
                                                borderRadius: 0,
                                                colors: {
                                                    ...theme.colors,
                                                    primary25: "#d9eff9",
                                                    primary: "#42B6E6 ",
                                                    fontsize: "15px",
                                                },
                                            })}
                                        />
                                        {isSubmited && formError.genderError && (
                                            <p className="font-18-normal error-color">{formError.genderError}</p>
                                        )}
                                    </Col>
                                </Row>

                                <Row className="">
                                    <Col md={12}>
                                        {" "}
                                        <label className="color-black font-20-bold h-24 mt-37">
                                            {t("signUp.DOB")}
                                        </label>
                                    </Col>
                                    <div className="d-flex mx-auto">
                                        <div className="w-140px">
                                            <Select
                                                className={
                                                    formError.bDayError
                                                        ? "css-e56m7-control danger-border mt-31"
                                                        : "css-e56m7-control mt-31"
                                                }
                                                styles={customStyles}
                                                select={state.bYear}
                                                isSearchable={false}
                                                name="bYear"
                                                options={years}
                                                label=""
                                                placeholder={"YYYY"}
                                                onChange={(e: any) =>
                                                    setState({
                                                        ...state,
                                                        bYear: e.value,
                                                    })
                                                }
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#d9eff9",
                                                        primary: "#42B6E6 ",
                                                        fontsize: "15px",
                                                    },
                                                })}
                                            />
                                        </div>
                                        <div className="mt-md-0 w-140px mx-10">
                                            <Select
                                                className={
                                                    formError.bMonthError
                                                        ? "css-e56m7-control danger-border mt-31"
                                                        : "css-e56m7-control mt-31"
                                                }
                                                styles={customStyles}
                                                select={state.bMonth}
                                                isSearchable={false}
                                                name="bMonth"
                                                options={months}
                                                label=""
                                                placeholder={"MM"}
                                                onChange={(e: any) => {
                                                    setState({
                                                        ...state,
                                                        bMonth: e.value
                                                    })
                                                }
                                                }
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#d9eff9",
                                                        primary: "#42B6E6 ",
                                                        fontsize: "15px",
                                                    },
                                                })}
                                            />
                                        </div>
                                        <div className="mt-md-0 w-140px">
                                            <Select
                                                className={
                                                    formError.bYearError
                                                        ? state.bDay ? "css-e56m7-control danger-border mt-31" : "css-e56m7-control danger-border mt-31 day-select"
                                                        : state.bDay ? "css-e56m7-control mt-31" : "css-e56m7-control mt-31 day-select"
                                                }
                                                styles={customStyles}
                                                select={state.bDay}
                                                value={{ value: state.bDay, label: state.bDay }}
                                                isSearchable={false}
                                                name="bDay"
                                                options={days}
                                                label=""
                                                placeholder="DD"
                                                onChange={(e: any) =>
                                                    setState({
                                                        ...state,
                                                        bDay: e.value,
                                                    })
                                                }
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#d9eff9",
                                                        primary: "#42B6E6 ",
                                                        fontsize: "15px",
                                                    },
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <Col>
                                        {isSubmited &&
                                            (formError.bDayError ||
                                                formError.bMonthError ||
                                                formError.bYearError) ? (
                                            <p className="font-18-normal error-color">{t("signUp.Errors.DOB")}</p>
                                        ) : null}
                                    </Col>
                                </Row>

                                <div className="">
                                    <div>
                                        {" "}
                                        <label className="color-black font-20-bold h-24 mt-37">
                                            {t("signUp.Phone_Number")}
                                        </label>
                                    </div>
                                    <div className="d-flex">
                                        <div className="w-250 country-code-drop">
                                            <Select
                                                className={
                                                    formError.countryCodeError
                                                        ? "css-e56m7-control danger-border mt-22"
                                                        : "css-e56m7-control mt-22"
                                                }
                                                isDisabled={isVerified}
                                                styles={customStyles}
                                                options={countryCode}
                                                name="countryCode"
                                                label=""
                                                placeholder={t("signUp.Placeholder.Select")}
                                                onChange={(e: any) =>
                                                    setState({
                                                        ...state,
                                                        countryCode: e.value,
                                                    })
                                                }
                                                theme={(theme) => ({
                                                    ...theme,
                                                    borderRadius: 0,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: "#d9eff9",
                                                        primary: "#42B6E6 ",
                                                        fontsize: "15px",
                                                    },
                                                })}
                                            />
                                        </div>
                                        <div className="ml-9 w-350 position-relative">
                                            <NumberInput
                                                name="phoneNumber"
                                                value={state.phoneNumber}
                                                disabled={isVerified}
                                                placeholder={
                                                    t("signUp.Placeholder.Phone_Number")
                                                }
                                                InputstyleClass={
                                                    formError.phoneNumberError
                                                        ? "number-input mt-22 danger-border"
                                                        : "number-input mt-22   "
                                                }
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                }}
                                                maxLength={10}
                                            />
                                            <Buttons
                                                ButtonStyle={
                                                    state.phoneNumber ? "vocdebtncsss " : "vcodebtnDisable "
                                                }
                                                disabled={state.phoneNumber.length < 9 || isVerified || !state.countryCode}
                                                onClick={() => {
                                                    sendOTP();
                                                }}
                                            >
                                                {sendVCode
                                                    ? `${t('signUp.Resend')}`
                                                    : `${t("signUp.Send_Verification_Code")}`}
                                            </Buttons>
                                        </div>
                                    </div>
                                    <div className="mt-9 position-relative">
                                        <NumberInput
                                            name="verificationCode"
                                            value={state.verificationCode}
                                            placeholder={t("signUp.Placeholder.Verification_Code")}
                                            InputstyleClass={
                                                formError.verificationError
                                                    ? "number-input mb-0 danger-border"
                                                    : "number-input mb-0"
                                            }
                                            onChange={(e: any) => {
                                                handleChange(e);
                                            }}
                                            maxLength={6}
                                        />
                                        <div className="otp-countdown">
                                            {showCountDown && <p>{`${m.toString().padStart(1, "0")}:${s.toString().padStart(2, "0")}`}</p>}
                                            <div className="countdown-err">
                                                {over ? otpErr : ""}
                                            </div>
                                        </div>
                                        {state.verificationCode && sendVCode && !over && (
                                            <Buttons
                                                ButtonStyle="vocdebtncsss vocdebtncssstwo"
                                                onClick={mobileVerification}

                                            >
                                                {t("signUp.Verify")}
                                            </Buttons>
                                        )}
                                        {isSubmited && !incorrectOTP && formError.verificationError && (
                                            <p className="font-18-normal error-color">
                                                {formError.verificationError}
                                            </p>
                                        )}
                                        {incorrectOTP && (
                                            <p className="font-18-normal error-color">{incorrectOTP}</p>
                                        )}
                                    </div>
                                </div>

                                <Row className="border-check">
                                    <Col>
                                        <Form.Group>
                                            <div className="checkboxes checkbox-add_top_15 mt-50 mb-10">
                                                <CheckBox
                                                    label={t("signUp.Terms.Agree")}
                                                    type="checkbox"
                                                    name="agree"
                                                    id="agree"
                                                    value=""
                                                    styleCheck="checkmark"
                                                    onChange={(e: any) => { changeTerm('terms') }}
                                                    checked={terms}
                                                />
                                            </div>
                                        </Form.Group>

                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group >
                                            <div className="checkboxes checkbox-add_top_15 mt-10 d-flex align-items-center">
                                                <CheckBox
                                                    label={t("signUp.Terms.Term_of_use")}
                                                    type="checkbox"
                                                    name="agreeTerms"
                                                    id="agreeTerms"
                                                    value=""
                                                    styleCheck="checkmark"
                                                    onChange={(e: any) => { changeTerm('termsOfUse') }}
                                                    checked={termsOfUse}
                                                />
                                                <div className=" more-tab h-22 cursor-p ml-auto"> <label onClick={() => setTermPopup(true)} className="font-15-bold blue-font pointer"> {t("signUp.Placeholder.More")} </label> </div>
                                            </div>

                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <div className="checkboxes checkbox-add_top_15 mt-12 d-flex align-items-top">
                                                <CheckBox
                                                    label={t("signUp.Terms.Privacy_and_Cookie")}
                                                    type="checkbox"
                                                    name="tremsOfUse"
                                                    id="tremsOfUse"
                                                    value=""
                                                    styleCheck="checkmark"
                                                    onChange={(e: any) => { changeTerm('privacyAndCookis') }}
                                                    checked={privacyAndCookis}
                                                />
                                                <div className=" more-tab h-22 mt-8 cursor-p ml-auto"> <label onClick={() => setPrivacyPolicy(true)} className="font-15-bold blue-font pointer"> {t("signUp.Placeholder.More")} </label> </div>
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {isSubmited && formError.agreeTerms && (
                                    <p className="font-16-normal error-color">{formError.agreeTerms}</p>
                                )}
                                <Row className="mt-22 justify-content-center">
                                    <Col>
                                        <Buttons
                                            ButtonStyle="btn-customs font-20-bold h-56 w-440px p-0"
                                            onClick={() => {
                                                SignUp();

                                            }}
                                        >
                                            {t("signUp.Sign_Up")}
                                        </Buttons>
                                    </Col>
                                </Row>
                                <Row className="mt-40">
                                    <Col>
                                        <p className="already-account font-18-bold color-black">
                                            {t("signUp.Placeholder.Already_have_account")}
                                            <span>
                                                <Buttons
                                                    ButtonStyle="trans-btn font-18-bold ml-1  color-blue "
                                                    onClick={() => {
                                                        loginbtn();
                                                    }}
                                                >
                                                    {t("logIn.Log_In")}
                                                </Buttons>
                                            </span>
                                        </p>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>

                </Modal.Body>
            </Modal>

            <Modal
                show={welcome}
                onHide={() => {
                    setwelcome(false);
                }}
                dialogClassName="welcome-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="p-0" closeButton></Modal.Header>
                <Modal.Body className="p-0 mt-25">
                    <div className="modal-signup-title text-center">
                        <h3>{t("Welcome.Welcome")}</h3>
                    </div>
                    <div className="wecomes-body mt-40">
                        <h5 className="font-24-normal text-center">
                            {t("Welcome.Hi")} {userName},
                        </h5>
                        <p className="mt-30">{t("Welcome.Success")}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="p-0 mt-50">
                    <Buttons
                        ButtonStyle="w-100 welcom-btn"
                        onClick={() => {
                            setwelcome(false);
                            setloginpopup(true);
                        }}
                    >
                        {t("logIn.Log_In")}
                    </Buttons>
                </Modal.Footer>
            </Modal>

            <Modal
                show={loginpopup}
                onHide={() => {
                    setIsLoginSubmit(false);
                    setLoginErrors(login_Err);
                    setStatelogin(loginCredential);
                    setloginpopup(false);
                    setIncorrectPass("");
                    setInvalidEmail("");
                }}
                dialogClassName="logmodal "
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="p-0" closeButton></Modal.Header>
                <Modal.Body className=" py-0">
                    <div className="modal-signup-title ">
                        <h3 >{t("logIn.Log_In")}</h3>
                    </div>
                    <Row>
                        <Col md={12} className="p-0 mt-32">
                            <InputField
                                label={t("logIn.Email")}
                                fromrowStyleclass=""
                                name="email"
                                value={statelogin.email}
                                placeholder={t("logIn.Placeholder.Email")}
                                type="text"
                                InputstyleClass={
                                    loginErrors.emailError
                                        ? "custom-input mt-16 danger-border"
                                        : "custom-input mt-16"
                                }
                                lablestyleClass="color-black font-20-bold"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {loginErrors.emailError && (
                                <p className="font-16-normal error-color">{loginErrors.emailError}</p>
                            )}
                            {loginErrors.emailFormatErr && (
                                <p className="font-16-normal error-color">{loginErrors.emailFormatErr}</p>
                            )}
                            {!loginErrors.emailError && !loginErrors.emailFormatErr && invalidEmail && (
                                <p className="font-16-normal error-color">{invalidEmail}</p>
                            )}
                        </Col>

                        <Col md={12} className="p-0 mt-32">
                            <InputField
                                label={t("logIn.Password")}
                                fromrowStyleclass=""
                                name="pass"
                                value={statelogin.pass}
                                placeholder={t("logIn.Placeholder.Password")}
                                type="password"
                                InputstyleClass={
                                    loginErrors.passError
                                        ? " logpass mt-16 danger-border"
                                        : " logpass mt-16"
                                }
                                lablestyleClass="color-black font-20-bold"
                                onChange={(e: any) => {
                                    handleChange(e);
                                }}
                            />
                            {loginErrors.passError && (
                                <p className="font-16-normal error-color">{loginErrors.passError}</p>
                            )}
                            {!loginErrors.passError && incorrectPass && <p className="font-16-normal error-color">{incorrectPass}</p>}
                        </Col>



                        <Col md={6} className="login-form-modal p-0 mt-16 font-18-bold color-black">
                            <CheckBox
                                label={t("logIn.Keep_me_signin")}
                                type="checkbox"
                                name="agree"
                                id="agree"
                                value="agree"
                                styleCheck="checkmark mar-right"
                                onChange={(e: any) => {
                                    setKeepMeLogin(true);
                                }}
                            />
                        </Col>

                        <Col md={6} className="login-form-modal p-0 mt-16 font-18-bold color-black">
                            <CheckBox
                                label={t("logIn.Save_email_add")}
                                type="checkbox"
                                name="agree"
                                id="agree"
                                value="agree"
                                styleCheck="checkmark mar-right"
                                onChange={(e: any) => {
                                    setSaveEmail(true);
                                }}
                            />
                        </Col>

                        <Col md={12} className="text-center  mt-37">
                            <Buttons
                                ButtonStyle="trans-btn h-20 color-blue font-18-bold "
                                onClick={() => {
                                    forgotpassmodal();
                                }}
                            >
                                {t("logIn.Forgot_Password")}
                            </Buttons>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="p-0 justify-content-center">
                    <Buttons ButtonStyle="btn-customs font-20-bold mx-0 w-440px log-button-h-55 mt-40" onClick={Login}>
                        {t("logIn.Log_In")}
                    </Buttons>
                </Modal.Footer>
                <Row className="">
                    <Col>
                        <p className="already-account h-20 font-18-bold color-black mt-23">
                            {t("logIn.Dont_have_acc")}
                            <span>
                                <Buttons
                                    ButtonStyle="trans-btn font-18-bold ml-1 color-blue"
                                    onClick={() => {
                                        showsignupmodalbtn();
                                    }}
                                // onClick={() => {
                                //     setwelcome(true);
                                // }}
                                >
                                    {t("signUp.Sign_Up")}
                                </Buttons>
                            </span>
                        </p>
                    </Col>
                </Row>
            </Modal>

            {/* Reset Password Model */}
            <Modal
                show={forgotpasspopup}
                onHide={() => {
                    setSuccessMsg(false);
                    setIsResetPassSubmited(false);
                    setResetpassError("");
                    setforgotpasspopup(false);
                    setResetPassEmail("");
                }}
                aria-labelledby="contained-modal-title-vcenter"
                dialogClassName="forgotmodal "
                centered
            >
                <Modal.Header className="p-0" closeButton></Modal.Header>
                <Modal.Body className="p-0">
                    <div className="modal-signup-title">
                        <h3>{t("Reset_Password.Reset_Password")}</h3>
                    </div>

                    <div className="reset-pass-content">
                        <p className="font-20-normal">{t("Reset_Password.Enter_registered_email")}</p>
                    </div>
                    <Row>
                        <Col md={12}>
                            <InputField
                                label={t("Reset_Password.Email")}
                                fromrowStyleclass=""
                                name="forgotemail"
                                value={resetPassEmail}
                                placeholder={t("Reset_Password.Placeholder.Email")}
                                type="text"
                                InputstyleClass="custom-input mt-20"
                                lablestyleClass="color-black font-20-bold h-24"
                                onChange={(e: any) => {
                                    setResetPassEmail(e.target.value);
                                }}
                            />
                            {resetpassError && (
                                <p className="font-16-normal error-color">{resetpassError}</p>
                            )}
                            {noUserFound && <p className="font-16-normal error-color">{noUserFound}</p>}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="p-0 mt-50">
                    <Buttons ButtonStyle="gray-btn m-0 w-100 p-0  h-56 font-20-bold" onClick={ResetPassword}>
                        {t("Reset_Password.Send_reset_link")}{" "}
                    </Buttons>

                    {successMsg &&
                        <label className="reset-pass-success h-56 p-0 mt-31 w-100 font-20-bold color-black">
                            {t("Reset_Password.Password_reset_email_sent")}{" "}
                        </label>
                    }
                </Modal.Footer>
            </Modal>


            <Terms set={setTermPopup} value={termPopup} />
            <PrivacyPolicy set={setPrivacyPolicy} value={privacyPolicy} />
        </>
    );
};

export default Header;

