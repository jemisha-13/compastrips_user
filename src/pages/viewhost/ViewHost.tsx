import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import ViewHostList from "./ViewHostList";

function ViewHost() {
  const [hostType, setHostType] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [ageGroup, setAgeGroup] = useState<string[]>([]);

  const handleCheckbox = (e: any) => {
    switch (e.target.name) {
      case "hosttype":
        if (e.target.checked) {
          setHostType([...hostType, e.target.value]);
        } else {
          setHostType((prev) =>
            prev.filter((currItem) => currItem !== e.target.value)
          );
        }
        break;
      case "gender":
        if (e.target.checked) {
          setGender([...gender, e.target.value]);
        } else {
          setGender((prev) =>
            prev.filter((currItem) => currItem !== e.target.value)
          );
        }
        break;
      case "agegrup":
        if (e.target.checked) {
          setAgeGroup([...ageGroup, e.target.value]);
        } else {
          setAgeGroup((prev) =>
            prev.filter((currItem) => currItem !== e.target.value)
          );
        }
        break;
    }
  };

  const { t } = useTranslation();

  const pathname = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="viewhost main-container ">
      <div className="View-Host-title">
        <div>
          <div className="myAcc">
            <h1 className="h-88">{t('ViewHost.Header')}</h1>
          </div>
        </div>
      </div>
      <section className="mt-45 d-flex">
        <div className="Host-type-card  mb-98">
          <div>
            <h1 className="font-28-bold color-dark">{t('ViewHost.Host_Type')}</h1>
            <div className="btn-1 mt-20">
              <input
                className="radiobutton"
                type="checkbox"
                id="hosttype"
                value="Local"
                name="hosttype"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="hosttype" className="radio-label">
                {t('ViewHost.Local_Host')}
              </label>
            </div>
            <div className="btn-2 mt-14 position-relative">
              <input
                className="radiobutton"
                type="checkbox"
                id="travelerHost"
                value="Travel"
                name="hosttype"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="travelerHost" className="radio-label">
                {t('ViewHost.Traveler_Host')}
              </label>
            </div>
          </div>
          <div className="mt-60">
            <h1 className="font-28-bold color-dark">{t('ViewHost.Gender')}</h1>
            <div className="btn-3 mt-20">
              <input
                className="radiobutton"
                type="checkbox"
                id="hosttype"
                value="MALE"
                name="gender"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="hosttype" className="radio-label">
                {t('ViewHost.Male')}
              </label>
            </div>
            <div className="btn-4 mt-20">
              <input
                className="radiobutton"
                type="checkbox"
                id="travelerHost"
                value="FEMALE"
                name="gender"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="travelerHost" className="radio-label">
                {t('ViewHost.Female')}
              </label>
            </div>
          </div>
          <div className="mt-60">
            <h1 className="font-28-bold color-dark">{t('ViewHost.Age_Group')}</h1>
            <div className="btn-5 mt-20">
              <input
                className="radiobutton"
                type="checkbox"
                id="hosttype"
                value="20"
                name="agegrup"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="hosttype" className="radio-label">
                {t('ViewHost.20s')}
              </label>
            </div>
            <div className="btn-6 mt-14">
              <input
                className="radiobutton"
                type="checkbox"
                id="travelerHost"
                value="30"
                name="agegrup"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="travelerHost" className="radio-label">
                {t('ViewHost.30s')}
              </label>
            </div>
            <div className="btn-7 mt-14">
              <input
                className="radiobutton"
                type="checkbox"
                id="hosttype"
                value="40"
                name="agegrup"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="hosttype" className="radio-label">
                {t('ViewHost.40s')}
              </label>
            </div>
            <div className="btn-8 mt-14">
              <input
                className="radiobutton"
                type="checkbox"
                id="travelerHost"
                value="50"
                name="agegrup"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="travelerHost" className="radio-label">
                {t('ViewHost.50s')}
              </label>
            </div>
            <div className="btn-9 mt-14">
              <input
                className="radiobutton"
                type="checkbox"
                id="hosttype"
                value="60"
                name="agegrup"
                onChange={(e: any) => handleCheckbox(e)}
              />
              <label htmlFor="hosttype" className="radio-label mb-5">
                {t('ViewHost.60s')}
              </label>
            </div>
          </div>
        </div>
        <div>
          <ViewHostList
            hostType={hostType}
            gender={gender}
            ageGroup={ageGroup}
          />
        </div>
      </section>
    </div>
  );
}

export default ViewHost;
