

import React from 'react'
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Buttons from '../../components/Buttons';

interface TermsProps {
    set: (set: boolean) => void;
    value: boolean;
}

const PrivacyPolicy = ({ set, value }: TermsProps) => {

    const { t } = useTranslation();

    return (
        <Modal
            show={value}
            onHide={() => {
                set(false);
            }}
            dialogClassName="privacy-usecard"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-0" closeButton></Modal.Header>
            <Modal.Body className="p-0">
                <div className="terms-popup">
                    <h1 className="popup-info font-30-bold color-black text-center h-65">
                        {t("Privacy_Policy.Title")}
                    </h1>
                    <div className="popup-Privacy-policy mt-30">
                        <p className="font-18-normal color-darkgray mt-20">
                            {t("Privacy_Policy.Body")}
                        </p>

                        <div className="mt-50">
                            <p className="font-18-normal color-darkgray ">
                                {t("Privacy_Policy.Point1")}
                            </p>
                            <p className="font-18-normal color-darkgray ">
                                {t("Privacy_Policy.Point2")}
                            </p>
                            <p className="font-18-normal color-darkgray ">
                                {t("Privacy_Policy.Point3")}
                            </p>
                            <p className="font-18-normal color-darkgray ">
                                {t("Privacy_Policy.Point4")}
                            </p>
                        </div>
                    </div>
                    <div className="detail-Closebutton d-flex">
                        <Buttons
                            onClick={() => {
                                set(false);
                            }}
                            ButtonStyle="termsClose-button"
                        >
                            {t("Privacy_Policy.Close")}
                        </Buttons>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default PrivacyPolicy;