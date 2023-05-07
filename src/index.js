import Clarifai from "clarifai";

let dropArea = document.getElementById("drop-area");
let browseBtn = document.getElementById("browse-btn");
let imageElement = document.getElementById("image");
let colorsDiv = document.getElementById("colors")

const initialCode = () => {
  const prevents = (e) => e.preventDefault();

  ["dragenter", "dragover", "dragleave", "drop"].forEach((evtName) => {
    dropArea.addEventListener(evtName, prevents);
  });
  dropArea.addEventListener("drop", handleDroppedImage);
  browseBtn.addEventListener("change", handleSelectedFile);

  let colorDiv = document.querySelectorAll(".color")
  colorDiv.forEach(element => {
    element.addEventListener("click", copyColor)
  });
};

const handleDroppedImage = (e) => {
  let file = e.dataTransfer.files[0];
  displayImage(file);
};

const handleSelectedFile = () => {
  let file = browseBtn.files[0];
  displayImage(file);
};

const displayImage = (file) => {
  colorsDiv.innerHTML = ""
  let reader = new FileReader();
  reader.addEventListener("load", function () {
    imageElement.src = reader.result;
    extractColors();
  });
  reader.readAsDataURL(file);
};

const extractColors = () => {
  const clarifai = new Clarifai.App({
    apiKey: "YOUR_API_KEY",
    apiEndpoint: "https://api.clarifai.com",
  });

  const modelId = "eeed0b6733a644cea07cf4c60f87ebb7";
  let imageElement = document.getElementById("image");
  let base64Image = imageElement.src.split(',')[1];
  clarifai.models
    .predict(modelId, { base64: base64Image })
    .then((response) => {
      const colors = response.outputs[0].data.colors;
      console.log(colors)
      displayColors(colors)
    })
    .catch((error) => console.log(error));
};

const displayColors = (colors) => {

  colors.forEach((color) => {
    const parentDiv = document.createElement("div");
    parentDiv.classList.add("color");

    const childDiv = document.createElement("div");
    childDiv.style.backgroundColor = color.raw_hex
    parentDiv.appendChild(childDiv);

    const childH3 = document.createElement("h3");
    childH3.innerHTML = color.raw_hex
    parentDiv.appendChild(childH3);

    colorsDiv.appendChild(parentDiv);
  })

  let colorDiv = document.querySelectorAll(".color")
  colorDiv.forEach(element => {
    element.addEventListener("click", copyColor)
  });
}

const copyColor = (event) => {
  let element = event.target;
  let parent = element.parentElement;
  let child = parent.children[1]
  let hexCode = child.innerHTML
  navigator.clipboard.writeText(hexCode)
    .then(() => {
      child.innerHTML = "Copied!"
    })
  setTimeout(() => {
    child.innerHTML = hexCode
  }, 3000);
}


initialCode();
