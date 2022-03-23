import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Buttons from '../../components/Buttons'
import InputField from '../../components/Inputfield'
// import queryString from 'query-string'
import { useLocation } from "react-router-dom";

import { useTranslation } from 'react-i18next'

const ForgotPass: React.FC = (props) => {


    const { t } = useTranslation();

    const { search } = useLocation();
    // const queryParams = queryString.parse(search);


    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const resetErr = {
        passFormateErr: false,
        passErr: false,
        confirmPassErr: false,
        passMatch: false
    }
    const [errors, setErrors] = useState(resetErr);
    const [isSubmited, setIsSubmited] = useState(false);

    const validateInputs = () => {
        let resetFormError = {
            passFormateErr: false,
            passErr: false,
            confirmPassErr: false,
            passMatch: false
        }

        const resrtPassword: any = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})");

        if (!resrtPassword.test(password)) {
            resetFormError.passFormateErr = true
        }

        if (!password) {
            resetFormError.passErr = true
        }

        if (!confirmPass) {
            resetFormError.confirmPassErr = true
        }

        if (confirmPass !== password) {
            resetFormError.passMatch = true
        }

        setErrors(resetFormError);

        if (!resetFormError.confirmPassErr &&
            !resetFormError.passErr &&
            !resetFormError.passFormateErr &&
            !resetFormError.passMatch) {
            return true;
        }

        return false;
    }

    const resetPass = async () => {
        setIsSubmited(true);

        if (!validateInputs()) {
            return
        }
        try {
            // const res = await axios.post(BaseURL + 'user/forgot', { password: password }, {
            //     headers: {
            //         'Authorization': `Bearer ${queryParams.token}`
            //     }
            // }).then((res) => {
            //     history.push("/");
            // })

        } catch (error) {
        }
    }

    useEffect(() => {
        if (isSubmited) {
            validateInputs();
        }
    }, [password, confirmPass])

    return (
        <Container className="resetpass-sec pb-md-0 pb-5">
            <Row className="justify-content-center custom-flex-margin">
                <Col lg={5} className="resetpass">

                    <div className="modal-signup-title ">
                        <h3>{t('Forgot_Password.Reset_Password')}</h3>
                    </div>
                    <div className="reset-pass-content-page text-center"><p>{t('Forgot_Password.Pass_config')}</p></div>

                    <InputField
                        label={t('Forgot_Password.New_Password')}
                        fromrowStyleclass="mt-4"
                        name="resetPass"
                        value={password}
                        placeholder=""
                        type="password"
                        InputstyleClass="custom-input mb-0 mt-20"
                        lablestyleClass="font-20-bold color-black"
                        onChange={(e: any) => { setPassword(e.target.value) }}
                    />
                    {errors.passErr &&
                        <p className="text-danger">{t('Forgot_Password.Error.Password')}</p>
                    }
                    {
                        password && errors.passFormateErr && <p className="text-danger">{t('Forgot_Password.Error.Password_Formate')}</p>
                    }
                    <InputField
                        label={t('Forgot_Password.Confirm_Pass')}
                        fromrowStyleclass="mt-4"
                        name="resetCPass"
                        value={confirmPass}
                        placeholder=""
                        type="password"
                        InputstyleClass="custom-input mb-0 mt-20"
                        lablestyleClass="font-20-bold color-black"
                        onChange={(e: any) => setConfirmPass(e.target.value)}
                    />
                    {errors.confirmPassErr &&
                        <p className="text-danger">{t('Forgot_Password.Error.ConfirmPass')}</p>
                    }
                    {
                        confirmPass && errors.passMatch && <p className="text-danger">{t('Forgot_Password.Error.PassMatch')}</p>
                    }

                    <Buttons ButtonStyle="btn-customs-confirm  h-56 mt-56" onClick={resetPass}>{t('Forgot_Password.Confirm')}</Buttons>

                </Col>
            </Row>


        </Container>
    )
}

export default ForgotPass
