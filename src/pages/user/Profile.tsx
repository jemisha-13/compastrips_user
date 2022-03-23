import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import MyFeed from './MyFeed';
import MyWishlistFeed from './MyWishlistFeed';

function Profile() {

    // const userInfo = AuthStorage.getStorageJsonData(STORAGEKEY.userData);
    const { userData } = useSelector((state: RootStateOrAny) => state.userData)

    const pathname = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    //For Language Translation
    const { t } = useTranslation();


    return (
        <div className="edit-profile-page main-container">
            <div className="myAcc">
                <h1 className="h-108">{t('My_Account.MyAccount')}</h1>
            </div>
            <div className="profile-card">
                <div>
                    <div className="profile-img">
                        <img src={userData?.avatar ? userData?.avatar : './img/Avatar.png'} alt="Profile_Picture" />
                        <h3>{userData?.first_name} {userData?.last_name}</h3>
                    </div>
                </div>
                <div className="ml-auto">
                    <div className="edit-profile-link">
                        <Link to="/edit-profile">{t('My_Account.Edit_Profile')}</Link>
                    </div>
                </div>

            </div>


            <div className="my-account-feeds">
                <MyFeed endPoint="hosting/getHostingOfUser" title={t("My_Account.My_Hostings")} tabs={[{ name: `${t("My_Account.Coming_Up")}`, tag: ["UPCOMING", "ONGOING"], number: 1 }, { name: `${t("My_Account.Completed")}`, tag: ["COMPLETED"], number: 16 }]} />
                <MyFeed endPoint="hosting/getAppliedHostingOfUser" title={t("My_Account.Applied_Hostings")} tabs={[{ name: `${t("My_Account.Standing_By")}`, tag: ["STAND_BY"], number: 1 }, { name: `${t("My_Account.Accepted")}`, tag: ["ACCEPTED"], number: 16 }, { name: `${t("My_Account.Declined")}`, tag: ["DECLINED"], number: 3 }]} />
                <MyWishlistFeed />
            </div>






        </div>
    )
}

export default Profile
