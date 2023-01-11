
/* globals io */

import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { createPanel, getText, tileTexture } from './util';
import { io } from "socket.io-client";
import { TextArea } from './TexArea';

let socket;

document.getElementById('init-form').addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const roomId = formData.get('room');
    const username = formData.get('username');
    initSocket(roomId, username);
}

function initSocket(roomId: FormDataEntryValue, username: FormDataEntryValue) {

    // init socket
    socket = io("http://localhost:3000/");
    socket.on('connect', () => {

        socket.emit('selectRoom', (roomId));
        socket.emit('player', username);
        init();

    });

    socket.on('error', error=> alert(error));

}


async function init() {

    //add canvas 
    const app = new PIXI.Application();
    document.body.appendChild(app.view as HTMLCanvasElement);

    //hide rooms form
    document.getElementById('init').style.display = 'none';
    app.ticker.add(update);


    // create textures
    const buttonTiles = await tileTexture('assets/bevel.png', 25, 105, 25, 105);
    const hlTiles = await tileTexture('assets/hover.png', 25, 105, 25, 105);
    const pressedTiles = await tileTexture('assets/inset.png', 25, 105, 25, 105);



    //create output and input panels
    const outputPanel = new TextArea(
        'placeholder',
        (createPanel(pressedTiles, 750, 475))
    );

    const inputPanel = new TextArea(
        'placeholder',
        (createPanel(pressedTiles, 575, 50)),
        onClick.bind(null, -1)
    );


    //add even listener
    document.body.addEventListener('keydown', event => {
        inputPanel.getText(event.key)

    });



    //create button
    const clickBtn = new Button(
        'Send',
        onClick.bind(null, -1),
        createPanel(buttonTiles, 150, 50),
        createPanel(hlTiles, 150, 50),
        createPanel(pressedTiles, 150, 50)
    );


    //change button position
    clickBtn.position.set(190, 530);


    // create PIXI container
    const ui = new PIXI.Container();
    ui.addChild(clickBtn, outputPanel, inputPanel);
    app.stage.addChild(ui);


    //set position of elements
    inputPanel.position.set(25, 525);
    outputPanel.position.set(25, 25);
    clickBtn.position.set(625, 525);



    //display text on outputPanel
    socket.on('message', (data: string) => {

        outputPanel.text.text += data + '\n'
    });



    // add function on click event
    function onClick() {

        socket.emit('message', inputPanel.text.text);
        inputPanel.reset()
    }

}


function update() {

}
