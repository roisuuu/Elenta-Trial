const cardWidth = 552
// TODO: dynamically shift this value depending on previous image
const rowHeight = 650
const fontSize = 50

// Calls readFileContent and createNudgesList
function display(data) {
    readFileContent(data).then(content => {
        var obj = JSON.parse(content)
        console.log(obj)
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

// Displays nudges on a miro whiteboard using their SDK
function displayNudges(nudgesList) {
    const widgets = []
    // create table, i = columnID
    for (var i = 0; i < nudgesList.length; i++) {
        var obj = nudgesList[i]
        // add new column to table
        const colX = i * cardWidth + 40 * i
        
        if (obj.hasOwnProperty("nudge_title")) {
            widgets.push(getColumnLabel(obj.nudge_title, colX))
        }
        
        const cards_list = obj.cards
        
        var cardNum = 0
        var rowY = 0

        for (var k in cards_list) {
            // TODO: remove this line
            if (cardNum === 0) console.log(rowY)
            var cardObj = cards_list[k]
            var img = new Image()
            img.src = cardObj.image
            // create async function that promises image dimensions...
            img.onload = () => {
                console.log(img.clientWidth + 'x' + img.clientHeight)
            }
            // calculate rowY based off previous value 
            rowY = cardNum * rowHeight + 10 * cardNum
            
            // add image as a miro widget to column
            widgets.push(createImage(cardObj.image, colX, rowY))
            // increment card num for correct Y spacing for each column
            cardNum++

            document.body.appendChild(img)
        }        
    }

    try {
        miro.board.widgets.create(widgets)
        miro.showNotification("uploaded!")
        miro.board.ui.closeLibrary()
    } catch(err) {
        console.log(err)
        miro.showErrorNotification("something went wrong while uploading")
    } 
}

// helper for displayNudges
// creates a miro text label widget
function getColumnLabel(text, x) {
    return {
        type: 'text',
        x: x,
        y: -(rowHeight / 2 + fontSize),
        text: text,
        width: cardWidth,
        scale: 3, // there's no fontSize attribute in miro, text size is determined by scale...
        style: {
          textColor: '#000000',
          textAlign: 'c',
          underline: 1,
          bold: 1
        },
    }
}

// helper for displayNudges
// returns miro image widget parameters given url of image
// and position on the board
function createImage(img, xPos, yPos) {
    return {type:"image", url:img, x:xPos, y:yPos}
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
