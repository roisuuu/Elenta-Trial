// Calls readFileContent and displayNudges
function display(data) {
    readFileContent(data).then(content => {
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

// Appends decoded base64 images from given JSON object to document
function displayNudges(data) {
    var nudges_list = []
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
    for (var i = 0; i < nudges_list.length; i++) {
        var obj = nudges_list[i]

        for (var j in obj) {
        if (!obj.hasOwnProperty(j)) continue
        var cards_list = obj[j]
        // TODO: sort each card by order

            for (var k in cards_list) {
                if (!cards_list.hasOwnProperty(k)) continue
                var card = cards_list[k]
                var img = new Image()
            
                img.src = card.image
                document.body.appendChild(img)
            }
        }
    }
}
  