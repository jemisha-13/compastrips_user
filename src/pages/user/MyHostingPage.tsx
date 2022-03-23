import React, { useState, useEffect } from "react";
import { ApiGet } from "../../helper/API/ApiData";
import TourCard from "./TourCard";
import CheckBox from "../../components/Checkbox";
import { useTranslation } from "react-i18next";
const MyHostingPage = () => {

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [filter, setFilter] = useState([]);
  const [myOnly, setMyOnly] = useState(false)
  useEffect(() => {
    ApiGet("hosting/getHostingOfUser").then((res: any) => {
      setFeeds(res.data.itinerary);
      filterData(tabs[0].tag);
    });
  }, []);

  useEffect(() => {
    filterData(tabs[0].tag);
  }, [feeds]);
  const tabs = [
    { name: `${t("My_Account.Coming_Up")}`, tag: ["UPCOMING", "ONGOING"] },
    { name: `${t("My_Account.Completed")}`, tag: ["COMPLETED"] },
  ];

  useEffect(() => {
    ShowmyOnly(myOnly)
  }, [myOnly])

  const ShowmyOnly = (myOnly: boolean) => {
    if (myOnly)
      setFilter(filter.filter((feed: any) => feed.creator !== "Compastrips"))
    else
      filterData(tabs[activeTab].tag);
  }
  const filterData = (tag: any) => {
    setFilter(feeds.filter((feed: any) => tag.includes(feed.status)));
  };

  const search = (index: any, tag: any) => {
    setActiveTab(index);
    setMyOnly(false)
    filterData(tag);
  };

  const countNumberOfItems = (tag: any) => {
    return feeds.filter((feed: any) => tag.includes(feed.status)).length;
  };
  return (
    <div className="main-container">
      <div className="details mt-241">
        <div className="details-header">
          <h2 className="font-72-bold h-108">{t("My_Account.My_Hostings")}</h2>
        </div>

        <div className="details-tabs page-tabs h-39 mt-79 mb-66">
          {tabs.map((tab: any, index: number) => (
            <>
              <span
                className={activeTab === index ? `active font-26-bold` : `font-26`}
                onClick={() => search(index, tab.tag)}
              >
                {tab.name}{" "}({countNumberOfItems(tab.tag)}){" "}
              </span>{" "}
              <span className="font-26 color-gray">
                {tabs.length === index + 1 ? "" : "| "}
              </span>
            </>
          ))}
        </div>
        <div className="-mt-27 my-host-check">
          <CheckBox
            label={t("My_Account.Show_My_Own_Host_Only")}
            type="checkbox"
            name="agree"
            id="agree"
            value=""
            styleCheck="checkmark"
            onChange={(e: any) => {
              setMyOnly(prev => !prev)
            }}
            checked={myOnly}
          />
        </div>

        {filter.map((feed: any) => (
          <TourCard items={feed} />
        ))}
      </div>
    </div>
  );
};
export default MyHostingPage;
