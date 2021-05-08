const cardWidth = 552
const rowHeight = 500
const fontSize = 36
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

// asynchronous test function that creates an image widget on a miro whiteboard
async function createTestImage() {
    const widget = await miro.board.widgets.create({
        type: 'image',
        url: 'https://i.kym-cdn.com/entries/icons/original/000/029/000/imbaby.jpg',
        x: 0,
        y: 0
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
// function displayNudges() {
//     const widgets = []
//     for (var i = 0; i < nudgesList.length; i++) {
//         var obj = nudgesList[i]

//         for (var j in obj) {
//         if (!obj.hasOwnProperty(j)) continue
//         var cards_list = obj[j]
//         // TODO: see if each card is sorted by order already?

//             for (var k in cards_list) {
//                 if (!cards_list.hasOwnProperty(k)) continue
//                 var card = cards_list[k]
//                 var img = new Image()
//                 img.src = card.image
//                 // add image as a miro widget
//                 createImage(card.image)
                                
//                 // Code below adds image to html document
//                 document.body.appendChild(img)
//             }
//         }
//     }

//     miro.showNotification("done")
//     var message = document.createElement("p")
//     var txt = document.createTextNode("Uploaded!")
//     message.appendChild(txt)
//     document.body.appendChild(message)
// }

function displayNudges() {
    const widgets = []
    // create table, i = columnID
    for (var i = 0; i < nudgesList.length; i++) {
        var obj = nudgesList[i]
        // add new column to table
        const colX = i * cardWidth + 10 * i
        widgets.push(getColumnLabel("TEST", colX))
        
        for (var j in obj) {
            if (!obj.hasOwnProperty(j)) continue
            var cards_list = obj[j]
            
            var cardNum = 0
            var rowY = 0
            // calculate rowY based off previous value 

                for (var k in cards_list) {
                    rowY = cardNum * rowHeight + 10 * cardNum
                    if (!cards_list.hasOwnProperty(k)) continue
                    var card = cards_list[k]

                    var img = new Image()
                    img.src = card.image

                    // add image as a miro widget to column
                    widgets.push(createImage(card.image, colX, rowY))
                    // increment card num
                    cardNum++

                    // Code below adds image to html document
                    document.body.appendChild(img)
                }
        }
    }

    miro.board.widgets.create(widgets)
}

function getColumnLabel(text, x) {
    return {
        type: 'text',
        x: x,
        y: -(rowHeight / 2 + fontSize),
        text: text,
        width: cardWidth,
        style: {
          fontSize: fontSize,
          textColor: '#000000',
          textAlign: 'c',
        },
    }
}

// returns miro image widget parameters given url of image
// and position on the board
function createImage(img, xPos, yPos) {
    return {type:"image", url:img, x:xPos, y:yPos}
    // const widget = await miro.board.widgets.create(iObj)
    // console.log(img)
}