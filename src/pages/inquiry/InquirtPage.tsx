import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import Buttons from '../../components/Buttons'
import AuthStorage from '../../helper/AuthStorage'

const InquirtPage = () => {

    const history = useHistory();

    const {t} = useTranslation();


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div className="mt-241">
                <div className="main-container">
                    <div className="myAcc h-108px mb-50"><h1>{t("Inquiry.Inquiries")}</h1></div>
                </div>

            </div>

            { AuthStorage.getLang() === "en"
            ?
            <div className="image-inquiry">
                <div className="main-container">
                    <div className="pt-134">
                        <p className="font-34-bold text-white h-38">Customer Service Inquiries</p>
                        <p className="font-24-normal text-white h-28 mt-22">customerservice@compastrips.com</p>
                    </div>

                    <div className="mt-74">
                        <p className="font-34-bold text-white h-38">Business Inquiries</p>
                        <p className="font-24-normal text-white h-28 mt-22">business@compastrips.com</p>
                    </div>
                    <div className="">
                        <Buttons
                            ButtonStyle="inruiry-button font-24-bold"
                            onClick={() => { history.push("/") }}
                            children={t("Inquiry.Get_Started")}
                        />
                    </div>
                </div>
            </div>

            :
            
            <div className="image-inquiry">
                <div className="main-container">
                    <div className="pt-134">
                        <p className="font-46-bold text-white ">현지인처럼 여행하자!</p>
                        <p className="font-46-bold text-white">나만의 여행을 호스팅하자!</p>
                    </div>

                    <div className="mt-60 set-font-size">
                        <p className="font-28-normal text-white h-40">나침반과 함께하듯이</p>
                        <p className="font-28-normal text-white h-40">여행 호스트와 함께 여행을 떠나보세요</p>
                    </div>
                    <div className="mt-40 set-font-size">
                        <p className="font-28-normal text-white h-40 ">다양한 언어로 각 지역의 전통적인 관광지는 물론, </p>
                        <p className="font-28-normal text-white h-40 ">축제 · 행사 · 콘서트 등 정보 제공으로</p>
                        <p className="font-28-normal text-white h-40 ">보다 색다른 여행을 떠날 수 있습니다.</p>
                    </div>
                    <div className="mt-40 set-font-size">
                        <p className="font-28-normal text-white h-40 ">내가 잘 아는 곳이라면, 누구든 호스트가 되어 여행을 </p>
                        <p className="font-28-normal text-white h-40 ">이끌 수 있으며 여행자간 또는 현지인과 여행자간 여행 호스팅으로 </p>
                        <p className="font-28-normal text-white h-40 ">보다 알찬 여행의 기회를 제공합니다.</p>
                    </div> 
                    <div className="mt-40 set-font-size">
                        <p className="font-28-normal text-white h-40 ">지금 바로, 내가 있는 곳에서 작은 여행을 떠나보세요!</p>
                    </div>

                    <div className="">
                        <Buttons
                            ButtonStyle="inruiry-button font-24-bold"
                            onClick={() => { history.push("/") }}
                            children={t("Inquiry.Get_Started")}
                        />
                    </div>
                </div>
            </div>}
        </>
    )
}

export default InquirtPage
