
/* globals io */

import * as PIXI from 'pixi.js';
import { Button } from './Button';
import { createPanel, getText, tileTexture } from './util';
import { io } from "socket.io-client";

let socket;

document.getElementById('init-form').addEventListener('submit', onSubmit);

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const roomId = formData.get('room');
    const username = formData.get('username');
    initSocket(roomId, username);
}

function initSocket(roomId, username) {
    socket = io("http://localhost:3000/");
    socket.on('connect', () => {

        socket.emit('selectRoom', (roomId));
        socket.emit('player', username);
        init();

    });

    socket.on('error', error => alert(error));

}


async function init() {
    const app = new PIXI.Application();
    document.getElementById('init').style.display = 'none';
    app.ticker.add(update);
    document.body.appendChild(app.view as HTMLCanvasElement);
    let text: string = '';
    const messageArray: any[] = [];

    const inputContainer = new PIXI.Container();
    const style = new PIXI.TextStyle({
        fill: "0xFFFFFF",
        fontSize: 20,
        fontStyle: "italic",
        strokeThickness: 1,

    });

    const inputText = new PIXI.Text(text, style);

    document.body.addEventListener('keydown', event => {

        text = getText(event.key, text);
        inputText.text = text;

    });

    const buttonTiles = await tileTexture('assets/bevel.png', 25, 105, 25, 105);
    const hlTiles = await tileTexture('assets/hover.png', 25, 105, 25, 105);
    const pressedTiles = await tileTexture('assets/inset.png', 25, 105, 25, 105);
    const inputPanel = (createPanel(hlTiles, 600, 50));
    const outputPanel = (createPanel(buttonTiles, 700, 400));
    const outputText = new PIXI.Text('');
    outputText.position.set(30, 5);
    outputPanel.addChild(outputText)
    inputPanel.addChild(inputText);
    const prevBtn = new Button(
        'Send',
        onClick.bind(null, -1),
        createPanel(buttonTiles, 150, 50),
        createPanel(hlTiles, 150, 50),
        createPanel(pressedTiles, 150, 50)
    );
    prevBtn.position.set(190, 530);
    const outputContainer = new PIXI.Container();

    const ui = new PIXI.Container();
    ui.addChild(prevBtn, outputContainer, inputContainer);

    app.stage.addChild(ui);
    outputContainer.position.set(25, 25);
    inputContainer.position.set(25, 525);
    prevBtn.position.set(625, 525);

    inputText.position.set(30, 5)
    outputContainer.addChild(outputPanel);
    inputContainer.addChild(inputPanel);

    socket.on('message', (data) => {
        outputText.text += data + '\n';


    });


    function onClick() {

        messageArray.push(`${inputText.text}`);

        text = '';
        inputText.text = '';
        let output = messageArray.join('\n');
        socket.emit('message', output);

    }

}


function update() {

}
