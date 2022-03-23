import React, { useState, useEffect } from 'react'
import { ApiGet } from '../../helper/API/ApiData'
import TourCard from './TourCard'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const MyFeed = (props: any) => {

    const { t } = useTranslation();

    const [activeTab, setActiveTab] = useState(0)
    const [feeds, setFeeds] = useState([])
    const [filter, setFilter] = useState([])
    const limit = 5;
    useEffect(() => {
        ApiGet(props.endPoint)
            .then((res: any) => {
                setFeeds(res.data.itinerary)
                filterData(0)
            })
    }, [])

    useEffect(() => {
        filterData(0)
    }, [feeds])

    const filterData = (index: any) => {
        setFilter(
            feeds.filter((feed: any) => props.tabs[index].tag.includes(feed.req_status || feed.status))
        )

    }

    const search = (index: any, tag: any) => {
        setActiveTab(index)
        filterData(index)
    }

    const countNumberOfItems = (index: number) => {
        return feeds.filter((feed: any) => props.tabs[index].tag.includes(feed.req_status || feed.status)).length
    }
    return (
        <div className={`details`}>
            <div className="details-header mt-100">
                <h2 className="font-30-bold h-44">{props.title}</h2>
                <Link to={props.title === `${t("My_Account.My_Hostings")}` ? `/myhosting` : `/appliedhosting`}>
                    <h2 className="font-24-bold color-blue">{t("My_Account.View_All")}</h2>
                </Link>
            </div>

            <div className="details-tabs mt-40 mb-40 h-44">
                {
                    props.tabs.map((tab: any, index: number) =>
                        <><span className={activeTab === index ? `active font-26-bold` : `font-26`} onClick={() => search(index, tab.tag)}>  {tab.name} {" "} ({countNumberOfItems(index)}) </span> <span className="font-26 color-gray">{props.tabs.length === index + 1 ? "" : " | "}</span></>
                    )
                }
            </div>
            {
                filter.slice(0, limit).map((feed: any) => <TourCard items={feed} />)
            }

        </div>
    )
}
export default MyFeed;