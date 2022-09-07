let colorSet = 0;
let controlOK = false;
let viewSet = false;
let northArrow = 0;
let northArrowSet = false;
let titleSet = false;
let blink = 0;
let blinkDivId = "boxTitle";
let legendOnSymbology = "";
let viewOptionsSet = " ";
let xCood = 0;
let yCood = 0;
let settingsControl = [
  {id: "view", clicked: false},
  {id: "northArrow", clicked: false},
  {id: "mapTitle", clicked: false},
  {id: "legend", clicked: false}, 
  {id: "scaleBar", clicked: false}
];

let settingsDescription = [
  {id: "newGrid", heading: "Grids", desc: "A grid and index are common in an atlas and on roadmaps. A grid represents a series of horizontal and vertical lines running across the map whereas index helps the map reader find a particular location by following the numbers and letters in the grid."},
  {id: "northArrow",heading: "North Arrow",  desc: "The purpose of the north arrow is for orientation. This enables the viewer to determine the map's direction in relation to the true north. Most maps tend to be oriented so that due north faces the top of the page. "},
  {id: "mapTitle",heading: "Map Title", desc: "The title of a map is one of its vital features. The title is significant because it provides a concise description of the map's subject matter to the viewer right away.  "},
  {id: "legend",heading: "Legend", desc: "The legend serves as the decoder for the symbology in the data frame. Therefore, it is also commonly known as the key. Descriptions detailing any colour schemata, symbology or categorization is explained here. "}, 
  {id: "scaleBar",heading: "Scale Bar", desc: "The scale explains the relationship of the data frame extent to the real world. The description is a ratio. This can be shown either as a unit to unit or as one measurement to another measurement. Therefore a scale showing a 1:10,000 scale means that every one paper map unit represents 10,000 real-world units."}
]

function showPopup(ele){
    document.getElementById("parentPopup").style.display = "block";
    displayOptions(ele);
}

function closeModal(ev){
    if(ev.target.className == "parentPopup" || ev.target.className == "close" || ev.target.className == "cancel" || controlOK == true) {
        controlOK = false;
        document.getElementById("parentPopup").style.display = "none";
    }
}


function goToMainPage(){
    document.getElementById("canvas0").style.visibility = "hidden";
    document.getElementById("canvas1").style.visibility = "visible";
    document.getElementById("nextButton").style.visibility = "hidden";
}

colors = new Array('lightgrey', 'grey');

function highlightOn(tic){
    tic %= colors.length;
    document.getElementById(blinkDivId).style.borderColor = colors[tic];   
    blink = setTimeout("highlightOn("+(tic+1)+")", 200);
} 
function showInfo(ele) {
  const found = settingsDescription.find(function(setting){
    return setting.id === ele.parentNode.id
  });
  found.visibility = true;
  found.visibility == true?
  (
    document.getElementById("tooltiptext").style.visibility = "visible",
    document.getElementById("tooltiptext").innerHTML = `<h3>${found.heading}</h3><p>${found.desc}</p> 
    `
      
  )
  :document.getElementById("tooltiptext").style.visibility = "hidden";
}



function hideInfo(ele){
  const found = settingsDescription.find(function(setting){
    return setting.id === ele.parentNode.id
  });
  found.visibility = false;
  found.visibility == true?document.getElementById("tooltiptext").style.visibility = "visible":
  document.getElementById("tooltiptext").style.visibility = "hidden"

}

function displayOptions(ele) {
  if(ele.id == "colorRamp"){
    setColorRamp();
  }
  if(ele.id == "view"){
    setView();
  }
  if(ele.id == "mapTitle"){
    setTitle();
  }
  if(ele.id == "northArrow"){
    setNorthArrow();
  }
  if(ele.id == "scaleBar"){
    setScaleBar();
  }
  if(ele.id == "legend"){
    setLegend();
  }
  if(ele.id == "newGrid"){
    setNewGrid();
  }
}





function dragStart(ev) {
  ev.dataTransfer.effectAllowed='move';
  ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
  ev.dataTransfer.setDragImage(ev.target,0,0);
  return true;
}
function dragEnter(ev) {
  ev.preventDefault();
  return true;
}
function dragOver(ev) {
  return false;
}
function dragDrop(ev) {
  let src = ev.dataTransfer.getData("Text");
  if(ev.target.id){
    document.getElementById(ev.target.id).innerHTML = document.getElementById("boxAll").innerHTML; 
    unsetStyles(ev.target.id);
    document.getElementById("boxAll").innerHTML = " ";
  ev.stopPropagation();
  return false;
  }
  
}
function setColorRamp(){
  document.getElementById("popUpContent").innerHTML = `
  <div  class="heading">
    <p class="optTitle">Select Color Ramp <span class="close"
    onclick="closeModal(event);">&#10006;</span></p>
  </div>
  <div class="colorContent">
    <div class="flex-container">
      <div class="flexImg" style="padding: 5px"  id="color1" onclick="selectColor(this)"><span><img src="./images/colorRamp1.png" "/></span></div>  
      <div class="flexImg" style="padding: 5px"  id="color2" onclick="selectColor(this)"><span><img src="./images/colorRamp2.png" /></span></div>  
      <div class="flexImg" style="padding: 5px" id="color3" onclick="selectColor(this)"><span><img src="./images/colorRamp3.png" /></span></div>  
    </div>
  </div>
  `
}


function selectColor(ele){
  controlOK = true;
  colorSet = ele.id == "color1" ? 1 : ele.id == "color2" ? 2 : 3;
  document.getElementById("mapImage").src="./images/"+ele.id+".png";
  legendOnSymbology = ele.id == "color1" || ele.id == ""? 
  `<div class="flex-container">
      <div class="flexImg"><span><img id="legend1" src="images/legend1.png" onclick="selectLegend(this)"/></span></div>  
      <div class="flexImg locked"><span><img id="legend2" src="images/legend2.png" disabled/></span></div>  
      <div class="flexImg locked"><span><img id="legend3"  src="images/legend3.png" disabled/></span></div>  
    </div>` : ele.id == "color2" ?
    `<div class="flex-container">
      <div class="flexImg locked"><span><img id="legend1" src="images/legend1.png" disabled/></span></div>  
      <div class="flexImg"><span><img id="legend2" src="images/legend2.png" onclick="selectLegend(this)"/></span></div>  
      <div class="flexImg locked" ><span><img id="legend3" src="images/legend3.png" disabled/></span></div>  
  </div>` :
  `<div class="flex-container">
    <div class="flexImg locked"><span><img id="legend1"  src="images/legend1.png" disabled/></span></div>  
    <div class="flexImg locked"><span><img id="legend2"  src="images/legend2.png" disabled/></span></div>  
    <div class="flexImg"><span><img id="legend3" src="images/legend3.png" onclick="selectLegend(this)"/></span></div>  
</div>`;
  if(document.getElementById("boxLegend").innerHTML != "Legend" && document.getElementById("boxLegend").style.visibility== "visible" ){
    document.getElementById("boxLegend").innerHTML = "<img src='./images/legend"+colorSet+".png' />"; 
  }
}

function setTitle(){
  document.getElementById("popUpContent").innerHTML = `
    <div  class="heading">
      <p class="optTitle">Insert Title <span class="close"
      onclick="closeModal(event);">&#10006;</span></p>
    </div>
    <div class="titleContent">
      <p>What title would you like to give your map?</p>
      <input type="text" id="cartTitle" />
      <div class="titleButton">
        <input class="OK" type="button" value="OK" onclick="setDragTitle(event)"/>
        <input class="cancel" type="button" value="Cancel" onclick="closeModal(event)"/>
      </div>
    </div>
  `
}

function setDragTitle(ev){
  var cartiographyTitle = document.getElementById("cartTitle");
  if(cartiographyTitle.value !== "") {
    controlOK = true;
    document.getElementById("boxAll").style.visibility = "visible"; 
    document.getElementById("boxAll").innerHTML = `<span>${cartiographyTitle.value}</span>` ; 
    document.getElementById("boxTitle").style.visibility = "visible"; 
    document.getElementById("info").innerHTML = "Drag the content to the highlighted location";
    titleSet = true;
  } else {
    cartiographyTitle.placeholder = "Please enter title"
  }
  blinkDivId = "boxTitle";
  highlightOn(0);
  disableOnEventOver("mapTitle");
}



function unsetStyles(destId){
  clearInterval(blink);
  blink = 0;
  document.getElementById("boxAll").style.visibility = "hidden"
  document.getElementById("boxAll").draggable="true"; 
  document.getElementById("boxAll").ondragstart="return dragStart(event)";
  document.getElementById(destId).style.border = "none";
  document.getElementById(destId).style.color = "black";
  document.getElementById(destId).style.background = "none";
  document.getElementById("info").innerHTML = "";
}

viewOptionsSet = viewSet == false ?
` <p><input id="dView" type="radio" value="dataView" name="view" checked/>Data View</p>
<p><input id="lView" type="radio" value="layoutView" name="view"/>Layout View</p>`: 
` <p><input id="dView" type="radio" value="dataView" name="view"/>Data View</p>
<p><input id="lView" type="radio" value="layoutView" name="view" checked/>Layout View</p>`;

function setView(){
  document.getElementById("popUpContent").innerHTML = `
    <div  class="heading">
      <p class="optTitle">Choose View <span class="close"
      onclick="closeModal(event);">&#10006;</span></p>
    </div>
    <div class="viewContent" id="vContent">
      ${viewOptionsSet}
      <p><input type="button" value="OK" onclick="setCheckedView()"/></p>
      <p id="alertView"></p>
    </div>
    `
}

function setCheckedView(){
  viewSet = document.getElementById("dView").checked ? false: true;
  controlOK = (document.getElementById("dView").checked == false && document.getElementById("lView").checked == false) ? false:true;
  if(viewSet == true){
    document.getElementById("outsideBorder").src = "./images/2.png";
    document.getElementById("outsideBorder").style.visibility = "visible";
    disableSettingOptions();
    disableOnEventOver('view')
  } else {
    enableSettingOptions();
  }

}

function setNorthArrow(){
  document.getElementById("popUpContent").innerHTML = `
  <div  class="heading">
    <p class="optTitle">Insert North Arrow <span class="close"
    onclick="closeModal(event);">&#10006;</span></p>
  </div>
  <div class="northView" id="nContent">
    <div class="flex-container">
      <div class="flexImg"><span><img id="n1" src="images/ar1.png" onclick="selectArrow(this)"/></span></div>  
      <div class="flexImg"><span><img id="n2" src="images/ar2.png" onclick="selectArrow(this)"/></span></div>  
      <div class="flexImg"><span><img id="n3" src="images/ar3.png" onclick="selectArrow(this)"/></span></div>  
    </div>
    <div class="flex-container">
      <div>ESRI North 1</div>
      <div>ESRI North 2</div>
      <div>ESRI North 3</div>  
    </div>
    <p id="arrowWarning"></p>
  </div>
  `
}

function selectArrow(ele){
  let arrow = ele.id
  // switch(arrow){
  //   case "n1": northArrow = 1; break;
  //   case "n2": northArrow = 2; break;
  //   case "n3": northArrow = 3; break;
  // }
  northArrow = arrow == "n1"? 1 : arrow == "n2" ? 2 : 3;
  northArrowSet = true;
  if(northArrow !== 0 ) {
    controlOK = true;
    document.getElementById("boxAll").style.visibility = "visible"; 
    document.getElementById("boxAll").innerHTML = "<img src='./images/ar"+northArrow+".png' />"; 
    document.getElementById("boxNorthArrow").style.visibility = "visible"; 
    document.getElementById("info").innerHTML = "Drag the content to the highlighted location";
    document.getElementById("arrowWarning").innerHTML = ""
  } else {
    document.getElementById("arrowWarning").innerHTML = "Please choose a North Arrow"
  }
  blinkDivId = "boxNorthArrow";
  highlightOn(0);
  disableOnEventOver('northArrow');

}


function setScaleBar(){
  document.getElementById("popUpContent").innerHTML = `
  <div  class="heading">
    <p class="optTitle">Insert Scale Bar <span class="close"
    onclick="closeModal(event);">&#10006;</span></p>
  </div>
  <div class="scaleView">
    <div class="flex-container">
      <div class="flexImg"><span><img id="scale1" src="images/scale1.png" onclick="selectScale(this)"/></span></div>  
      <div class="flexImg"><span><img id="scale2" src="images/scale2.png" onclick="selectScale(this)"/></span></div>  
    </div>
    <div class="flex-container">
      <div>Scale Bar 1</div>
      <div>Scale Bar 2</div>
    </div>
  </div>
  `
}

function selectScale(ele){
  let scale = ele.id
  controlOK = true;
  document.getElementById("boxAll").style.visibility = "visible"; 
  document.getElementById("boxAll").innerHTML = "<img src='./images/"+scale+".png' />"; 
  document.getElementById("boxScaleBar").style.visibility = "visible"; 
  document.getElementById("info").innerHTML = "Drag the content to the highlighted location";
  blinkDivId = "boxScaleBar";
  highlightOn(0);
  disableOnEventOver('scaleBar');
}

function setLegend(){
  if(legendOnSymbology == ""){
    legendOnSymbology = `<div class="flex-container">
      <div class="flexImg"><span><img id="legend1" src="images/legend1.png" onclick="selectLegend(this)"/></span></div>  
      <div class="flexImg locked"><span><img id="legend2" src="images/legend2.png" disabled/></span></div>  
      <div class="flexImg locked"><span><img id="legend3"  src="images/legend3.png" disabled/></span></div>  
    </div>` 
  }
  document.getElementById("popUpContent").innerHTML = `
  <div  class="heading">
    <p class="optTitle">Choose appropriate Legend <span class="close"
    onclick="closeModal(event);">&#10006;</span></p>
  </div>
  <div class="legendView">
      ${legendOnSymbology} 
    <div class="flex-container">
      <div>Legend 1</div>
      <div>Legend 2</div>
      <div>Legend 3</div>
    </div>
  </div>
  `
}

function selectLegend(ele){
  let legend = ele.id
  controlOK = true;
  document.getElementById("boxAll").style.visibility = "visible"; 
  document.getElementById("boxAll").innerHTML = "<img src='./images/"+legend+".png' />"; 
  document.getElementById("boxLegend").style.visibility = "visible"; 
  document.getElementById("info").innerHTML = "Drag the content to the highlighted location";
  blinkDivId = "boxLegend";
  highlightOn(0);
  disableOnEventOver('legend');
}

function setNewGrid(){
  xCood = 0; yCood = 0;
  document.getElementById("popUpContent").innerHTML = `
  <div  class="heading">
    <p class="optTitle">Choose Reference System Properties <span class="close"
    onclick="closeModal(event);">&#10006;</span></p>
  </div>
  <div class="gridView">
    <div class="grid-container">
    <fieldset>
      <legend class="setFont">Intervals</legend>
        <table class="setFont">
          <tr>
            <td></td>
            <td>Deg</td>
            <td>Min</td>
            <td>Sec</td>
            <td></td>
          </tr>
          <tr>
            <td>Place parallels every</td>
            <td><input type="text" value="0" disabled style="width: 20px"/></td>
            <td><input id="intervalX" type="text" value="0" disabled style="width: 20px"/></td>
            <td><input type="text" value="0" disabled style="width: 20px"/></td>
            <td>latitude</td>
          </tr>
          <tr>
            <td>Place medians every</td>
            <td><input type="text" value="0" disabled style="width: 20px"/></td>
            <td><input id="intervalY" type="text" value="0" disabled style="width: 20px"/></td>
            <td><input type="text" value="0" disabled style="width: 20px"/></td>
            <td>longitude</td>
          </tr>
        </table>
    </fieldset>
    </div>
    <div class="grid-container">
        <div class="flexImg" style="color: red">Choose Interval</div>  
    </div>
    <div class="grid-container">
    <fieldset>
      <legend class="setFont">Select Interval</legend>
      <div class="tableDiv">
      <div class="axisInterval">
      <table class="setFont">
          <tr>
            <td>X Axis:</td>
            <td><input type="text" value="0" disabled style="width: 20px"/>&deg;</td>
            <td><select style="width:45px;height: 30px; padding: 2px" id="xAxis" onChange="setCoordinatesX(this)">
              <option></option>
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>'</td>
            <td><input type="text" value="0.000000" disabled style="width: 60px"/>"</td>
          </tr>
          <tr>
            <td>Y Axis:</td>
            <td><input type="text" value="0" disabled style="width: 20px"/>&deg;</td>
            <td><select style="width: 45px; height: 30px;padding: 2px" id="yAxis" onchange="setCoordinatesY(this)">
              <option></option>
              <option>10</option>
              <option>20</option>
              <option>30</option>
          </select>'</td>           
          <td><input type="text" value="0.000000" disabled style="width: 60px"/>"</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>           
          <td><input id="coButton" type="button" value="OK" style="width: 70px" onclick="setCoordinates();" disabled/></td>
          </tr>
        </table>
      </div>
    </fieldset>
    </div>
  </div>
  `
}

function disableSettingOptions(){
  let settingOptions = document.getElementsByClassName("lockSettings");
  settingOptions.mapTitle.classList.remove("lockSettings");
  settingOptions.northArrow.classList.remove("lockSettings");
  settingOptions.scaleBar.classList.remove("lockSettings");
  settingOptions.legend.classList.remove("lockSettings");
  settingOptions.newGrid.classList.remove("lockSettings");
}

function enableSettingOptions(){
  document.getElementById("mapTitle").classList.add("lockSettings");
  document.getElementById("northArrow").classList.add("lockSettings");
  document.getElementById("scaleBar").classList.add("lockSettings");
  document.getElementById("legend").classList.add("lockSettings");
  document.getElementById("newGrid").classList.add("lockSettings");
}

function disableOnEventOver(id){
  settingsControl.filter(function(setting){
    if(setting.id == id){
      document.getElementById(id).classList.add("lockSettings");
      document.getElementById(id).onclick = "";
    }
  })
}

function setCoordinatesX(ele){
  if(ele.value != 0){
    xCood = ele.value;
    document.getElementById("intervalX").value = xCood;
    if(yCood != 0){
      document.getElementById("coButton").disabled = false;
    }
  } else {
    xCood = 0;
  }
}
function setCoordinatesY(ele){
  if(ele.value != 0){
    yCood = ele.value;
    document.getElementById("intervalY").value = yCood;
    if(xCood != 0){
      document.getElementById("coButton").disabled = false;
    }
  } else {
    yCood = 0;
  }
}

function setCoordinates(){
  if(xCood != 0 && yCood != 0){
    document.getElementById("coordImage").style.visibility = "visible";
    document.getElementById("coordImage").src = `./images/c${xCood}${yCood}.png`;
    controlOK = true;
  }
}