import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HostPro from '../../../components/HostPro'
import { ApiGet} from "../../../helper/API/ApiData"
import { checkImageURL } from '../../../helper/utils'


interface hostList {
    hosting_id: string
    avatar: string,
    country: string,
    name: string,
    nationality: string,
    region: string
}
// interface course {
//     courses: string[];
//     image: string;
//   }
  
  export interface hosting {
    date: string;
    end: string;
    participate_count: number;
    pax: number;
    start: string;
    type: string;
  }
  
  
//   interface itinerary {
//     country: string;
//     region: string;
//     title: string;
//   }
  
//   interface review {
//     like: number;
//     review: number;
//     star: string;
//   }
  
//   interface user {
//     age: string;
//     avatar: string;
//     flag: string;
//     gender: string;
//     id: string;
//     name: string;
//     user_name: string;
//     like: boolean;
//     nationality: string;
//   }
// interface hostingList {
//     course: course;
//     hosting: hosting;
//     itinerary: itinerary;
//     review: review;
//     user: user;
//   }

const PopulatHost = () => {
    const [show, setShow] = useState(false);
    const [hostingId, setHostingId] = useState<string>("");
  
    const [data, setData] = useState<hostList[]>([])
    useEffect(() => {
        ApiGet("hosting/getPopularHost")
            .then((data: any) => setData(data.data.host))
    }, [])
    const { t } = useTranslation();


    return (
        <>
            <div className="destination-list mt-52 position-relative ">
                <h5 className="main-title text-left  font-26-bold color-dark"><span className="h-38">{t('Homepage.Popular_Hosts')}</span></h5>
                {data ? data.map((items: hostList, i:number) => {

                    return (<div className="d-flex align-items-center mt-30 pl-30"
                        onClick={() => {
                            setHostingId(items.hosting_id);
                            setShow(true);
                        }}
                    >
                        <div className="">
                            <img className="hostimg" src={items.avatar || "./img/Avatar.png"} alt=""/>
                        </div>
                        <div className="text-left host-datas ">
                            <h5 className="font-20-bold color-black h-30">{items.name}</h5>
                            <h6 className="font-16-normal color-darkgray mt-8 ">{items.region} , {items.country} </h6>
                        </div>
                        <div className="align-item-center hoscitytimgmain">
                            <img className="hoscitytimg" src={checkImageURL(items.nationality)} alt="flag" />
                        </div>
                    </div>)
                }) : ""}
            </div>
            {
                show && <HostPro
                    hostingId={hostingId}
                    show={show}
                    setShow={setShow}
                >
                </HostPro>
            }
        </>
    )
}

export default PopulatHost
