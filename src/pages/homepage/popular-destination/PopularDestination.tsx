import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ApiGet } from '../../../helper/API/ApiData'




const PopularDestination = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        ApiGet("itinerary/getTrendingItinerary").then((data: any) => setData(data.data))
    }, [])




    const { t } = useTranslation();
    return (
        <div className="destination-list ">
            <h5 className="main-title text-left font-26-bold color-dark"><span className="h-38"> {t('Homepage.Popular_Destination')} </span> </h5>
            {data ? data.slice(0, 10).map((items: any, i: number, index: any) =>
                <div className="d-flex align-items-center mt-30 pl-30">
                    <div className="">
                        <p className="id-number font-22-bold color-dark">{i + 1}</p>
                    </div>
                    <Link to={`/itinerary?id=${items.id}`}>
                        <div className="text-left">
                            <h5 className="font-18-bold color-dark h-28">{items.title}</h5>
                            <h6 className="font-16-normal color-darkgray mt-8 h-20">{items.region}, {items.country}</h6>
                        </div>
                    </Link>
                </div>
            ) : ""}
        </div>
    )
}

export default PopularDestination
