import React from 'react'
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Buttons from '../../components/Buttons';

interface TermsProps {
    set: (set: boolean) => void;
    value: boolean;
}

const Terms = ({ set, value }: TermsProps) => {

    const { t } = useTranslation();

    return (
        <Modal
            show={value}
            onHide={() => {
                set(false);
            }}
            dialogClassName="terms-usecard"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header className="p-0" closeButton></Modal.Header>
            <Modal.Body className="p-0">
                <div className="terms-popup">
                    <h1 className="popup-info font-30-bold color-black text-center h-65">
                        {t("Terms_Of_Use.Title")}
                    </h1>
                    <div className="popup-term-use mt-30">
                        <h4 className="font-25-bold color-black h-27 text-center">
                            {t("Terms_Of_Use.Artical_1")}
                        </h4>
                        <p className="font-18-normal color-darkgray mt-20">
                            {t("Terms_Of_Use.Body_Title")} <br /> {t("Terms_Of_Use.Body")}
                        </p>
                    </div>
                    <div className="detail-Closebutton d-flex">
                        <Buttons
                            onClick={() => {
                                set(false);
                            }}
                            ButtonStyle="termsClose-button "
                        >
                            {t("Terms_Of_Use.Close")}
                        </Buttons>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}


export default Terms;