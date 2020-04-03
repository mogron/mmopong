export class Key {
    value: string;
    isDown = false;
    isUp = true;

    constructor(value: string) {
        this.value = value;
        const that = this;
        window.addEventListener("keydown", (event) => downHandler(event, that), false);
        window.addEventListener("keyup", (event) => upHandler(event, that), false);
    }

    press() {}

    release() {}
}

function downHandler(event: KeyboardEvent, key: Key) {
    if (event.key === key.value) {
        if (key.isUp) {
            key.press();
        }
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
    }
}

function upHandler(event: KeyboardEvent, key: Key) {
    if (event.key == key.value) {
        if (key.isDown) {
            key.release();
        }
    }
    key.isDown = false;
    key.isUp = true;
    event.preventDefault;
}
