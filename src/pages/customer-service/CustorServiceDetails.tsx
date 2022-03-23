import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Buttons from '../../components/Buttons'
import { ApiGet } from '../../helper/API/ApiData'


interface noticeData {
    content: string,
    created_at: string,
    id: number,
    title: string
}


const CustorServiceDetails: React.FC<any> = (props: any) => {

    const [data, setData] = useState<noticeData>();

    //Get Notice by Id
    useEffect(() => {
        ApiGet(`general/notice/${props.noticeId}`)
            .then((res: any) => {
                setData(res.data);
            })
    }, [props.noticeId])


    return (
        <div>
            <div className="cnotice-single-page cnotice-page">
                <div className="main-container">
                    <div className="CustomerService-title2">
                        <div className="detail-title">
                            <h2>{data?.title}</h2>
                            <p>{moment(data?.created_at).format("YYYY-MM-DD")}</p>
                        </div>
                        <div className="detail-text">
                            <p>{data?.content}</p>
                        </div>
                        <div className="black-border"></div>
                        <div className="detail-button">
                            <Buttons onClick={() => { props.setOpenNotice(false) }} ButtonStyle="back-button">Back</Buttons>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CustorServiceDetails