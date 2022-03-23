import moment from "moment";

const transportation = {
  Car: "승용차",
  Taxi: "택시",
  Public_Transportation: "대중교통"
}


export const getCookie = (name: string) => {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");
  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
    if (name === cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }
  // Return null if not found
  return null;
};

export const dateFunction = (date: string): string => {
  if (
    moment(date).format("YYYY.MM.DD") ===
    moment(new Date()).format("YYYY.MM.DD")
  ) {
    return "Today";
  } else if (
    moment(date).format("YYYY.MM.DD") ===
    moment(new Date()).subtract(1, "days").format("YYYY.MM.DD")
  ) {
    return "Yesterday";
  }
  return moment(date).format("YYYY.MM.DD");
};


export const checkImageURL = (nationality: string) => {
  const pngImages = ["Antarctica"];

  let url_image = `./img/flags/${nationality}.svg`;
  if (pngImages.includes(nationality)) {
    url_image = `./img/flags/${nationality}.png`;
  }
  return url_image
}

export const transporTation = (keyword: string) => {
  // @ts-ignore
  return Object.keys(transportation).includes(keyword) ? transportation[keyword] : keyword
}