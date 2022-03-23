import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { ApiGet } from '../../helper/API/ApiData'
import HostCard from './HostCard'
import TourCard from './TourCard'

function MyWishListPage() {

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0)
  const [itineraryCount, setItineraryCount] = useState(0)
  const [hostCount, setHostCount] = useState(0)
  const [feeds, setFeeds] = useState([])
  const [refresh, setRefresh] = useState<number>(0);

  useEffect(() => {
    ApiGet('itinerary/getItineraryWishlist')
      .then((res: any) => {
        setFeeds(res.data.itinerary)
        setItineraryCount(res.data.itinerary.length)
      })
    ApiGet('hosting/getHostWishlist')
      .then((res: any) => {
        setHostCount(res.data.host.length)
      })
  }, [refresh])


  const searchTours = async () => {
    setActiveTab(0)
    const res: any = await ApiGet('itinerary/getItineraryWishlist')
    setFeeds(res.data.itinerary)
  }

  const searchHosts = async () => {
    setActiveTab(1)
    const res: any = await ApiGet('hosting/getHostWishlist')
    setFeeds(res.data.host)
  }

  return (
    <div className="main-container">
      <div className="details mt-241">
        <div className="details-header">
          <h2 className="font-72-bold h-108">{t("My_Account.Wishlist")}</h2>
        </div>

        <div className="details-tabs page-tabs mt-80 h-39 mb-40">
          {
            <><span className={activeTab === 0 ? `active font-26-bold` : `font-26`} onClick={() => searchTours()}>{`${t("My_Account.Tours")}`}({itineraryCount}) </span> <span className="font-26 color-gray">{"| "}</span></>
          }
          {
            <><span className={activeTab === 1 ? `active font-26-bold` : `font-26`} onClick={() => searchHosts()}>{`${t("My_Account.Hosts")}`}({hostCount}) </span></>
          }
        </div>
        {
          activeTab
            ? feeds.map((feed: any) => <HostCard items={{ ...feed, isLike: true }} />)
            : feeds.map((feed: any) => <TourCard canlike={true} UpdateCount={setItineraryCount} items={{ ...feed, isLike: true }} setRefresh={setRefresh} />)
        }
      </div>
    </div>
  )
}

export default MyWishListPage
