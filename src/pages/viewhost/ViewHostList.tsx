import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiGet} from "../../helper/API/ApiData";
import { checkImageURL } from "../../helper/utils";
import HostPro from "../../components/HostPro";

interface hostList {
  age_group: string;
  avatar: string;
  country_flag: string;
  gender: string;
  name: string;
  nationality: string;
  type: string;
  hosting_id: string;
}

interface viewHostListProps {
  hostType: string[];
  gender: string[];
  ageGroup: string[];
}
interface course {
  courses: string[];
  image: string;
}

export interface hosting {
  date: string;
  end: string;
  participate_count: number;
  pax: number;
  start: string;
  type: string;
}


interface itinerary {
  country: string;
  region: string;
  title: string;
}

interface review {
  like: number;
  review: number;
  star: string;
}

interface user {
  age: string;
  avatar: string;
  flag: string;
  gender: string;
  id: string;
  name: string;
  user_name: string;
  like: boolean;
  nationality: string;
}
export interface hostingList {
  course: course;
  hosting: hosting;
  itinerary: itinerary;
  review: review;
  user: user;
}


const ViewHostList = (props: viewHostListProps) => {
  const [hosts, setHosts] = useState<hostList[]>([]);
  const [hostingId, setHostingID] = useState<string>("");


  const { hostType, gender, ageGroup } = props;


  useEffect(() => {
    ApiGet(
      `hosting/hosts?host=${hostType.length === 1 ? hostType[0] : ""}&gender=${gender.length === 1 ? gender[0] : ""
      }&age=${ageGroup.join(",")}`
    ).then((res: any) => {
      setHosts(res.data);
    });
  }, [props]);

  const [welcome, setWelcome] = useState(false);


  //for translation
  const { t } = useTranslation();

  return (
    <div>
      <div className="card-hostlist ml-55">
        <div className="d-flex flex-wrap">
          {hosts.map((items: any, i: number) => (
            <div
              className="w-50percent"
              onClick={() => {
                setHostingID(items.hosting_id);
                setWelcome(true);
              }}
            >
              <div className="host listhost-history d-flex">
                <div>
                  <img src={items.avatar || "./img/Avatar.png"} alt="" />
                </div>
                <div className="ml-20">
                  <div className="d-flex img-join-host h-36 ">
                    <h5 className="font-20-bold color-dark mr-18">
                      {items.user_name.length >= 21
                        ? items?.user_name.slice(0, 21) + ".."
                        : items.user_name}
                    </h5>
                    <img src={checkImageURL(items.nationality)} alt="" />
                  </div>
                  <div className="host-info mt-14">
                    <div
                      className={
                        items.type === "Local"
                          ? "local-host-bg hots-tags"
                          : "travel-host-bg hots-tags"
                      }
                    >
                      <p className="info">{items.type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
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
            </div>
          ))}
        </div>
      </div>


      {
        welcome && <HostPro
          hostingId={hostingId}
          show={welcome}
          setShow={setWelcome}
        >
        </HostPro>
      }
    
    </div>
  );
};

export default ViewHostList;
