import React from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SabootLanding from "./SabootLanding.jsx";

gsap.registerPlugin(ScrollTrigger);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SabootLanding />
  </React.StrictMode>
);
