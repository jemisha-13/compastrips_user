import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ApiGet } from "../../helper/API/ApiData";
import TourCard from "./TourCard";
const AppliedHostingPage = () => {

  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [filter, setFilter] = useState([]);
  useEffect(() => {
    ApiGet("hosting/getAppliedHostingOfUser").then((res: any) => {
      setFeeds(res.data.itinerary);
      filterData(tabs[0].tag);
    });
  }, []);

  useEffect(() => {
    filterData(tabs[0].tag);
  }, [feeds]);
  const tabs = [{ name: `${t("My_Account.Standing_By")}`, tag: ["STAND_BY"] }, { name: `${t("My_Account.Accepted")}`, tag: ["ACCEPTED"] }, { name: `${t("My_Account.Declined")}`, tag: ["DECLINED"] }];

  const filterData = (tag: any[]) => {
    setFilter(feeds.filter((feed: any) => tag.includes(feed.req_status)));
  };

  const search = (index: any, tag: any) => {
    setActiveTab(index);
    filterData(tag);
  };

  const countNumberOfItems = (tag: any[]) => {
    return feeds.filter((feed: any) => tag.includes(feed.req_status)).length;
  };
  return (
    <div className="main-container">
      <div className="details mt-241">
        <div className="details-header">
          <h2 className="font-72-bold h-108">{t("My_Account.Applied_Hostings")}</h2>
        </div>

        <div className="details-tabs page-tabs h-30 mt-87 mb-42">
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
        {filter.map((feed: any) => (
          <TourCard className="mt-66" items={feed} />
        ))}
      </div>
    </div>
  );
};
export default AppliedHostingPage;
