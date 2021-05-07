const cardWidth = 552
var nudges_list = []

// Calls readFileContent and displayNudges
function display(data) {
    readFileContent(data).then(content => {
        // miro.showNotification("Uploaded!")
        var obj = JSON.parse(content)
        displayNudges(obj)
    }).catch(error => console.log(error))
}

// Uses FileReader to take an uploaded file and convert its contents to text
function readFileContent(data) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(data)
    })
}

function createImage(img, num) {
    const url = "https://transfer.sh/"
    var uniqueURL = url + num + ".png"

    // Split the base64 string in data and contentType
    var block = img.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];

    // Convert it to a blob to upload
    var blob = b64toBlob(realData, contentType);

    const formData = new FormData()
    formData.append("file", blob)

    fetch(uniqueURL, {
        method: "POST",
        mode: 'no-cors',
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
 function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}


// Appends decoded base64 images from given JSON object to document
function displayNudges(data) {
    // Traverses JSON and adds all nudge objects into a list called nudges_list
    for (var prop in data) {
        if (!data.hasOwnProperty(prop)) continue
        var i = data[prop]

        for (var nudges in i) {
        if (!i.hasOwnProperty(nudges)) continue
        var all_nudges = i[nudges]

            for (var nudge in all_nudges) {
                if (!all_nudges.hasOwnProperty(nudge)) continue
                var nudge = all_nudges[nudge]
                nudges_list.push(nudge)
            }
        }
    }

    console.log(nudges_list)

    // TEST CODE TO DECODE BASE64 IMAGE
    var counter = 0
    for (var i = 0; i < nudges_list.length; i++) {
        var obj = nudges_list[i]

        for (var j in obj) {
        if (!obj.hasOwnProperty(j)) continue
        var cards_list = obj[j]
        // TODO: see if each card is sorted by order already?

            for (var k in cards_list) {
                if (!cards_list.hasOwnProperty(k)) continue
                var card = cards_list[k]
                var img = new Image()
                // console.log(card.order)
                img.src = card.image
                createImage(card.image, counter)

                // add image as a miro widget
                // miro.board.widgets.create(img)
                // Code below adds image to html document
                document.body.appendChild(img)
                counter++
            }
        }
    }
    var message = document.createElement("p")
    var txt = document.createTextNode("Uploaded!")
    message.appendChild(txt)
    document.body.appendChild(message)
}