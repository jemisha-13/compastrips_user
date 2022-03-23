import React, { useEffect, useState } from 'react'
import { Button, Form, Modal, Nav } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useTranslation } from 'react-i18next'
import { RootStateOrAny, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import Select from 'react-select'
import Swal from 'sweetalert2'
import Buttons from '../../components/Buttons'
import CheckBox from '../../components/Checkbox'
import InputField from '../../components/Inputfield'
import NumberInput from '../../components/NumberInput'
import STORAGEKEY from '../../config/APP/app.config'
import { ApiGetNoAuth, ApiPatch, ApiPost, ApiPostNoAuth } from '../../helper/API/ApiData'
import AuthStorage from '../../helper/AuthStorage'
import { useDispatch } from 'react-redux'
import { getUserData } from '../../redux/actions/userDataAction'
import { changeLoginState } from '../../redux/actions/loginAction'

interface countryRes {
    data: any;
    message: string;
    status: number;
}
interface selectOption {
    value: string;
    label: string;
}

function EditProfile() {

    const history = useHistory();
    const dispatch = useDispatch()

    const Data = {
        age_group: "",
        avatar: "",
        dob: "",
        email: "",
        first_name: "",
        gender: "",
        id: "",
        last_name: "",
        mobile: "",
        nationality: "",
        token: "",
        user_name: "",
    };

    const inputErr = {
        password: "",
        confirmPass: "",
        passMatch: "",
    };

    const [profileData, setProfileData] = useState(Data);
    const [error, setError] = useState(inputErr);
    const [deleteAcc, setDeleteAcc] = useState(false);
    const [isSubmited, setIsSubmited] = useState(false);
    const [isSubmitedPass, setIsSubmitedPass] = useState(false);
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [oldMobile, setOldMobile] = useState("")
    const [oldCountryCode, setOldCountryCode] = useState("");
    const [vcodeErr, setVcodeErr] = useState(false);
    const [vcode, setVcode] = useState("");
    const [agree, setAgree] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [imgSrc, setImgSrc] = useState('./img/Avatar.png');
    const [cCode, setcCode] = useState({
        label: "",
        value: ""
    });

    const { userData } = useSelector((state: RootStateOrAny) => state.userData)

    useEffect(() => {
        setProfileData(userData)
    }, [userData]);

    useEffect(() => {

        let phone: string[] = []

        if (profileData && profileData.mobile) {
            phone = profileData.mobile.split(" ");
        }

        if (phone.length) {
            setcCode({
                label: `(${phone[0]}) ${profileData.nationality}`,
                value: phone[0]
            });
            setPhoneNumber(phone[phone.length - 1]);
            setOldMobile(phone[phone.length - 1]);
            setOldCountryCode(phone[0]);
        }
    }, [profileData])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const inputValidation = () => {
        let Err = {
            password: "",
            confirmPass: "",
            passMatch: "",
        };

        const validPassword: any = new RegExp(
            "^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})"
        );
        if (!validPassword.test(pass)) {
            Err.password = `${t('Edit_Profile.Error.Password')}`
        }
        if (!confirmPass) {
            Err.confirmPass = `${t('Edit_Profile.Error.ConfirmPass')}`
        }
        if (pass !== confirmPass) {
            Err.passMatch = `${t('Edit_Profile.Error.PassMatch')}`
        }

        setError(Err);

        if (!Err.password && !Err.passMatch) {
            return true;
        }
        return false;
    };


    useEffect(() => {
        if (profileData?.avatar) {
            setImgSrc(profileData?.avatar)
        } else {
            setImgSrc('./img/Avatar.png')
        }
    }, [profileData])


    //Save Data
    const handleSubmit = () => {
        setIsSubmited(true);

        if (oldMobile !== phoneNumber || oldCountryCode !== cCode.value) {
            if (!isVerified) {
                // setVcodeErr(`${t('Edit_Profile.Error.verifyNumber')}`)
                setVcodeErr(true);
                return
            }
        }

        let formData = new FormData();
        formData.append('user_name', profileData.user_name);
        formData.append('mobile', cCode.value + " " + phoneNumber);

        if (selectedFile) {
            formData.append('avatar', selectedFile);
        }

        ApiPatch("user/auth/edit", formData)
            .then((res: any) => {
                setVcodeErr(false);
                dispatch(getUserData())
            });
    };

    const [countryCode, setCountryCode] = useState<selectOption[]>([]);

    const getCountryData = async () => {
        try {
            const res = (await ApiGetNoAuth("general/country")) as countryRes;
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

    const [isVerified, setIsVerified] = useState(false);
    const [isOneTimeVerified, setOneTimeIsVerified] = useState(false);
    const [sendVCode, setSendVCode] = useState(false);

    //Send OTP
    const sendOTP = () => {
        setSendVCode(true);
        setShowCountDown(true);
        setStart(true);
        setOtpErr("");
        reset();
        ApiPostNoAuth("user/otp-send", {
            mobile: cCode.value + " " + phoneNumber,
        });
    };

    //Mobile Number Verification
    const mobileVerification = () => {

        setIncorrectOTP(false);
        setIncorrectMobile(false);

        ApiPostNoAuth("user/otp-verify", {
            mobile: cCode.value + " " + phoneNumber,
            code: vcode
        })
            .then((res) => {
                setIsVerified(true);
                setOneTimeIsVerified(true)
                setVcodeErr(false);
                setOver(true);
                setShowCountDown(false);
                setSendVCode(false);
                setIncorrectOTP(false);
                setIncorrectMobile(false);
                setOldMobile(phoneNumber);
                setOldCountryCode(cCode.value);
            })
            .catch((error) => {
                if (error === "Incorrect OTP") {
                    setIncorrectOTP(true);
                }

                if (error === "Incorrect Mobile Number") {
                    setIncorrectMobile(true);
                }
            });
    };

    useEffect(() => {
        if (isOneTimeVerified) {
            setIsVerified(false)
        }
    }, [phoneNumber, cCode])

    //Count Down Timer
    const [start, setStart] = useState(false);
    const [otpErr, setOtpErr] = useState("");
    const [incorrectOTP, setIncorrectOTP] = useState(false);
    const [incorrectMobile, setIncorrectMobile] = useState(false);
    const [showCountDown, setShowCountDown] = useState(false)

    const [over, setOver] = useState(false);
    const [[m, s], setTime] = useState([parseInt("3"), parseInt("0")]);

    const tick = () => {
        if (over) return;
        if (m === 0 && s === 0) {
            setOver(true);
            setOtpErr(`${t('Edit_Profile.Time_excede')}`);
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

    useEffect(() => {
        getCountryData();
    }, []);


    //Reset Password
    const resetPass = () => {
        setIsSubmitedPass(true)
        if (!inputValidation()) {
            return
        }

        ApiPost('user/auth/reset', {
            new_password: pass
        })
            .then((res) => {
                Swal.fire({
                    position: 'top',
                    icon: 'success',
                    title: 'Password reset successfully',
                })
            })
    }


    //Delete Account
    const deleteAccc = () => {
        ApiPatch('user/auth/delete', null)
            .then((res) => {
                if (AuthStorage.getToken() === localStorage.getItem(STORAGEKEY.token)) {
                    localStorage.removeItem(STORAGEKEY.token);
                    localStorage.removeItem(STORAGEKEY.userData);
                }
                else {
                    sessionStorage.removeItem(STORAGEKEY.token);
                    sessionStorage.removeItem(STORAGEKEY.userData);
                }
                dispatch(changeLoginState(false))
                history.push("/");
            })
    }

    useEffect(() => {
        if (!selectedFile) {
            setImgSrc('./img/Avatar.png');
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);

        setImgSrc(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);


    useEffect(() => {
        if (isSubmitedPass) {
            inputValidation();
        }
    }, [pass, confirmPass]);


    //For Language Translation
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="edit-profile-page main-container">
            <div className="myAcc">
                <h1>{t('Edit_Profile.Edit_Profile')}</h1>
            </div>

            <div className="myAcc">
                <h4>{t('Edit_Profile.Profile')}</h4>
            </div>
            <hr />

            <Row className="d-flex justify-content-center custom-flex-margin mt-47 mb-65">
                <div className=" position-relative text-center profile-pic position-relative">
                    {/* <img src={preview || `${profileData.avatar}`} alt="Profile" /> */}
                    {/* <img src={preview ? preview : userData.avatar} alt="Profile" /> */}
                    <img src={imgSrc} alt="Profile" />
                    <InputField
                        label=""
                        fromrowStyleclass=""
                        name=""
                        value=""
                        placeholder=""
                        type="file"
                        InputstyleClass="custom-file-input"
                        lablestyleClass=""
                        onChange={(e: any) => {
                            if (!e.target.files || e.target.files.length === 0) {
                                setSelectedFile(undefined);
                                return;
                            }
                            setSelectedFile(e.target.files[0]);
                        }}
                    />
                </div>
            </Row>
            <div className="d-flex ">
                <div className="e-profile-row custom-flex-margin width-50">
                    <div>
                        <div className="d-flex align-items-center">
                            <div className="profile-page-label proname-class">
                                {" "}
                                <h6>{t('Edit_Profile.Name')}</h6>{" "}
                            </div>
                            <div className="profile-page-label">
                                <input
                                    name="name"
                                    value={profileData?.first_name + " " + profileData?.last_name}
                                    type="text"
                                    placeholder="Name"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center  mt-30">
                            <div className="profile-page-label proname-class">
                                <h6>{t('Edit_Profile.Email')}</h6>
                            </div>
                            <div className="profile-page-label">
                                <input
                                    name="email"
                                    value={profileData?.email}
                                    type="email"
                                    placeholder="Email Address"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="e-profile-row custom-flex-margin width-50">
                    <div>
                        <div className="d-flex align-items-center ">
                            <div className="profile-page-label procpass  ml-91">
                                <h6>{t('Edit_Profile.Username')}</h6>
                            </div>
                            <div className="profile-page-label">
                                <input
                                    name="user_name"
                                    value={profileData?.user_name}
                                    type="text"
                                    placeholder="Username"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center  mt-30">
                            <div className="profile-page-label procpass  ml-91">
                                <h6>{t('Edit_Profile.Password')}</h6>
                            </div>
                            <div className="profile-page-label">
                                <input
                                    name="password"
                                    type="password"
                                    placeholder={t('Edit_Profile.Placeholder.Password')}
                                    onChange={(e) => {
                                        setPass(e.target.value);
                                    }}
                                />
                                {error.password && (
                                    <p className="text-danger">{t('Edit_Profile.Error.Password')}</p>
                                )}
                            </div>

                        </div>

                        <div className="d-flex align-items-center  mt-30">
                            <div className="profile-page-label procpass ml-91">
                                <h6>{t('Edit_Profile.Confirm')}</h6>
                            </div>
                            <div className="profile-page-label d-flex">
                                <input
                                    className="c-pass-input  e-profile-input"
                                    name="confirmPass"
                                    type="password"
                                    placeholder={t('Edit_Profile.Placeholder.ConfirmPass')}
                                    onChange={(e) => {
                                        setConfirmPass(e.target.value);
                                    }}
                                />
                                <Button className="c-pass-button" onClick={resetPass}>
                                    {t('Edit_Profile.Reset')}
                                </Button>
                            </div>

                        </div>
                        <div className="mt-1 text-danger ml-auto w-460px text">
                            {error.confirmPass && (
                                <p className="text-danger">{t('Edit_Profile.Error.ConfirmPass')}</p>
                            )}
                            {!error.confirmPass && error.passMatch && (
                                <p className="text-danger">{t('Edit_Profile.Error.PassMatch')}</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>


            <div className="d-flex">
                <div className="e-profile-row custom-flex-margin width-50">
                    <div>

                        <div className="d-flex align-items-center  mt-30">
                            <div className="profile-page-label pronationally ">
                                <h6>{t('Edit_Profile.Nationality')}</h6>
                            </div>
                            <div className="profile-page-label ">
                                <input
                                    name="nationality"
                                    value={profileData?.nationality}
                                    type="text"
                                    placeholder="Nationality"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center   mt-30 ">
                            <div className="profile-page-label prodob">
                                <h6>{t('Edit_Profile.DOB')}</h6>
                            </div>
                            <div className="profile-page-label">
                                <DatePicker
                                    name="dob"
                                    dateFormat="YYYY.MM.DD"
                                    value={profileData?.dob}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="e-profile-row custom-flex-margin width-50">
                    <div>
                        <div className="d-flex align-items-center mt-30">
                            <div className="profile-page-label procpass ml-91">
                                <h6>{t('Edit_Profile.Gender')}</h6>
                            </div>
                            <div className="profile-page-label">
                                <input
                                    name="gender"
                                    value={profileData?.gender}
                                    type="text"
                                    placeholder="Gender"
                                    onChange={(e) => {
                                        handleChange(e);
                                    }}
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center mt-30">
                            <div className="profile-page-label procpass ml-91">
                                <h6 className="">{t('Edit_Profile.Phone_number')}</h6>
                            </div>
                            <div className="profile-page-label edit-number d-sm-flex">
                                <Select
                                    className="contry-code-profile"
                                    options={countryCode}
                                    value={cCode}
                                    name="countryCode"
                                    label=""
                                    placeholder="Country Code"

                                    onChange={(e: any) => {
                                        setcCode({
                                            label: e.label,
                                            value: e.value,
                                        })
                                    }}
                                />
                                <div className="mobile-wrapper mt-2 mt-sm-0 ">
                                    <NumberInput
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        placeholder="Phone Number"
                                        InputstyleClass="mobile-profile"
                                        onChange={(e: any) => {
                                            setPhoneNumber(e.target.value);
                                        }}
                                        maxLength={10}
                                    />

                                    <Button className="c-pass-button code"
                                        onClick={() => {
                                            sendOTP();
                                        }}
                                    > {sendVCode
                                        ? `${t('Edit_Profile.Resend')}`
                                        : `${t('Edit_Profile.Send_Verification_Code')}`}</Button>
                                </div>
                            </div>
                        </div>

                        <div className="profile-page-label">

                            <div className="mobile-wrapper verify-code ">
                                <NumberInput
                                    name="code"
                                    value={vcode}
                                    placeholder={t('Edit_Profile.Verification_Code')}
                                    InputstyleClass="position-relative ml-110  mt-30"
                                    onChange={(e: any) => { setVcode(e.target.value) }}
                                    maxLength={6}
                                />


                                <div className="e-profile-otp-countdown">
                                    {showCountDown && <p>{`${m.toString().padStart(1, "0")}:${s.toString().padStart(2, "0")}`}</p>}

                                </div>

                                {vcode && !over && (
                                    <Button className="verify-btn" onClick={mobileVerification}>{t('Edit_Profile.Verify')}</Button>
                                )}

                                <div className="mt-1 text-danger ml-auto w-460px text">
                                    {over ? otpErr : ""}

                                    {isSubmited && vcodeErr && !incorrectOTP && !incorrectMobile && (
                                        <p className="text-danger">
                                            {t('Edit_Profile.Error.verifyNumber')}
                                        </p>
                                    )}

                                    {incorrectOTP && !incorrectMobile && (
                                        <p className="text-danger">{t('Edit_Profile.Error.IncorrectOTP')}</p>
                                    )}

                                    {incorrectMobile && (
                                        <p className="text-danger">{t('Edit_Profile.Error.InvalidMobile')}</p>
                                    )}
                                </div>


                            </div>




                        </div>



                    </div>
                </div>


            </div>

            <div className="text-right delete-profile">
                <Nav.Link
                    onClick={() => {
                        setDeleteAcc(true);
                    }}
                >
                    {t('Edit_Profile.Delete')}
                </Nav.Link>
            </div>

            <Row className="save-btn">
                <Button
                    onClick={() => {
                        handleSubmit();
                    }}
                >
                    {t('Edit_Profile.Save')}
                </Button>
            </Row>


            <Modal
                show={deleteAcc}
                onHide={() => {
                    setDeleteAcc(false);
                }}
                dialogClassName="welcome-modal host-modal "
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div >
                        <h4 className="text-center font-22-bold color-dark">{t('Delete_Acc.Title')}</h4>

                        <div className="welcome-content del-acc mt-60">
                            <p>
                                {t('Delete_Acc.Body')}
                            </p>
                        </div>

                        <Form.Group className="mt-30 ml-20">
                            <div className="checkboxes checkbox-add_top_15 ">
                                <CheckBox
                                    label={t('Delete_Acc.Confirm')}
                                    type="checkbox"
                                    name="tremsOfUse"
                                    id="tremsOfUse"
                                    value=""
                                    styleCheck="checkmark"
                                    onChange={(e: any) => {
                                        setAgree(!agree);
                                    }}
                                    checked={agree}
                                />
                            </div>
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer className="p-0 mt-47">
                    <Row className="w-100 m-0">
                        <div className="w-50 ">
                            <Buttons
                                ButtonStyle={
                                    agree ? "cancle-btn  h-66" : "h-66 disabled-cancle-btn "
                                }
                                onClick={() => {
                                    setDeleteAcc(false);
                                }}
                                disabled={!agree}
                            >
                                {t('Delete_Acc.Cancel')}
                            </Buttons>
                        </div>
                        <div className="w-50 ">
                            <Buttons
                                ButtonStyle={
                                    agree ? "delete-btn " : "disabled-delete-btn "
                                }
                                onClick={() => {
                                    setDeleteAcc(false);
                                    deleteAccc();
                                }}
                                disabled={!agree}
                            >
                                {t('Delete_Acc.Delete')}
                            </Buttons>
                        </div>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditProfile;
