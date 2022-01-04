import React from "react";
import "./aboutSection.css";
import { Typography, Avatar } from "@material-ui/core";
const About = () => {
  
  return (
    <div className="aboutSection">
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dbb1clhoi/image/upload/v1641269119/logo_uk3obb.png"
              alt="Founder"
            />
            <Typography>REXON TECHNOLOGIES</Typography>
            
            <span>
              The Best Place To Get Your Tech Neccessities.
            </span>
            <span>
                For More Details Contact Us Via Our Email Or ChatBot.
            </span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default About;