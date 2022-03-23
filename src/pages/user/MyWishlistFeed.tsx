import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ApiGet } from '../../helper/API/ApiData'
import HostCard from './HostCard'
import TourCard from './TourCard'

const MyWishlistFeed: React.FC = () => {

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0)
  const [itineraryCount, setItineraryCount] = useState(0)
  const [hostCount, setHostCount] = useState(0)
  const [feeds, setFeeds] = useState([])
  const [refresh, setRefresh] = useState<number>(0);
  const limit = 5

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
    <div className="details">
      <div className="details-header mt-100">
        <h2 className="font-30-bold h-45">{t("My_Account.Wishlist")}</h2>
        <Link to="/wishlist"><h2 className="font-24-bold color-blue">{t("My_Account.View_All")}</h2></Link>

      </div>

      <div className="details-tabs mt-40 h-39 mb-40">
        {
          <><span className={activeTab === 0 ? `active font-26-bold` : `font-26`} onClick={() => searchTours()}>{`${t("My_Account.Tours")}`}({itineraryCount}) </span> <span className="font-26 color-gray">{"|"}</span>   </>
        }
        {
          <><span className={activeTab === 1 ? `active font-26-bold` : `font-26`} onClick={() => searchHosts()}>{`${t("My_Account.Hosts")}`}({hostCount}) </span></>
        }
      </div>
      {
        activeTab
          ? feeds.slice(0, limit).map((feed: any) => <HostCard items={{ ...feed, isLike: true }} />)
          : feeds.slice(0, limit).map((feed: any) => <TourCard canlike={true} UpdateCount={setItineraryCount} items={{ ...feed, isLike: true }} setRefresh={setRefresh}/>)
      }
    </div>
  )
}

export default MyWishlistFeed
