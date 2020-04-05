import * as PIXI from "pixi.js";
import { Key } from "./key";

import * as io from "socket.io-client";

import barImage from "./assets/bar.png";
import wallImage from "./assets/wall.png";
import ballImage from "./assets/ball.png";

const SERVER_URL = "http://localhost:3000";

class BallState {
    vx: number = 5;
    vy: number = 2;
}

function check_collide(r1: PIXI.Sprite, r2: PIXI.Sprite): boolean {
    // Define variables we'll use to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    // hit will determine whether there's a collision
    hit = false;

    // Find the half-widths and half-heights of each sprite
    const r1hw = r1.width / 2;
    const r1hh = r1.height / 2;
    const r2hw = r2.width / 2;
    const r2hh = r2.height / 2;

    // Calculate the distance vectors between sprites
    vx = r1.x - r2.x;
    vy = r1.y - r2.y;

    // Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1hw + r2hw;
    combinedHalfHeights = r1hh + r2hh;

    // Check collision on x axis
    if (Math.abs(vx) < combinedHalfWidths) {
        // A collisoin might be occuring.  Check for it on y axis
        if (Math.abs(vy) < combinedHalfHeights) {
            // There's definitely a collision happening
            hit = true;
        } else {
            hit = false;
        }
    } else {
        hit = false;
    }

    return hit;
}

const arrowUp = new Key("ArrowUp");
const arrowDown = new Key("ArrowDown");

export class Main {
    private static readonly GAME_WIDTH = 1024;
    private static readonly GAME_HEIGHT = 768;

    private socket: SocketIOClient.Socket;

    private app: PIXI.Application | undefined;
    private ballState: BallState = new BallState();

    constructor() {
        this.socket = io.connect(SERVER_URL);
        window.onload = (): void => {
            this.startLoadingAssets();
        };
    }

    private startLoadingAssets(): void {
        this.socket.emit("message", "connected");
        const loader = PIXI.Loader.shared;
        loader.add("bar", barImage);
        loader.add("wall", wallImage);
        loader.add("ball", ballImage);
        loader.on("complete", () => {
            this.onAssetsLoaded();
        });
        //
        loader.load();
    }

    private onAssetsLoaded(): void {
        this.createRenderer();

        const stage = this.app!.stage;

        const barLeft = this.getBar();
        barLeft.position.set(Main.GAME_WIDTH * 0.1, Main.GAME_HEIGHT / 2);
        barLeft.name = "barLeft";
        barLeft.anchor.set(0.5);
        stage.addChild(barLeft);

        const barRight = this.getBar();
        barRight.position.set(Main.GAME_WIDTH * 0.9, Main.GAME_HEIGHT / 2);
        barRight.name = "barRight";
        barRight.anchor.set(0.5);
        stage.addChild(barRight);

        const ball = this.getBall();
        ball.position.set(Main.GAME_WIDTH * 0.5, Main.GAME_HEIGHT * 0.5);
        ball.name = "ball";
        ball.anchor.set(0.5);
        stage.addChild(ball);

        const that = this;
        this.app!.ticker.add((delta) => this.tick(delta, that));
    }

    tick(delta: number, that: Main) {
        const stage = this.app!.stage;
        const barLeft = <PIXI.Sprite>stage.getChildByName("barLeft");
        const ball = <PIXI.Sprite>stage.getChildByName("ball");
        const barRight = <PIXI.Sprite>stage.getChildByName("barRight");

        if (check_collide(ball, barRight) || check_collide(ball, barLeft)) {
            this.ballState.vx *= -1;
        }

        ball.x += this.ballState.vx * delta;
        ball.y += this.ballState.vy * delta;
        if (arrowUp.isDown) {
            this.socket.emit("input", "up");
            barLeft.position.y -= Main.GAME_HEIGHT * 0.01 * delta;
        }
        if (arrowDown.isDown) {
            this.socket.emit("input", "down");
            barLeft.position.y += Main.GAME_HEIGHT * 0.01 * delta;
        }

        const ballRadius = ball.width / 2;
        if (ball.x - ballRadius < 0 || ball.x + ballRadius > Main.GAME_WIDTH) {
            this.ballState.vx *= -1;
        }
        if (ball.y - ballRadius < 0 || ball.y + ballRadius > Main.GAME_HEIGHT) {
            this.ballState.vy *= -1;
        }
    }

    private createRenderer(): void {
        this.app = new PIXI.Application({
            backgroundColor: 0xd3d3d3,
            width: Main.GAME_WIDTH,
            height: Main.GAME_HEIGHT,
        });

        document.body.appendChild(this.app.view);

        //this.app.renderer.resize(window.innerWidth, window.innerHeight);
        //this.app.stage.scale.x = window.innerWidth / Main.GAME_WIDTH;
        //this.app.stage.scale.y = window.innerHeight / Main.GAME_HEIGHT;

        window.addEventListener("resize", this.onResize.bind(this));
    }

    private onResize(): void {
        if (!this.app) {
            return;
        }

        //this.app.renderer.resize(window.innerWidth, window.innerHeight);
        //this.app.stage.scale.x = window.innerWidth / Main.GAME_WIDTH;
        //this.app.stage.scale.y = window.innerHeight / Main.GAME_HEIGHT;
    }

    private getBar(): PIXI.Sprite {
        const bar = new PIXI.Sprite(PIXI.Texture.from("bar"));
        return bar;
    }

    private getWall(): PIXI.Sprite {
        const wall = new PIXI.Sprite(PIXI.Texture.from("wall"));
        return wall;
    }

    private getBall(): PIXI.Sprite {
        const ball = new PIXI.Sprite(PIXI.Texture.from("ball"));
        return ball;
    }
}

new Main();
