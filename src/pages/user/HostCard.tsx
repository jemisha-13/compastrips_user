import React from 'react'
import { useTranslation } from 'react-i18next'
import { checkImageURL } from '../../helper/utils';

const HostCard: React.FC<any> = ({ items }: any) => {


  const { t } = useTranslation();

  return (
    <div className="w-100 whistlist-host">
      <div className="host d-flex">
        <div>
          <img src={items.avatar || "./img/Avatar.png"} alt="" />
        </div>
        <div className="ml-20 w-100">
          <div className="d-flex">
            <div className="d-flex img-join-host h-36 ">
              <h5 className="font-20-bold color-dark mr-18">
                {items.user_name}
              </h5>
              <img src={checkImageURL(items.nationality)} alt="flag" />
            </div>

            <div className="d-flex whishlist-hostpro ml-auto">

              <div className="tout-created ml-auto">
                <div className="download-heart-icon button">
                  <div className="heart-div">
                    <input
                      type="checkbox"
                      id="id2"
                      checked={true}
                      className="instruments"
                    />
                    <label
                      htmlFor="id2"
                      className="text-white check mb-0"
                    >
                      {false && <img src="./img/Favourite.png" alt="" />}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="host-info mt-14">
            <div
              className={
                items.host_type === "Local"
                  ? "local-host-bg hots-tags"
                  : "travel-host-bg hots-tags"
              }
            >
              <p className="info">{items.host_type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
            </div>
            <div className="hots-tags">
              <p className="info">{items.gender === "MALE" ? t("Male") : t("Female")}</p>
            </div>
            <div className="hots-tags">
              <p className="info">{items.age_group}{t("Age_Groups")}</p>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default HostCard
