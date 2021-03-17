import React from "react";
import { SvgXml } from "react-native-svg";
export default function InactiveLogo(){

    const inactiveLogo = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22.625" height="28" viewBox="0 0 22.625 28">
    <defs>
      <clipPath id="clip-path">
        <rect id="Rectangle_1557" data-name="Rectangle 1557" width="22.625" height="28" fill="none"/>
      </clipPath>
    </defs>
    <g id="Groupe_1679" data-name="Groupe 1679" clip-path="url(#clip-path)">
      <path id="Tracé_11978" data-name="Tracé 11978" d="M22.328,8.086A10.255,10.255,0,0,0,11.549,0c-.334-.014-.669-.021-1-.007A9.518,9.518,0,0,0,7.075.435,10.707,10.707,0,0,0-.032,9.626,10.257,10.257,0,0,0,.859,14.4c2.878,6.508,15.149,13.574,15.149,13.574l.2-.446C13.5,25.882,4.239,19.939,1.793,14.4a10.24,10.24,0,0,1-.9-4.766A10.77,10.77,0,0,1,8.009.435a9.1,9.1,0,0,1,2.536-.446l.544.035A9.651,9.651,0,0,0,9.1.428C4.427,1.954.009,7.884,2.887,14.4,5.117,19.451,13,24.837,16.433,27c.279.174.53.334.746.46.544.334.864.516.864.516s5.784-12.926,4.285-19.887M7.7,11.716a4.815,4.815,0,0,1,3.094-6.069c.16-.049.314-.091.474-.125a4.822,4.822,0,0,1,.474,9.3c-.16.049-.314.091-.474.125A4.843,4.843,0,0,1,7.7,11.716m6.069,3.1a4.864,4.864,0,0,1-2.035.209,4.564,4.564,0,0,0,.941-.209,4.822,4.822,0,0,0-.941-9.379,4.822,4.822,0,0,1,2.035,9.379Z" transform="translate(0.046 0.025)" fill="#fff"/>
    </g>
  </svg>
   
  `
  

    return(
        <SvgXml xml={inactiveLogo} />
    )
}
