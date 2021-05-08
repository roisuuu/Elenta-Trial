const cardWidth = 552
var nudgesList = []

// Calls readFileContent and createNudgesList
function display(data) {
    readFileContent(data).then(content => {
        // miro.showNotification("Uploaded!")
        var obj = JSON.parse(content)
        console.log(obj)
        createNudgesList(obj)
        displayNudges()
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

// returns miro image given url of image
async function createImage(img) {
    const iObj = {type:"image", url:img, x:500, y:500}
    const widget = await miro.board.widgets.create(iObj)
    console.log(img)


}

// asynchronous test function that creates an image widget on a miro whiteboard
async function createTestImage() {
    const widget = await miro.board.widgets.create({
        type: 'image',
        url: 'https://i.kym-cdn.com/entries/icons/original/000/029/000/imbaby.jpg',
        x: 500,
        y: 500
    })

    miro.board.viewport.zoomToObject(widget)
}

// Appends decoded base64 images from given JSON object to document
function createNudgesList(data) {
    // Traverses JSON and adds all nudge objects into a list called nudgesList
    for (var prop in data) {
        if (!data.hasOwnProperty(prop)) continue
        var i = data[prop]

        for (var nudges in i) {
        if (!i.hasOwnProperty(nudges)) continue
        var all_nudges = i[nudges]

            for (var nudge in all_nudges) {
                if (!all_nudges.hasOwnProperty(nudge)) continue
                var nudge = all_nudges[nudge]
                nudgesList.push(nudge)
            }
        }
    }

    console.log(nudgesList)
}

// takes each nudge and creates a column to display all of the cards in it vertically
function displayNudges() {
    for (var i = 0; i < nudgesList.length; i++) {
        var obj = nudgesList[i]

        for (var j in obj) {
        if (!obj.hasOwnProperty(j)) continue
        var cards_list = obj[j]
        // TODO: see if each card is sorted by order already?

            for (var k in cards_list) {
                if (!cards_list.hasOwnProperty(k)) continue
                var card = cards_list[k]
                var img = new Image()
                img.src = card.image
                // add image as a miro widget
                createImage(card.image)
                                
                // Code below adds image to html document
                document.body.appendChild(img)
            }
        }
    }
    miro.showNotification("done")
    var message = document.createElement("p")
    var txt = document.createTextNode("Uploaded!")
    message.appendChild(txt)
    document.body.appendChild(message)
}