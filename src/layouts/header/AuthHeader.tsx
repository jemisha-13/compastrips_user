import {
  Container,
  Image,
  Nav,
  Navbar,
  Col,
  Row,
  Button,
  Badge,
} from "react-bootstrap";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Buttons from "../../components/Buttons";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Link, useHistory } from "react-router-dom";
import DatePicker from "react-datepicker";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AuthStorage from "../../helper/AuthStorage";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  toggleNotification,
  removeUserData,
} from "../../redux/actions/userDataAction";
import { changeLoginState } from "../../redux/actions/loginAction";
import Switch from "react-switch";
import moment from "moment";
import { getCookie } from "../../helper/utils";
import { ApiPut } from "../../helper/API/ApiData";
import { getNotification } from "../../redux/actions/notificationAction";
import { db } from "../../firebaseConfig";

const AuthHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  //Hero Section
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedLang, setSelectedLang] = useState("한국어(KR)");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [badge, setShowBadge] = useState(false);

  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);

  useEffect(() => {
    dispatch(getUserData());
  }, []);

  useEffect(() => {
    const header: any = document.getElementById("myHeader");
    const sticky = header.offsetTop;
    const scrollCallBack: any = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky && location.pathname === "/") {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, [location]);

  useEffect(() => {
    let getLangLocal = localStorage.getItem("i18nextLng");
    let getLangCookie = getCookie("i18next");
    let getLangTag = document.documentElement.lang;

    if (
      getLangLocal === "en" ||
      getLangCookie === "en" ||
      getLangTag === "en"
    ) {
      changeLanguage("en", "English(EN)");
    } else {
      changeLanguage("ko", "한국어(KR)");
    }
  }, []);

  const [temp, setTemp] = useState(false);

  const changeLanguage = (lang: string, name: string) => {
    setSelectedLang(name);
    i18next.changeLanguage(lang);
    if (temp) {
      let currentPath = location.pathname + location.search;
      window.location.href = currentPath;
    }
    setTemp(true);
  };

  useEffect(() => {
    // let currentPath = location.pathname + location.search;
    // // history.replace(currentPath)
    // window.location.href = currentPath
  }, [selectedLang]);
  //------------

  //Profile Dropdown
  // const userInfo = AuthStorage.getStorageJsonData(STORAGEKEY.userData);

  const history = useHistory();

  const LogOut = () => {
    dispatch(changeLoginState(false));
    dispatch(removeUserData());
    AuthStorage.deauthenticateUser();
    history.push("/");
  };

  const onDatePickerClick = (id: string) => {
    document.getElementById(id)?.click();
  };

  //Chat Switch
  // const handleChange = (
  //   nextChecked: boolean | ((prevState: boolean) => boolean)
  // ) => {
  //   setChecked(nextChecked);
  // };

  const chatNotification = () => {
    ApiPut("user/notification", {}).then((res: any) => {
      dispatch(toggleNotification(res?.data?.data?.state));
    });
  };

  //Homepage search filter
  const Search = () => {
    let searchParam =
      "?keyword=" +
      searchTerm +
      "&startDate=" +
      moment(startDate).format("YYYY-MM-DD") +
      "&endDate=" +
      moment(endDate).format("YYYY-MM-DD");
    history.push({
      pathname: "/",
      search: searchParam,
    });
  };

  // Notification section
  const { notificationData } = useSelector(
    (state: RootStateOrAny) => state.notification
  );

  useEffect(() => {
    if (userData && userData.hasOwnProperty("id")) {
      dispatch(getNotification(userData?.id));
    }
  }, [userData]);

  useEffect(() => {
    setShowBadge(notificationData.find((x: any) => !x?.data.seen) ? true : false)
  }, [notificationData])

  const redirect = (docId: string, itiID: string, hostingID: string) => {
    (async () => {
      await db.collection("notification").doc(docId).update({
        seen: true
      })
    })()

    if(location.pathname === "/itinerary"){
      window.location.href = `/itinerary?id=${itiID}&hostingId=${hostingID}`;
    }else{
      history.push(`/itinerary?id=${itiID}&hostingId=${hostingID}`);
    }
  }

  return (
    <Container fluid>
      <Navbar
        collapseOnSelect
        expand="lg"
        className={
          location.pathname === "/"
            ? "header align-items-start"
            : "white-header align-items-start"
        }
      >
        <Container fluid className="align-items-start">
          <Navbar.Brand className="homepagelogo">
            <Link
              to="/"
              onClick={() => { Search(); setSearchTerm(""); setEndDate(new Date()); setStartDate(new Date()); }}
              className={location.pathname === "/" ? "d-block" : "d-none"}
            >
              <Image src="./img/logo.png" />
            </Link>
          </Navbar.Brand>
          <Navbar.Brand className="mainlogo">
            <Link
              to="/"
              className={location.pathname === "/" ? "d-none" : "d-block"}
            >
              <Image src="./img/Group.png" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav ">
            <Nav className="ml-auto menu-link align-items-start">
              <Dropdown>
                <Dropdown.Toggle className="bg-transparent profilenote-btn">
                  <div className="position-relative">
                    <img
                      className="header-profilePic"
                      src={userData?.avatar ? userData?.avatar : "./img/Avatar.png"}
                      alt="Profile"
                    />
                    {badge && <Badge className="position-absolute note-badge"></Badge>}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="note-dropmenu">
                  <Dropdown.Item>
                    {notificationData.map((x: any) => {
                      if (x.data.seen) {
                        return <p className="mb-0 notification-font-normal" key={x.id} onClick={() => redirect(x.id, x.data.itinerary_id, x.data.hosting_id)}>
                          {AuthStorage.getLang() === "en" ? x.data.msg : x.data.msg_ko}
                        </p>
                      } else {
                        return <p className="mb-0 notification-font-bold" key={x.id} onClick={() => redirect(x.id, x.data.itinerary_id, x.data.hosting_id)}>
                          {AuthStorage.getLang() === "en" ? x.data.msg : x.data.msg_ko}
                        </p>
                      }

                    })}
                  </Dropdown.Item>
                </Dropdown.Menu>

              </Dropdown>


              <Dropdown>
                <Dropdown.Toggle className="d-flex profile-drop">
                  <h5
                    className={
                      location.pathname === "/"
                        ? "text-white font-13-bold profile-w-70"
                        : "font-13-bold color-black profile-w-70"
                    }
                  >
                    {userData?.user_name > 7
                      ? userData?.user_name.slice(0, 7) + "..."
                      : userData?.user_name}
                  </h5>
                  <img
                    className="arrows-dropdown"
                    src={
                      location.pathname === "/"
                        ? "./img/downarrowhite.svg"
                        : "./img/downarrow.svg"
                    }
                    alt=""
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu className=" profile-drop-link">
                  <Dropdown.Item>
                    <Link
                      to="/profile"
                      className={
                        location.pathname === "/profile"
                          ? " profile-drop-link-a"
                          : "profile-drop-link-normal"
                      }
                    >
                      {t("Header.DropDown.My_Account")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      to="/myhosting"
                      className={
                        location.pathname === "/myhosting"
                          ? " profile-drop-link-a"
                          : "profile-drop-link-normal"
                      }
                    >
                      {t("Header.DropDown.My_Hosting")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      to="/appliedhosting"
                      className={
                        location.pathname === "/appliedhosting"
                          ? " profile-drop-link-a"
                          : "profile-drop-link-normal"
                      }
                    >
                      {t("Header.DropDown.Applied_Hosting")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      to="/wishlist"
                      className={
                        location.pathname === "/wishlist"
                          ? " profile-drop-link-a"
                          : "profile-drop-link-normal"
                      }
                    >
                      {t("Header.DropDown.Wishlist")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link
                      to="/edit-profile"
                      className={
                        location.pathname === "/edit-profile"
                          ? " profile-drop-link-a"
                          : "profile-drop-link-normal"
                      }
                    >
                      {t("Header.DropDown.Edit_Profile")}
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={LogOut}>
                    <Link to="#/action-3">{t("Header.DropDown.Log_Out")}</Link>
                  </Dropdown.Item>
                  <div className="d-flex mt-30">
                    <div>
                      <p className="mb-0 font-16-bold color-dark h-28">Chat</p>
                    </div>
                    <div className="ml-auto d-flex">
                      <p className="on-off mb-0">
                        <span>{userData?.notification ? "on" : "off"}</span>
                      </p>
                      <Switch
                        onChange={chatNotification}
                        checked={userData?.notification}
                        boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 3px rgba(0, 0, 0, 0.2)"
                        uncheckedIcon={false}
                        checkedIcon={false}
                        onColor="#C4C4C4"
                        onHandleColor="#42B6E6"
                        handleDiameter={16}
                        height={8}
                        width={26}
                        className="chat-toggle"
                      />
                    </div>
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <DropdownButton
                menuAlign="left"
                title={
                  <div>
                    {location.pathname === "/" ? (
                      <img className="mr-2" src="./img/Education.png" alt="" />
                    ) : (
                      <img
                        className="mr-2"
                        src="./img/Education-blue.png"
                        alt=""
                      />
                    )}

                    {selectedLang}
                    {/* <img className="downarrow" src="./img/downarrowhite.svg" alt=""   /> */}
                    <img
                      className="downarrow"
                      src={
                        location.pathname === "/"
                          ? "./img/downarrowhite.svg"
                          : "./img/bluedown.svg"
                      }
                      alt=""
                    />
                  </div>
                }
                className={
                  location.pathname === "/"
                    ? "select-btn"
                    : "select-btn select-btn-two"
                }
              >
                <Dropdown.Item>
                  <Button
                    onClick={() => {
                      changeLanguage("en", "English(EN)");
                    }}
                  >
                    English(EN)
                  </Button>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Button
                    onClick={() => {
                      changeLanguage("ko", "한국어(KR)");
                    }}
                  >
                    한국어(KR)
                  </Button>
                </Dropdown.Item>
              </DropdownButton>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* <Hero/> */}
      <div
        className={location.pathname === "/forgotpass" ? "d-none" : "d-block"}
      >
        <section className={location.pathname === "/" ? "bg-hero" : ""}>
          <Container>
            <Row className="justify-content-center custom-flex-margin">
              <div
                className={
                  location.pathname === "/" ? "hero-content " : "custom-fixed"
                }
              >
                <h1 className="text-white text-center">
                  <span className="h-88"> {t("Homepage.Hero.Title1")} </span>
                  <div className="mt-10"></div>
                  <span className="h-88"> {t("Homepage.Hero.Title2")}</span>
                </h1>
                <div id="myHeader" className="mx-auto">
                  <div
                    className={
                      location.pathname === "/"
                        ? "input-search row align-items-center"
                        : "hero-search-bar row align-items-center"
                    }
                  >
                    <div className="hero-search search-tab">
                      <input
                        type="search"
                        className="custom-search"
                        value={searchTerm}
                        placeholder={t("Homepage.Hero.Search_Placeholder")}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                        }}
                      />
                      <div className="hero-serach-icon">
                        <img src="./img/Vector.png" alt="" />
                      </div>
                    </div>

                    <div className="hero-search2  custom-datapicker d-flex hero-date1">
                      <div className="d-flex">
                        <div className="mx-20 color-gray">
                          <p className="mb-0 calender-info">
                            {t("Homepage.Hero.From")}
                          </p>
                        </div>
                        <div className="">
                          <img
                            src="./img/calendar.png"
                            onClick={() => {
                              onDatePickerClick("startDate");
                            }}
                            alt=""
                          />
                        </div>
                      </div>
                      <div>
                        <DatePicker
                          id="startDate"
                          selected={startDate}
                          minDate={new Date()}
                          onChange={(date: Date | null) => setStartDate(date)}
                          dateFormat="EEE MM/dd"
                        />
                      </div>
                    </div>

                    <div className="hero-search3  custom-datapicker d-flex">
                      <div className="d-flex">
                        <div className="mx-20 color-gray">
                          <p className="mb-0 calender-info">
                            {t("Homepage.Hero.Until")}
                          </p>
                        </div>
                        <div className="">
                          <img
                            src="./img/calendar.png"
                            onClick={() => {
                              onDatePickerClick("endDate");
                            }}
                            alt=""
                          />{" "}
                        </div>
                      </div>
                      <div>
                        <DatePicker
                          id="endDate"
                          selected={endDate}
                          minDate={new Date()}
                          onChange={(date: Date | null) => setEndDate(date)}
                          dateFormat="EEE MM/dd"
                        />
                      </div>
                    </div>

                    <div className="">
                      <Buttons
                        ButtonStyle="btn-customs"
                        onClick={() => Search()}
                      >
                        <FontAwesomeIcon icon={faSearch} className="mr-1" />{" "}
                        <span>{t("Homepage.Hero.Find_Tours")}</span>
                      </Buttons>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </Container>
          <Container
            className={
              location.pathname === "/" ? "form-hero-button" : "d-none"
            }
          >
            <Row>
              <Col
                md={12}
                className="text-center my-button-hero justify-content-center"
              >
                <Buttons
                  ButtonStyle="btn-customs-transparent h-64-trans w-240"
                  onClick={() => {
                    history.push("/viewhost");
                  }}
                >
                  <img src="./img/UserIcon.svg" alt="" />{" "}
                  <span>{t("Homepage.Hero.View_Hosts")}</span>
                </Buttons>

                <Buttons
                  ButtonStyle="btn-customs-transparent  h-64-trans w-240"
                  onClick={() => {
                    history.push("/hostmyown");
                  }}
                >
                  <img src="./img/HomeCalender.svg" alt="" />{" "}
                  <span>{t("Homepage.Hero.Host_MyOwn")}</span>
                </Buttons>
              </Col>
            </Row>
          </Container>
        </section>
      </div>


    </Container>
  );
};

export default AuthHeader;
