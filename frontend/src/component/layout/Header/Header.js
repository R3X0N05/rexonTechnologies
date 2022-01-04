import React from "react";
import {ReactNavbar} from "overlay-navbar";
import logo from "../../../images/logo.png";

const options ={
  burgerColorHover: "#228b22",
  logo,
  logoWidth: "20vmax",
  navColor1: "#cfcfcf",
  logoHoverSize: "10px",
  logoHoverColor: "#228b22",
  link1Text: "Home",
  link2Text: "Shop",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "#228b22",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#3fcc2f",
  link1Margin: "1vmax",
  profileIconUrl: "/login",
  profileIconColor: "#2b2b2b",
  searchIconColor: "#2b2b2b",
  cartIconColor: "#2b2b2b",
  profileIconColorHover: "#3fcc2f",
  searchIconColorHover: "#3fcc2f",
  cartIconColorHover: "#3fcc2f",
  cartIconMargin: "1vmax",
};


const Header = () => {
  return <ReactNavbar {...options} />;
};

export default Header;


// burgerColorHover : "#228b22",
//   logo,
//   logowidth:"20vmax",
//   navColor1:"#708090",
//   logoHoverSize:"20px",
//   logoHoverColor:"#228b22",
//   link1Text:"Home",
//   link2Text:"Shop",
//   link3Text:"About Us",
//   link4Text:"Contact Us",
//   link1Url:"/",
//   link2Url:"/products",
//   link3Url:"/About",
//   link4Url:"/Contact",
//   link1Size:"1.3vmax",
//   link1Color:"#f5f5f5",
//     nav1justiyContent:"flex-end",
//     nav2justiyContent:"flex-end",
//     nav3justiyContent:"flex-start",
//     nav4justiyContent:"flex-start",
//     link1ColorHover:"#228b22",
//     link1Margin:"1vmax",
//     profileIconUrl:"/login",
//     profileIconColor:"#f5f5f5",
//     searchIconColor:"#f5f5f5",
//     cartIconColor:"#f5f5f5",
//     profileIconColorHover:"#228b22",
//     searchIconColorHover:"#228b22",
//     cartIconColorHover:"#228b22",
//     cartIconMargin:"1vmax",