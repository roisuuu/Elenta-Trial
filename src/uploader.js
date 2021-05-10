// constant throughout the process
const cardWidth = 552
const fontSize = 50

// Calls readFileContent and displayNudges
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
async function displayNudges(nudgesList) {
    const widgets = []
    // create table, i = columnID
    for (var i = 0; i < nudgesList.length; i++) {
        var nudge = nudgesList[i]
        // add new column to table
        const colX = i * cardWidth + 40 * i
        
        if (nudge.hasOwnProperty("nudge_title")) {
            widgets.push(getColumnLabel(nudge.nudge_title, colX))
        }
        
        const cards_list = nudge.cards
        
        var rowY = 0
        var prevY = 0
        // the height of the prev image in the column
        var prevHeight = 0

        for (var k in cards_list) {
            var cardObj = cards_list[k]
            
            var imgURL = cardObj.image
            var currHeight = await getDimensions(imgURL)
            
            // calculate rowY based off previous value and currHeight of image
            rowY = prevY + prevHeight/2 + 10 + currHeight/2
            
            // add image as a miro widget to column
            widgets.push(createImage(imgURL, colX, rowY))
    
            // update prevHeight and prevY
            prevHeight = currHeight
            prevY = rowY
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

// create async function that promises image dimensions...
async function getDimensions(imgURL) {
    return new Promise((resolve, reject) => {
        let img = new Image()
        
        img.onload = () => {
            resolve(img.naturalHeight)
            // UNCOMMENT BELOW FOR QUICK DEBUGGING
            // document.body.appendChild(img)
        }
        img.onerror = reject
        img.src = imgURL
    })
}

// helper for displayNudges
// creates a miro text label widget
function getColumnLabel(text, x) {
    return {
        type: 'text',
        x: x,
        y: -(fontSize),
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
// async function createTestImage() {
//     const widget = await miro.board.widgets.create({
//         type: 'image',
//         url: 'https://i.kym-cdn.com/entries/icons/original/000/029/000/imbaby.jpg',
//         x: 0,
//         y: 0
//     })

//     miro.board.viewport.zoomToObject(widget)
// }
