var sdk = apigClientFactory.newClient({
  apiKey: "beuV2SuzVr6ZqoI6VP0cA4ImJSVEXlEk6vlOtTcx",
});

function triggerSearch(searchText) {
  document.getElementById("search_input").value = searchText;
  document.getElementById("search_results").innerHTML =
    '<h4 style="text-align:center">';

  var params = {
    keyword: searchText,
    "x-api-key": "beuV2SuzVr6ZqoI6VP0cA4ImJSVEXlEk6vlOtTcx",
  };

  sdk
    .searchGet(params, {}, {})
    .then(function (result) {
      console.log(result);
      image_paths = result["data"];

      var photosDiv = document.getElementById("search_results");
      photosDiv.innerHTML = "";

      var n;
      for (n = 0; n < image_paths.length; n++) {
        const s3Object = image_paths[n];
        photosDiv.innerHTML += `<img src="${s3Object}" style="width:25%; margin-top: 10px">`;
      }
    })
    .catch(function (result) {
      console.log(result);
      var photosDiv = document.getElementById("search_results");
      photosDiv.innerHTML = "No Images found";
    });
}

function photoSearch() {
  var searchText = document.getElementById("search_input");
  if (!searchText.value) {
    alert("Search keywords are required.");
  } else {
    searchText = searchText.value.trim().toLowerCase();
    triggerSearch(searchText);
  }
}

function uploadPhoto() {
  var customLabels = document.getElementById("custom_labels").value;
  var reader = new FileReader();
  var file = document.getElementById("file_input").files[0];
  reader.onload = function (event) {
    body = btoa(event.target.result);
    var params = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": file.type,
      bucket: "ccphotoalbum",
      key: file.name,
      "x-amz-meta-customLabels": customLabels,
    };
    sdk.uploadBucketKeyPut(params, body, {}).catch(function (error) {
      console.log(error);
    });
  };
  reader.readAsBinaryString(file);
}

function photoUpload() {
  let photoFile = document.getElementById("file_input").files[0];
  let fileReader = new FileReader();

  fileReader.onload = function () {
    let xhr = new XMLHttpRequest();
    let inputData = document.getElementById("file_input").files[0];
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        document.getElementById("uploadSuccessText").innerHTML =
          "Uploaded, please wait a few seconds for it to be indexed.";
      }
    });
    xhr.open(
      "PUT",
      "https://c18n9k15l8.execute-api.us-east-1.amazonaws.com/dev/upload/ccphotoalbum/" +
        inputData.name
    );
    xhr.setRequestHeader("Content-Type", inputData.type);
    xhr.setRequestHeader(
      "x-api-key",
      "beuV2SuzVr6ZqoI6VP0cA4ImJSVEXlEk6vlOtTcx"
    );
    xhr.setRequestHeader(
      "x-amz-meta-customLabels",
      custom_labels.value.toString()
    );
    xhr.send(inputData);
  };
  fileReader.readAsArrayBuffer(photoFile);
}
