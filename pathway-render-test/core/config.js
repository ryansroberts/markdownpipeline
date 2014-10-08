/********************************************************************
*
* Filename:     config.js
* Description:  contains default configs for all objects used in pathways
*   
********************************************************************/


module.exports = {
    system : {
        pathSelector: "#npw-path-layer",
        defaultURI : '',
        styles : {
            edge : {
                //strokeColor: "#c0c8d1",
                strokeColor: "rgb(85,85,85)",
                fillType: "none",
                strokeType: "line",
                strokeWidth: 1
            },
            icon : {
                //strokeColor: "#c0c8d1",
                strokeColor: "#fff",
                fillType: "none",
                strokeType: "line",
                strokeWidth: 3
            },
            label : {
                strokeColor: "#ccc",
                strokeType: "line",
                fillType: "fill",
                fillColor: "#fff",
                strokeWidth: 0.5
            },
            interactiveNormal : {
                strokeColor: "#fc9503",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#ffffff",
                gradientColor2: "#f8f9fb",
                strokeWidth: 3
            },
            interactiveHighlight : {
                strokeColor: "#4ea5bc",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#d4eaf0",
                gradientColor2: "#99c5d0",
                strokeWidth: 3
            },
            interactiveSelect : {
                strokeColor: "#07324e",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#176a9e",
                gradientColor2: "#0c4062",
                strokeWidth: 3
            },
            generic : {
                strokeColor: "#a9b0b6",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#ffffff",
                gradientColor2: "#f8f9fb",
                strokeWidth: 3
            },
            pathReferenceDecoration : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#fcb700",
                gradientColor2: "#fb7303",
                strokeWidth: 0
            },
            pathReferenceDecorationHighlight : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#4eaec8",
                gradientColor2: "#1a809b",
                strokeWidth: 0
            },
            interactiveDecoration : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#fcb700",
                gradientColor2: "#fb7303",
                strokeWidth: 0
            },
            interactiveDecorationHighlight : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#99c5d0",
                gradientColor2: "#d4eaf0",
                strokeWidth: 0
            },
            monochromeInteractive : {
                strokeColor: "#878787",
                strokeType: "line",
                fillType: "gradient",
                gradientColor1: "#ffffff",
                gradientColor2: "#F9F9F9",
                strokeWidth: 3

            },
            monochromePathReference : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#C1C1C1",
                gradientColor2: "#878787",
                strokeWidth: 0
            },
            monochromeGenericPathReference : {
                strokeColor: "none",
                strokeType: "none",
                fillType: "gradient",
                gradientColor1: "#a9b0b6",
                gradientColor2: "#a9b0b6",
                strokeWidth: 0
            }
        }
    }       
};
