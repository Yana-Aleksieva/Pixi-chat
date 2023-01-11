import * as PIXI from 'pixi.js';
import { Container, DisplayObject, TextStyle, Text } from 'pixi.js';

const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff
});

export class TextArea extends Container {

    _label: string;
    text: Text;

    constructor(

        label: string,
        private element: DisplayObject,
        private callback?: () => void
        
    ) {
        super();

        this.addChild(this.element);
        // this.highlight.renderable = false;
        //this.pressed.renderable = false;

        this.text = new Text('', style);
        this.text.anchor.set(0.5, 0.5);
        this.label = label;
        this.addChild(this.text);

        this.interactive = true;
    }

    get label() {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        //this.text.text = value;
        this.text.position.set(this.width / 2, this.height / 2);
    }

    reset() {
        this.text.text = '';
    }

    getText(value: string) {

        let current = value.charCodeAt(0);
        if (value.length < 2) {
            this.text.text += value;
        }
        if (value == 'Enter') {
            this.callback();
        }
        if (value == 'Backspace') {
            console.log(value)
            this.text.text = this.text.text.substring(0, this.text.text.length - 1);
            //console.log(text)

        }
    }
}