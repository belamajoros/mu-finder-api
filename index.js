const PORT = process.env.PORT || 9999
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { createCanvas, loadImage } = require('canvas')
const app = express()

app.listen(PORT, () => console.log(`running on port ${PORT}`))

const maps = {
    "Lorencia" : "./muMaps/Lorencia.png",
    "Devias" : "./muMaps/Devias.png",
    "Noria" : "./muMaps/Noria.png",
    "Aida" : "./muMaps/Aida.png",
    "Kalrutan" : "./muMaps/Karutan.png",
    "Kalrutan 2" : "./muMaps/Karutan_2.png",
    "Kantru" : "./muMaps/Kanturu_Ruins.png",
    "Refuge of Balgass" : "./muMaps/Barracks_of_Balgass.png",
    "Kantru Ruins" : "./muMaps/Kanturu_Relics.png",
    "Icarus" : "./muMaps/Icarus.png",
    "Elbeland" : "./muMaps/Elbeland.png",
    "Lost Tower" : "./muMaps/Lost_Tower.png",
    "Tarkan" : "./muMaps/Tarkan.png",
    "Dungeon" : "./muMaps/Dungeon.png",
    "Land of Trial" : "./muMaps/Land_of_Trials.png",
    "Atlans" : "./muMaps/Atlans.png",
    "Crywolf" : "./muMaps/Crywolf.png",
    "Lacleon": "./muMaps/Raklion.png"
}

app.get('/:userName', async(req,res) => {
    try {
        const { userName } = req.params;
        var x,y;
        var mapName;
        var img;
        var hexName = nameToHex(userName)
        axios.get('https://www.realmuonline.hu/character/' + hexName + '/INFINITY').then(async (response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const errorMessage = $('p:contains("Invalid hex string.")').text();
            if (errorMessage.includes('Invalid hex string.')) {
                return res.status(501).send({error: `No user named ${userName}`});
            }

            const locationTd = $('td:contains("Location")');
            const nextTd = locationTd.next('td');
            const data = nextTd.text().replace(/ /g,'').replace(/(\r\n|\n|\r)/gm, "");
            mapName = data.substr(0, data.indexOf('('))
            x = data.substring( data.indexOf("(") + 1, data.indexOf('x'))
            y = data.substring( data.indexOf("x") + 1, data.indexOf(')'))
            if(!(mapName in maps)) {
                return res.status(500).send({ error: `Can not find ${userName}.` });
            }
            console.log(mapName)
            console.log(x)
            console.log(y)
            const mapImg = maps[mapName];
            const result = await editImage(mapImg,y,x)
            return res.status(200).send({result: result})
        })
    } catch (error) {
        console.log(error.message)
    }
})

async function editImage(imgSrc, x, y){
    const canvas = createCanvas(255,255)
    const ctx = canvas.getContext('2d')
    const image = await loadImage(imgSrc)
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctx.drawImage(image, 0, 0, 255, 255)
    ctx.beginPath();
    ctx.arc(parseInt(x), parseInt(y), 2, 0, 2 * Math.PI);
    ctx.arc(parseInt(x), parseInt(y), 15, 0, 2 * Math.PI);
    ctx.arc(parseInt(x), parseInt(y), 20, 0, 2 * Math.PI);
    /* ctx.arc(parseInt(x), parseInt(y), 30, 0, 2 * Math.PI);
    ctx.arc(parseInt(x), parseInt(y), 35, 0, 2 * Math.PI); */
    ctx.stroke();
    var z = canvas.toDataURL()
    return z.toString()
}

function nameToHex(str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
      result += str.charCodeAt(i).toString(16);
    }
    return result;
}