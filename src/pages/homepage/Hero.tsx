import React, { useEffect, useRef, useState } from 'react'
import { Col, Container, Row, Form, InputGroup } from 'react-bootstrap'
import DatePicker from "react-datepicker";
import Buttons from '../../components/Buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarCheck, faSearch, faUser } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom'

// interface Props {
// date?: Date;
// handleDateSelect: () => void;
// handleDateChange: () => void;
// }

const Hero: React.FC = ({

}) => {


    const [value, onChange] = useState(new Date());
    // useState<Date | null>(new Date());
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const { t } = useTranslation();

    const location = useLocation();
    return (
        <section className={location.pathname === "/" ? 'bg-hero' : ''}>

            <Container>
                <Row className={`justify-content-center custom-flex-margin`}>
                    <Col lg={9} className={location.pathname === "/" ? 'hero-content' : 'd-none'}>
                        <h1 className="text-white text-center">{t('Homepage.Hero.Title1')}<br />{t('Homepage.Hero.Title2')}</h1>
                        <div className="input-search row align-items-center" >
                            <div className="hero-search col-lg-4">
                                <input type="search" className="custom-search" placeholder={t('Homepage.Hero.Search_Placeholder')} />
                                <div className="hero-serach-icon"><img src="./img/Vector.png" /></div>
                            </div>

                            <div className="hero-search2 col-lg-3 custom-datapicker d-flex hero-date1">
                                <div className="d-flex">
                                    <div className="mx-3 color-gray">
                                        <p className="mb-0 calender-info">{t('Homepage.Hero.From')}</p>
                                    </div>
                                    <div className="mx-3 "> <img src="./img/calendar.png" /> </div>
                                </div>
                                <div>
                                    <DatePicker selected={startDate} onChange={(date: Date | null) => setStartDate(date)}
                                        dateFormat="MMMM d"
                                    />
                                </div>
                            </div>

                            <div className="hero-search2 col-lg-3 custom-datapicker d-flex">
                                <div className="d-flex">
                                    <div className="mx-3 color-gray">
                                        <p className="mb-0 calender-info">{t('Homepage.Hero.Until')}</p>
                                    </div>
                                    <div className="mx-3 "> <img src="./img/calendar.png" /> </div>
                                </div>
                                <div>
                                    <DatePicker selected={endDate} onChange={(date: Date | null) => setEndDate(date)}
                                        dateFormat="MMMM d"
                                    />
                                </div>
                            </div>

                            <div className="col-lg-2">
                                <Buttons ButtonStyle="btn-customs" onClick={() => { }}>
                                    <FontAwesomeIcon icon={faSearch} className="mr-1" /> <span>{t('Homepage.Hero.Find_Tours')}</span>
                                </Buttons>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container className={location.pathname === "/" ? 'form-hero-button' : 'd-none'}>
                <Row>
                    <Col md={12} className="text-center">
                        <Buttons ButtonStyle="btn-customs-transparent mr-md-2" onClick={() => { }}>
                            <FontAwesomeIcon icon={faUser} className="mr-1" /> <span>{t('Homepage.Hero.View_Hosts')}</span>
                        </Buttons>

                        <Buttons ButtonStyle="btn-customs-transparent ml-md-2 mt-4 mt-md-0" onClick={() => { }}>
                            <FontAwesomeIcon icon={faCalendarCheck} className="mr-1" /> <span>{t('Homepage.Hero.Host_MyOwn')}</span>
                        </Buttons>

                    </Col>

                </Row>
            </Container>
        </section>
    );
}

export default Hero