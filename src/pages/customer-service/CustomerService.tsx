import React, { useEffect, useState } from 'react'
import { Accordion, Card, Tabs } from 'react-bootstrap'
import { Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Buttons from '../../components/Buttons'
import InputField from '../../components/Inputfield'
import Pagination from "react-js-pagination"
import { useTranslation } from 'react-i18next';
import { ApiGet } from '../../helper/API/ApiData';
import CustorServiceDetails from './CustorServiceDetails';
import moment from 'moment';

interface notices {
    content: string,
    created_at: string,
    id: number,
    title: string,
    updated_at: string,
    view_count: number
}

interface noticeList {
    count: number;
    notices: notices[];
}
interface faq {
    answer: string;
    created_at: string;
    id: number;
    question: string;
    updated_at: string;
    view_count: number;
}
interface faqList {
    count: number;
    faq: faq[];
}


function CustomerService() {

    const { t } = useTranslation();

    const [value, setvalue] = useState("")
    const [pageNo, setPageNo] = useState<number>(1)
    const [faqPageNo, setFaqPageNo] = useState<number>(1)
    const [openNotice, setOpenNotice] = useState(false)
    const [noticeId, setNoticeId] = useState<number>()
    const [noticeData, setNoticeData] = useState<noticeList>({
        count: 0,
        notices: [{
            content: "",
            created_at: "",
            id: 0,
            title: "",
            updated_at: "",
            view_count: 0
        }]
    });

    const [faqData, setFaqData] = useState<faqList>({
        count: 0,
        faq: [{
            answer: "",
            created_at: "",
            id: 0,
            question: "",
            updated_at: "",
            view_count: 0
        }]
    })
    const [faqKeyword, setFaqKeyword] = useState<string>("")


    //For FAQ
    const getFaqData = () => {
        ApiGet(
            `general/faq?keyword=${faqKeyword}&per_page=${9}&page_number=${faqPageNo}`
        ).then((res: any) => {
            setFaqData(res.data);
        });
    };


    //For Notice
    const getNoticeData = () => {
        ApiGet(`general/notice?keyword=${value}&per_page=${10}&page_number=${pageNo}`)
            .then((res: any) => {
                setNoticeData(res.data)
            })
    }

    useEffect(() => {
        getNoticeData();
    }, [pageNo, openNotice]);

    useEffect(() => {
        getFaqData();
    }, [faqPageNo])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [openNotice]);


    return (
        <div className="cnotice-page">
            <div className="main-container">
                <div className="CustomerService-title">
                    <h1 className="">{t("Customer_Service.Customer_Service")}</h1>
                    <Tabs className="grid" defaultActiveKey="notice" transition={false}>
                        <Tab eventKey="notice" title={t("Customer_Service.Notice")}>
                            {!openNotice ?
                                <>
                                    <div className="input">
                                        <InputField
                                            name=""
                                            type="text"
                                            label=""
                                            value={value}
                                            placeholder={t("Customer_Service.Keyword")}
                                            fromrowStyleclass=""
                                            InputstyleClass="input-css"
                                            lablestyleClass=""
                                            onChange={(e: any) => { setvalue(e.target.value) }}
                                        />
                                        <Buttons onClick={() => getNoticeData()} ButtonStyle="button"><img src="./img/Ellipse.png" alt="" />{t("Customer_Service.Search")}</Buttons>
                                    </div>
                                    <div className="total-items">
                                        <h5>{t("Customer_Service.Total")}{noticeData.notices?.length}{t("Customer_Service.Items")}</h5>
                                    </div>
                                    <table>
                                        <tr className="th">
                                            <th className="th-no">No</th>
                                            <th className="th-title">{t("Customer_Service.Title")}</th>
                                            <th className="th-data">{t("Customer_Service.Date")}</th>
                                            <th className="th-views">{t("Customer_Service.Views")}</th>
                                        </tr>
                                        {noticeData.notices && noticeData.notices.map((items: notices, i: number) =>
                                            <tr className="td">
                                                <td className="td-no">{(noticeData.count - ((pageNo - 1) * 10)) - i}</td>
                                                <td className="td-title" onClick={() => { setNoticeId(noticeData.notices[i].id); setOpenNotice(true) }}>{items.title}</td>
                                                <td className="td-date">{moment(items.created_at).format("YYYY.MM.DD HH:mm")}</td>
                                                <td className="td-viwes">{items.view_count}</td>
                                            </tr>
                                        )}
                                    </table>
                                </>
                                :
                                <CustorServiceDetails setOpenNotice={setOpenNotice} noticeId={noticeId} />
                            }
                            <div className="pagination-notice">
                                <Pagination
                                    itemClass="page-item-custom"
                                    activeLinkClass="activepage"
                                    linkClass="page-link-custom"
                                    linkClassFirst="page-first-arrow"
                                    linkClassPrev="page-first-arrow"
                                    linkClassNext="page-first-arrow"
                                    linkClassLast="page-first-arrow"
                                    prevPageText={<FontAwesomeIcon icon={faCaretLeft} />}
                                    firstPageText={<><FontAwesomeIcon icon={faCaretLeft} /><FontAwesomeIcon icon={faCaretLeft} /></>}
                                    lastPageText={<><FontAwesomeIcon icon={faCaretRight} /><FontAwesomeIcon icon={faCaretRight} /></>}
                                    nextPageText={<FontAwesomeIcon icon={faCaretRight} />}
                                    activePage={pageNo}
                                    itemsCountPerPage={10}
                                    pageRangeDisplayed={10}
                                    totalItemsCount={noticeData.count}
                                    onChange={(e) => {
                                        setPageNo(e);
                                    }}
                                />
                            </div>
                        </Tab>


                        <Tab eventKey="faq" title={t("Customer_Service.FAQ")}>
                            <div className="input">
                                <InputField
                                    name=""
                                    type="text"
                                    label=""
                                    value={faqKeyword}
                                    placeholder="Enter Keyword"
                                    fromrowStyleclass=""
                                    InputstyleClass="input-css"
                                    lablestyleClass=""
                                    onChange={(e: any) => { setFaqKeyword(e.target.value) }}
                                />
                                <Buttons onClick={() => { getFaqData() }} ButtonStyle="button"><img src="./img/Ellipse.png" alt="" />{t("Customer_Service.Search")}</Buttons>
                            </div>
                            <div className="total-items">
                                <h5>{t("Customer_Service.Total")}{faqData?.faq?.length}{t("Customer_Service.Items")}</h5>
                            </div>
                            <div className="faq-table">
                                {faqData?.faq?.map((items: faq, i: number) =>
                                    <Accordion defaultActiveKey="0">
                                        <Card className="accordion-card">
                                            <Accordion.Toggle as={Card.Header} eventKey="{items.eventKey}">
                                                <div className="card-img align-items-center">
                                                    <div className="Q-round">
                                                        {i + 1}
                                                    </div>
                                                    <p className="mb-0">{items.question}</p>
                                                    <img className="in-img" src="./img/Vector-1.png" alt="" />
                                                </div>
                                            </Accordion.Toggle>
                                            <Accordion.Collapse eventKey="{items.eventKey}">
                                                <Card.Body className="faq-body">{items.answer}</Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>

                                )}
                            </div>

                            <div className="pagination-notice">
                                <Pagination
                                    itemClass="page-item-custom"
                                    activeLinkClass="activepage"
                                    linkClass="page-link-custom"
                                    linkClassFirst="page-first-arrow"
                                    linkClassPrev="page-first-arrow"
                                    linkClassNext="page-first-arrow"
                                    linkClassLast="page-first-arrow"
                                    prevPageText={<FontAwesomeIcon icon={faCaretLeft} />}
                                    firstPageText={<><FontAwesomeIcon icon={faCaretLeft} /><FontAwesomeIcon icon={faCaretLeft} /></>}
                                    lastPageText={<><FontAwesomeIcon icon={faCaretRight} /><FontAwesomeIcon icon={faCaretRight} /></>}
                                    nextPageText={<FontAwesomeIcon icon={faCaretRight} />}
                                    activePage={faqPageNo}
                                    itemsCountPerPage={9}
                                    pageRangeDisplayed={10}
                                    totalItemsCount={faqData.count}
                                    onChange={(e) => {
                                        setFaqPageNo(e);
                                    }}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default CustomerService
