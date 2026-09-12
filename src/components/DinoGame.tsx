"use client";

import React, { useEffect, useRef } from "react";
import { DINO_IMAGES } from "./dinoAssets";

interface DinoGameProps {
  className?: string;
  height?: number;
}

export default function DinoGame({ className = "", height = 125 }: DinoGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const runnerRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;

    function getRandomNum(min: number, max: number) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getTimeStamp() {
      return performance.now();
    }

    const FPS = 60;
    const IS_HIDPI = typeof window !== "undefined" && window.devicePixelRatio > 1;

    // --- COLLISION DETECTION ---
    function CollisionBox(x: number, y: number, w: number, h: number) {
      // @ts-ignore
      this.x = x;
      // @ts-ignore
      this.y = y;
      // @ts-ignore
      this.width = w;
      // @ts-ignore
      this.height = h;
    }

    function boxCompare(tRexBox: any, obstacleBox: any) {
      return (
        tRexBox.x < obstacleBox.x + obstacleBox.width &&
        tRexBox.x + tRexBox.width > obstacleBox.x &&
        tRexBox.y < obstacleBox.y + obstacleBox.height &&
        tRexBox.height + tRexBox.y > obstacleBox.y
      );
    }

    function createAdjustedCollisionBox(box: any, adjustment: any) {
      // @ts-ignore
      return new CollisionBox(
        box.x + adjustment.x,
        box.y + adjustment.y,
        box.width,
        box.height
      );
    }

    function checkForCollision(obstacle: any, tRex: any) {
      if (!obstacle) return false;
      const tRexBox = new (CollisionBox as any)(
        tRex.xPos + 1,
        tRex.yPos + 1,
        tRex.config.WIDTH - 2,
        tRex.config.HEIGHT - 2
      );
      const obstacleBox = new (CollisionBox as any)(
        obstacle.xPos + 1,
        obstacle.yPos + 1,
        obstacle.typeConfig.width * obstacle.size - 2,
        obstacle.typeConfig.height - 2
      );

      if (boxCompare(tRexBox, obstacleBox)) {
        const collisionBoxes = obstacle.collisionBoxes;
        const tRexCollisionBoxes = Trex.collisionBoxes;
        for (let t = 0; t < tRexCollisionBoxes.length; t++) {
          for (let i = 0; i < collisionBoxes.length; i++) {
            const adjTrexBox = createAdjustedCollisionBox(
              tRexCollisionBoxes[t],
              tRexBox
            );
            const adjObstacleBox = createAdjustedCollisionBox(
              collisionBoxes[i],
              obstacleBox
            );
            if (boxCompare(adjTrexBox, adjObstacleBox)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    // --- OBSTACLE ---
    function Obstacle(
      // @ts-ignore
      this: any,
      canvasCtx: CanvasRenderingContext2D,
      type: any,
      obstacleImg: HTMLImageElement,
      dimensions: any,
      gapCoefficient: number,
      speed: number,
      groundYPos: number
    ) {
      this.canvasCtx = canvasCtx;
      this.image = obstacleImg;
      this.typeConfig = type;
      this.gapCoefficient = gapCoefficient;
      this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
      this.dimensions = dimensions;
      this.remove = false;
      this.xPos = 0;
      // Place obstacle firmly on the ground line
      this.yPos = groundYPos - this.typeConfig.height;
      this.width = 0;
      this.collisionBoxes = [];
      this.gap = 0;
      this.followingObstacleCreated = false;
      this.init(speed);
    }

    Obstacle.MAX_GAP_COEFFICIENT = 1.5;
    Obstacle.MAX_OBSTACLE_LENGTH = 3;
    Obstacle.types = [
      {
        type: "CACTUS_SMALL",
        width: 17,
        height: 35,
        multipleSpeed: 4,
        minGap: 120,
        collisionBoxes: [
          new (CollisionBox as any)(0, 7, 5, 27),
          new (CollisionBox as any)(4, 0, 6, 34),
          new (CollisionBox as any)(10, 4, 7, 14),
        ],
      },
      {
        type: "CACTUS_LARGE",
        width: 25,
        height: 50,
        multipleSpeed: 7,
        minGap: 120,
        collisionBoxes: [
          new (CollisionBox as any)(0, 12, 7, 38),
          new (CollisionBox as any)(8, 0, 7, 49),
          new (CollisionBox as any)(13, 10, 10, 38),
        ],
      },
    ];

    Obstacle.prototype = {
      init: function (speed: number) {
        this.cloneCollisionBoxes();
        if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
          this.size = 1;
        }
        this.width = this.typeConfig.width * this.size;
        this.xPos = this.dimensions.WIDTH - this.width;
        this.draw();
        if (this.size > 1) {
          this.collisionBoxes[1].width =
            this.width -
            this.collisionBoxes[0].width -
            this.collisionBoxes[2].width;
          this.collisionBoxes[2].x =
            this.width - this.collisionBoxes[2].width;
        }
        this.gap = this.getGap(this.gapCoefficient, speed);
      },
      draw: function () {
        let sourceWidth = this.typeConfig.width;
        let sourceHeight = this.typeConfig.height;
        if (IS_HIDPI) {
          sourceWidth *= 2;
          sourceHeight *= 2;
        }
        const sourceX =
          sourceWidth * this.size * (0.5 * (this.size - 1));
        this.canvasCtx.drawImage(
          this.image,
          sourceX,
          0,
          sourceWidth * this.size,
          sourceHeight,
          this.xPos,
          this.yPos,
          this.typeConfig.width * this.size,
          this.typeConfig.height
        );
      },
      update: function (deltaTime: number, speed: number) {
        if (!this.remove) {
          this.xPos -= Math.floor(((speed * FPS) / 1000) * deltaTime);
          this.draw();
          if (!this.isVisible()) {
            this.remove = true;
          }
        }
      },
      getGap: function (gapCoefficient: number, speed: number) {
        const minGap = Math.round(
          this.width * speed + this.typeConfig.minGap * gapCoefficient
        );
        const maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
        return getRandomNum(minGap, maxGap);
      },
      isVisible: function () {
        return this.xPos + this.width > 0;
      },
      cloneCollisionBoxes: function () {
        const collisionBoxes = this.typeConfig.collisionBoxes;
        for (let i = collisionBoxes.length - 1; i >= 0; i--) {
          this.collisionBoxes[i] = new (CollisionBox as any)(
            collisionBoxes[i].x,
            collisionBoxes[i].y,
            collisionBoxes[i].width,
            collisionBoxes[i].height
          );
        }
      },
    };

    // --- T-REX ---
    // @ts-ignore
    function Trex(this: any, canvas: HTMLCanvasElement, image: HTMLImageElement, groundY: number) {
      this.canvas = canvas;
      this.canvasCtx = canvas.getContext("2d");
      this.image = image;
      this.xPos = Trex.config.START_X_POS;
      this.yPos = 0;
      this.groundYPos = groundY;
      this.currentFrame = 0;
      this.currentAnimFrames = [];
      this.blinkDelay = 0;
      this.animStartTime = 0;
      this.timer = 0;
      this.msPerFrame = 1000 / FPS;
      this.config = Trex.config;
      this.status = Trex.status.WAITING;
      this.jumping = false;
      this.jumpVelocity = 0;
      this.reachedMinHeight = false;
      this.speedDrop = false;
      this.jumpCount = 0;
      this.init();
    }

    Trex.config = {
      DROP_VELOCITY: -5,
      GRAVITY: 0.6,
      HEIGHT: 47,
      INITIAL_JUMP_VELOCITY: -10,
      INTRO_DURATION: 1500,
      MAX_JUMP_HEIGHT: 30,
      MIN_JUMP_HEIGHT: 30,
      SPEED_DROP_COEFFICIENT: 3,
      START_X_POS: 80,
      WIDTH: 44,
    };

    Trex.collisionBoxes = [
      new (CollisionBox as any)(1, -1, 30, 26),
      new (CollisionBox as any)(32, 0, 8, 16),
      new (CollisionBox as any)(10, 35, 14, 8),
      new (CollisionBox as any)(1, 24, 29, 5),
      new (CollisionBox as any)(5, 30, 21, 4),
      new (CollisionBox as any)(9, 34, 15, 4),
    ];

    Trex.status = {
      CRASHED: "CRASHED",
      JUMPING: "JUMPING",
      RUNNING: "RUNNING",
      WAITING: "WAITING",
    };

    Trex.BLINK_TIMING = 7000;
    Trex.animFrames = {
      WAITING: { frames: [44, 0], msPerFrame: 1000 / 3 },
      RUNNING: { frames: [88, 132], msPerFrame: 1000 / 12 },
      CRASHED: { frames: [220], msPerFrame: 1000 / 60 },
      JUMPING: { frames: [0], msPerFrame: 1000 / 60 },
    } as Record<string, any>;

    Trex.prototype = {
      init: function () {
        this.blinkDelay = this.setBlinkDelay();
        this.xPos = this.config.START_X_POS;
        this.yPos = this.groundYPos;
        this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;
        this.draw(0, 0);
        this.update(0, Trex.status.WAITING);
      },
      update: function (deltaTime: number, opt_status?: string) {
        this.timer += deltaTime;
        if (opt_status) {
          this.status = opt_status;
          this.currentFrame = 0;
          this.msPerFrame = (Trex.animFrames as Record<string, any>)[opt_status].msPerFrame;
          this.currentAnimFrames = (Trex.animFrames as Record<string, any>)[opt_status].frames;
          if (opt_status === Trex.status.WAITING) {
            this.animStartTime = getTimeStamp();
            this.setBlinkDelay();
          }
        }
        if (this.playingIntro && this.xPos < this.config.START_X_POS) {
          this.xPos += Math.round(
            (this.config.START_X_POS / this.config.INTRO_DURATION) * deltaTime
          );
        }
        if (this.status === Trex.status.WAITING) {
          this.blink(getTimeStamp());
        } else {
          this.draw(this.currentAnimFrames[this.currentFrame], 0);
        }
        if (this.timer >= this.msPerFrame) {
          this.currentFrame =
            this.currentFrame === this.currentAnimFrames.length - 1
              ? 0
              : this.currentFrame + 1;
          this.timer = 0;
        }
      },
      draw: function (x: number, y: number) {
        let sourceX = x;
        let sourceY = y;
        let sourceWidth = this.config.WIDTH;
        let sourceHeight = this.config.HEIGHT;
        if (IS_HIDPI) {
          sourceX *= 2;
          sourceY *= 2;
          sourceWidth *= 2;
          sourceHeight *= 2;
        }
        this.canvasCtx.drawImage(
          this.image,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          this.xPos,
          this.yPos,
          this.config.WIDTH,
          this.config.HEIGHT
        );
      },
      clear: function () {
        this.canvasCtx.clearRect(
          this.xPos,
          this.yPos,
          this.config.WIDTH,
          this.config.HEIGHT
        );
      },
      setBlinkDelay: function () {
        return Math.ceil(Math.random() * Trex.BLINK_TIMING);
      },
      blink: function (time: number) {
        const deltaTime = time - this.animStartTime;
        if (deltaTime >= this.blinkDelay) {
          this.clear();
          this.draw(this.currentAnimFrames[this.currentFrame], 0);
          if (this.currentFrame === 1) {
            this.blinkDelay = this.setBlinkDelay();
            this.animStartTime = time;
          }
        }
      },
      startJump: function () {
        if (!this.jumping) {
          this.update(0, Trex.status.JUMPING);
          this.jumpVelocity = this.config.INITIAL_JUMP_VELOCITY;
          this.jumping = true;
          this.reachedMinHeight = false;
          this.speedDrop = false;
        }
      },
      endJump: function () {
        if (
          this.reachedMinHeight &&
          this.jumpVelocity < this.config.DROP_VELOCITY
        ) {
          this.jumpVelocity = this.config.DROP_VELOCITY;
        }
      },
      updateJump: function (deltaTime: number, config: any) {
        const msPerFrame = (Trex.animFrames as Record<string, any>)[this.status].msPerFrame;
        const framesElapsed = deltaTime / msPerFrame;
        if (this.speedDrop) {
          this.yPos += Math.round(
            this.jumpVelocity *
              this.config.SPEED_DROP_COEFFICIENT *
              framesElapsed
          );
        } else {
          this.yPos += Math.round(this.jumpVelocity * framesElapsed);
        }
        this.jumpVelocity += this.config.GRAVITY * framesElapsed;
        if (this.yPos < this.minJumpHeight || this.speedDrop) {
          this.reachedMinHeight = true;
        }
        if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) {
          this.endJump();
        }
        if (this.yPos > this.groundYPos) {
          this.reset();
          this.jumpCount++;
        }
        this.update(deltaTime);
      },
      setSpeedDrop: function () {
        this.speedDrop = true;
        this.jumpVelocity = 1;
      },
      reset: function () {
        this.xPos = this.config.START_X_POS;
        this.yPos = this.groundYPos;
        this.jumpVelocity = 0;
        this.jumping = false;
        this.update(0, Trex.status.RUNNING);
        this.speedDrop = false;
      },
    };

    // --- CLOUD ---
    // @ts-ignore
    function Cloud(this: any, canvas: HTMLCanvasElement, cloudImg: HTMLImageElement, containerWidth: number) {
      this.canvas = canvas;
      this.canvasCtx = this.canvas.getContext("2d");
      this.image = cloudImg;
      this.containerWidth = containerWidth;
      this.xPos = containerWidth;
      this.yPos = 0;
      this.remove = false;
      this.cloudGap = getRandomNum(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP);
      this.init();
    }

    Cloud.config = {
      HEIGHT: 14,
      MAX_CLOUD_GAP: 400,
      MAX_SKY_LEVEL: 15,
      MIN_CLOUD_GAP: 100,
      MIN_SKY_LEVEL: 45,
      WIDTH: 46,
    };

    Cloud.prototype = {
      init: function () {
        this.yPos = getRandomNum(Cloud.config.MAX_SKY_LEVEL, Cloud.config.MIN_SKY_LEVEL);
        this.draw();
      },
      draw: function () {
        this.canvasCtx.save();
        let sourceWidth = Cloud.config.WIDTH;
        let sourceHeight = Cloud.config.HEIGHT;
        if (IS_HIDPI) {
          sourceWidth *= 2;
          sourceHeight *= 2;
        }
        this.canvasCtx.drawImage(
          this.image,
          0,
          0,
          sourceWidth,
          sourceHeight,
          this.xPos,
          this.yPos,
          Cloud.config.WIDTH,
          Cloud.config.HEIGHT
        );
        this.canvasCtx.restore();
      },
      update: function (speed: number) {
        if (!this.remove) {
          this.xPos -= Math.ceil(speed);
          this.draw();
          if (!this.isVisible()) {
            this.remove = true;
          }
        }
      },
      isVisible: function () {
        return this.xPos + Cloud.config.WIDTH > 0;
      },
    };

    // --- HORIZON LINE: Full width continuous tiling ---
    // @ts-ignore
    function HorizonLine(this: any, canvas: HTMLCanvasElement, bgImg: HTMLImageElement, groundY: number) {
      this.image = bgImg;
      this.canvas = canvas;
      this.canvasCtx = canvas.getContext("2d");
      this.dimensions = HorizonLine.dimensions;
      this.yPos = groundY;
      this.bumpThreshold = 0.5;
      this.xPos = [];
      this.sourceXPos = [];
      this.init();
    }

    HorizonLine.dimensions = {
      WIDTH: 600,
      HEIGHT: 12,
    };

    HorizonLine.prototype = {
      init: function () {
        // Tile enough segments to comfortably exceed canvas width
        const count = Math.ceil(this.canvas.width / this.dimensions.WIDTH) + 2;
        this.xPos = [];
        this.sourceXPos = [];
        for (let i = 0; i < count; i++) {
          this.xPos.push(i * this.dimensions.WIDTH);
          this.sourceXPos.push(this.getRandomType());
        }
        this.draw();
      },
      getRandomType: function () {
        return Math.random() > this.bumpThreshold ? this.dimensions.WIDTH : 0;
      },
      draw: function () {
        let sourceWidth = this.dimensions.WIDTH;
        let sourceHeight = this.dimensions.HEIGHT;
        if (IS_HIDPI) {
          sourceWidth *= 2;
          sourceHeight *= 2;
        }
        for (let i = 0; i < this.xPos.length; i++) {
          this.canvasCtx.drawImage(
            this.image,
            this.sourceXPos[i],
            0,
            sourceWidth,
            sourceHeight,
            this.xPos[i],
            this.yPos,
            this.dimensions.WIDTH,
            this.dimensions.HEIGHT
          );
        }
      },
      update: function (deltaTime: number, speed: number) {
        const increment = Math.floor(speed * (FPS / 1000) * deltaTime);
        for (let i = 0; i < this.xPos.length; i++) {
          this.xPos[i] -= increment;
        }
        for (let i = 0; i < this.xPos.length; i++) {
          if (this.xPos[i] <= -this.dimensions.WIDTH) {
            let maxX = this.xPos[0];
            for (let j = 1; j < this.xPos.length; j++) {
              if (this.xPos[j] > maxX) maxX = this.xPos[j];
            }
            this.xPos[i] = maxX + this.dimensions.WIDTH;
            this.sourceXPos[i] = this.getRandomType();
          }
        }
        this.draw();
      },
      reset: function () {
        for (let i = 0; i < this.xPos.length; i++) {
          this.xPos[i] = i * this.dimensions.WIDTH;
        }
      },
    };

    // --- HORIZON MANAGER ---
    // @ts-ignore
    function Horizon(this: any, canvas: HTMLCanvasElement, images: any, dimensions: any, gapCoefficient: number, groundY: number) {
      this.canvas = canvas;
      this.canvasCtx = canvas.getContext("2d");
      this.dimensions = dimensions;
      this.gapCoefficient = gapCoefficient;
      this.obstacles = [];
      this.clouds = [];
      this.cloudImg = images.CLOUD;
      this.cloudSpeed = 0.2;
      this.horizonImg = images.HORIZON;
      this.groundY = groundY;
      this.obstacleImgs = {
        CACTUS_SMALL: images.CACTUS_SMALL,
        CACTUS_LARGE: images.CACTUS_LARGE,
      };
      this.init();
    }

    Horizon.prototype = {
      init: function () {
        this.addCloud();
        this.horizonLine = new (HorizonLine as any)(
          this.canvas,
          this.horizonImg,
          this.groundY
        );
      },
      update: function (deltaTime: number, currentSpeed: number, updateObstacles: boolean) {
        this.horizonLine.update(deltaTime, currentSpeed);
        this.updateClouds(deltaTime, currentSpeed);
        if (updateObstacles) {
          this.updateObstacles(deltaTime, currentSpeed);
        }
      },
      updateClouds: function (deltaTime: number, speed: number) {
        const cloudSpeed = (this.cloudSpeed / 1000) * deltaTime * speed;
        for (let i = this.clouds.length - 1; i >= 0; i--) {
          this.clouds[i].update(cloudSpeed);
        }
        const lastCloud = this.clouds[this.clouds.length - 1];
        if (
          this.clouds.length < 6 &&
          this.dimensions.WIDTH - (lastCloud ? lastCloud.xPos : 0) >
            (lastCloud ? lastCloud.cloudGap : 100) &&
          0.5 > Math.random()
        ) {
          this.addCloud();
        }
        this.clouds = this.clouds.filter((obj: any) => !obj.remove);
      },
      updateObstacles: function (deltaTime: number, currentSpeed: number) {
        const updatedObstacles = this.obstacles.slice(0);
        for (let i = 0; i < this.obstacles.length; i++) {
          const obstacle = this.obstacles[i];
          obstacle.update(deltaTime, currentSpeed);
          if (obstacle.remove) {
            updatedObstacles.shift();
          }
        }
        this.obstacles = updatedObstacles;
        if (this.obstacles.length > 0) {
          const lastObstacle = this.obstacles[this.obstacles.length - 1];
          if (
            lastObstacle &&
            !lastObstacle.followingObstacleCreated &&
            lastObstacle.isVisible() &&
            lastObstacle.xPos + lastObstacle.width + lastObstacle.gap <
              this.dimensions.WIDTH
          ) {
            this.addNewObstacle(currentSpeed);
            lastObstacle.followingObstacleCreated = true;
          }
        } else {
          this.addNewObstacle(currentSpeed);
        }
      },
      addNewObstacle: function (currentSpeed: number) {
        const obstacleTypeIndex = getRandomNum(0, Obstacle.types.length - 1);
        const obstacleType = Obstacle.types[obstacleTypeIndex];
        const obstacleImg = this.obstacleImgs[obstacleType.type];
        this.obstacles.push(
          new (Obstacle as any)(
            this.canvasCtx,
            obstacleType,
            obstacleImg,
            this.dimensions,
            this.gapCoefficient,
            currentSpeed,
            this.groundY
          )
        );
      },
      reset: function () {
        this.obstacles = [];
        this.horizonLine.reset();
      },
      addCloud: function () {
        this.clouds.push(
          new (Cloud as any)(this.canvas, this.cloudImg, this.dimensions.WIDTH)
        );
      },
    };

    // --- DISTANCE METER ---
    // @ts-ignore
    function DistanceMeter(this: any, canvas: HTMLCanvasElement, spriteSheet: HTMLImageElement, canvasWidth: number) {
      this.canvas = canvas;
      this.canvasCtx = canvas.getContext("2d");
      this.image = spriteSheet;
      this.x = 0;
      this.y = 8;
      this.currentDistance = 0;
      this.maxScore = 0;
      this.highScore = 0;
      this.digits = [];
      this.achievement = false;
      this.defaultString = "";
      this.flashTimer = 0;
      this.flashIterations = 0;
      this.config = {
        MAX_DISTANCE_UNITS: 5,
        ACHIEVEMENT_DISTANCE: 100,
        COEFFICIENT: 0.025,
        FLASH_DURATION: 1000 / 4,
        FLASH_ITERATIONS: 3,
      };
      this.init(canvasWidth);
    }

    DistanceMeter.dimensions = { WIDTH: 10, HEIGHT: 13, DEST_WIDTH: 11 };

    DistanceMeter.prototype = {
      init: function (width: number) {
        let maxDistanceStr = "";
        this.calcXPos(width);
        for (let i = 0; i < this.config.MAX_DISTANCE_UNITS; i++) {
          this.draw(i, 0);
          this.defaultString += "0";
          maxDistanceStr += "9";
        }
        this.maxScore = parseInt(maxDistanceStr);
      },
      calcXPos: function (canvasWidth: number) {
        this.x =
          canvasWidth -
          DistanceMeter.dimensions.DEST_WIDTH *
            (this.config.MAX_DISTANCE_UNITS + 2);
      },
      draw: function (digitPos: number, value: number, opt_highScore?: boolean) {
        let sourceWidth = DistanceMeter.dimensions.WIDTH;
        let sourceHeight = DistanceMeter.dimensions.HEIGHT;
        let sourceX = DistanceMeter.dimensions.WIDTH * value;
        const targetX = digitPos * DistanceMeter.dimensions.DEST_WIDTH;
        const targetY = this.y;
        if (IS_HIDPI) {
          sourceWidth *= 2;
          sourceHeight *= 2;
          sourceX *= 2;
        }
        this.canvasCtx.save();
        if (opt_highScore) {
          const highScoreX =
            this.x -
            this.config.MAX_DISTANCE_UNITS *
              2 *
              DistanceMeter.dimensions.WIDTH;
          this.canvasCtx.translate(highScoreX, this.y);
        } else {
          this.canvasCtx.translate(this.x, this.y);
        }
        this.canvasCtx.drawImage(
          this.image,
          sourceX,
          0,
          sourceWidth,
          sourceHeight,
          targetX,
          targetY,
          DistanceMeter.dimensions.WIDTH,
          DistanceMeter.dimensions.HEIGHT
        );
        this.canvasCtx.restore();
      },
      getActualDistance: function (distance: number) {
        return distance ? Math.round(distance * this.config.COEFFICIENT) : 0;
      },
      update: function (deltaTime: number, distance: number) {
        let paint = true;
        let playSound = false;
        if (!this.achievement) {
          distance = this.getActualDistance(distance);
          if (distance > 0) {
            if (distance % this.config.ACHIEVEMENT_DISTANCE === 0) {
              this.achievement = true;
              this.flashTimer = 0;
              playSound = true;
            }
            const distanceStr = (this.defaultString + distance).substr(
              -this.config.MAX_DISTANCE_UNITS
            );
            this.digits = distanceStr.split("");
          } else {
            this.digits = this.defaultString.split("");
          }
        } else {
          if (this.flashIterations <= this.config.FLASH_ITERATIONS) {
            this.flashTimer += deltaTime;
            if (this.flashTimer < this.config.FLASH_DURATION) {
              paint = false;
            } else if (this.flashTimer > this.config.FLASH_DURATION * 2) {
              this.flashTimer = 0;
              this.flashIterations++;
            }
          } else {
            this.achievement = false;
            this.flashIterations = 0;
            this.flashTimer = 0;
          }
        }
        if (paint) {
          for (let i = this.digits.length - 1; i >= 0; i--) {
            this.draw(i, parseInt(this.digits[i]));
          }
        }
        this.drawHighScore();
        return playSound;
      },
      drawHighScore: function () {
        this.canvasCtx.save();
        this.canvasCtx.globalAlpha = 0.6;
        for (let i = this.highScore.length - 1; i >= 0; i--) {
          this.draw(i, parseInt(this.highScore[i], 10), true);
        }
        this.canvasCtx.restore();
      },
      setHighScore: function (distance: number) {
        distance = this.getActualDistance(distance);
        const highScoreStr = (this.defaultString + distance).substr(
          -this.config.MAX_DISTANCE_UNITS
        );
        this.highScore = ["10", "11", ""].concat(highScoreStr.split(""));
      },
      reset: function () {
        this.update(0, 0);
        this.achievement = false;
      },
    };

    // --- GAME OVER PANEL ---
    // @ts-ignore
    function GameOverPanel(this: any, canvas: HTMLCanvasElement, textSprite: HTMLImageElement, restartImg: HTMLImageElement, dimensions: any) {
      this.canvas = canvas;
      this.canvasCtx = canvas.getContext("2d");
      this.canvasDimensions = dimensions;
      this.textSprite = textSprite;
      this.restartImg = restartImg;
      this.draw();
    }

    GameOverPanel.dimensions = {
      TEXT_X: 0,
      TEXT_Y: 13,
      TEXT_WIDTH: 191,
      TEXT_HEIGHT: 11,
      RESTART_WIDTH: 36,
      RESTART_HEIGHT: 32,
    };

    GameOverPanel.prototype = {
      updateDimensions: function (width: number, opt_height?: number) {
        this.canvasDimensions.WIDTH = width;
        if (opt_height) this.canvasDimensions.HEIGHT = opt_height;
      },
      draw: function () {
        const dimensions = GameOverPanel.dimensions;
        const centerX = this.canvasDimensions.WIDTH / 2;
        let textSourceX = dimensions.TEXT_X;
        let textSourceY = dimensions.TEXT_Y;
        let textSourceWidth = dimensions.TEXT_WIDTH;
        let textSourceHeight = dimensions.TEXT_HEIGHT;
        const textTargetX = Math.round(centerX - dimensions.TEXT_WIDTH / 2);
        const textTargetY = Math.round((this.canvasDimensions.HEIGHT - 25) / 3.5);
        let restartSourceWidth = dimensions.RESTART_WIDTH;
        let restartSourceHeight = dimensions.RESTART_HEIGHT;
        const restartTargetX = centerX - dimensions.RESTART_WIDTH / 2;
        const restartTargetY = this.canvasDimensions.HEIGHT / 2.2;
        if (IS_HIDPI) {
          textSourceY *= 2;
          textSourceX *= 2;
          textSourceWidth *= 2;
          textSourceHeight *= 2;
          restartSourceWidth *= 2;
          restartSourceHeight *= 2;
        }
        this.canvasCtx.drawImage(
          this.textSprite,
          textSourceX,
          textSourceY,
          textSourceWidth,
          textSourceHeight,
          textTargetX,
          textTargetY,
          dimensions.TEXT_WIDTH,
          dimensions.TEXT_HEIGHT
        );
        this.canvasCtx.drawImage(
          this.restartImg,
          0,
          0,
          restartSourceWidth,
          restartSourceHeight,
          restartTargetX,
          restartTargetY,
          dimensions.RESTART_WIDTH,
          dimensions.RESTART_HEIGHT
        );
      },
    };

    // --- MAIN RUNNER CLASS ---
    // @ts-ignore
    function Runner(this: any, outerContainer: HTMLElement) {
      this.outerContainerEl = outerContainer;
      this.dimensions = {
        WIDTH: outerContainer.offsetWidth || 800,
        HEIGHT: height,
      };
      // Ground placement: 24px from bottom
      this.groundYPos = this.dimensions.HEIGHT - 24;
      this.canvas = null;
      this.canvasCtx = null;
      this.tRex = null;
      this.distanceMeter = null;
      this.distanceRan = 0;
      this.highestScore = 0;
      this.time = 0;
      this.runningTime = 0;
      this.msPerFrame = 1000 / FPS;
      this.currentSpeed = 6;
      this.started = false;
      this.activated = false;
      this.crashed = false;
      this.paused = false;
      this.audioContext = null;
      this.soundFx = {};
      this.images = {};
      this.imagesLoaded = 0;
      this.config = {
        ACCELERATION: 0.001,
        CLEAR_TIME: 3000,
        GAP_COEFFICIENT: 0.6,
        GAMEOVER_CLEAR_TIME: 750,
        MAX_SPEED: 13,
        SPEED: 6,
      };
      this.loadImages();
    }

    Runner.prototype = {
      loadImages: function () {
        const srcSet = IS_HIDPI ? DINO_IMAGES.HDPI : DINO_IMAGES.LDPI;
        const keys = Object.keys(srcSet) as (keyof typeof srcSet)[];
        let remaining = keys.length;
        keys.forEach((key) => {
          const img = new Image();
          img.src = srcSet[key];
          this.images[key] = img;
          img.onload = () => {
            remaining--;
            if (remaining === 0 && !isDisposed) {
              this.init();
            }
          };
        });
      },
      initAudio: function () {
        if (this.audioContext) return;
        try {
          // @ts-ignore
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) return;
          this.audioContext = new AudioContextClass();
        } catch {
          // Audio initialization failover
        }
      },
      loadSounds: function () {
        this.initAudio();
      },
      playSound: function (soundName: string) {
        try {
          if (!this.audioContext) {
            this.initAudio();
          }
          if (!this.audioContext) return;
          if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
          }
          const ctx = this.audioContext;
          const now = ctx.currentTime;

          if (soundName === "BUTTON_PRESS") {
            // Authentic 8-bit jump chirp: square wave ascending from 380Hz to 820Hz
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "square";
            osc.frequency.setValueAtTime(380, now);
            osc.frequency.exponentialRampToValueAtTime(820, now + 0.08);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.085);
          } else if (soundName === "HIT") {
            // Authentic 8-bit crash crunch: descending pitch with rapid decay
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(35, now + 0.14);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.145);
          } else if (soundName === "SCORE") {
            // Authentic milestone high beep pair
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "square";
            osc1.frequency.setValueAtTime(640, now);
            gain1.gain.setValueAtTime(0.1, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.075);

            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "square";
            osc2.frequency.setValueAtTime(860, now + 0.085);
            gain2.gain.setValueAtTime(0.1, now + 0.085);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.165);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.085);
            osc2.stop(now + 0.17);
          }
        } catch {
          // Audio playback failover
        }
      },
      init: function () {
        this.dimensions.WIDTH = this.outerContainerEl.offsetWidth || 800;
        this.canvas = document.createElement("canvas");
        this.canvas.className = "w-full h-full block";
        this.canvas.width = this.dimensions.WIDTH;
        this.canvas.height = this.dimensions.HEIGHT;
        this.canvasCtx = this.canvas.getContext("2d");
        this.outerContainerEl.appendChild(this.canvas);
        this.updateCanvasScaling();

        this.horizon = new (Horizon as any)(
          this.canvas,
          this.images,
          this.dimensions,
          this.config.GAP_COEFFICIENT,
          this.groundYPos
        );
        this.distanceMeter = new (DistanceMeter as any)(
          this.canvas,
          this.images.TEXT_SPRITE,
          this.dimensions.WIDTH
        );
        this.tRex = new (Trex as any)(
          this.canvas,
          this.images.TREX,
          this.groundYPos - Trex.config.HEIGHT
        );

        this.startListening();
        this.update();
        this.onResize = this.debounceResize.bind(this);
        window.addEventListener("resize", this.onResize);
      },
      updateCanvasScaling: function () {
        const context = this.canvasCtx;
        const devicePixelRatio = Math.floor(window.devicePixelRatio) || 1;
        // @ts-ignore
        const backingStoreRatio = context.webkitBackingStorePixelRatio || 1;
        const ratio = devicePixelRatio / backingStoreRatio;
        if (devicePixelRatio !== backingStoreRatio) {
          const oldWidth = this.dimensions.WIDTH;
          const oldHeight = this.dimensions.HEIGHT;
          this.canvas.width = oldWidth * ratio;
          this.canvas.height = oldHeight * ratio;
          this.canvas.style.width = oldWidth + "px";
          this.canvas.style.height = oldHeight + "px";
          context.scale(ratio, ratio);
        }
      },
      debounceResize: function () {
        if (this.resizeTimerId) clearTimeout(this.resizeTimerId);
        this.resizeTimerId = setTimeout(this.adjustDimensions.bind(this), 150);
      },
      adjustDimensions: function () {
        if (!this.canvas || isDisposed) return;
        this.dimensions.WIDTH = this.outerContainerEl.offsetWidth;
        this.canvas.width = this.dimensions.WIDTH;
        this.canvas.height = this.dimensions.HEIGHT;
        this.updateCanvasScaling();
        this.distanceMeter.calcXPos(this.dimensions.WIDTH);
        this.clearCanvas();
        this.horizon.update(0, 0, true);
        this.tRex.update(0);
        if (this.crashed && this.gameOverPanel) {
          this.gameOverPanel.updateDimensions(this.dimensions.WIDTH);
          this.gameOverPanel.draw();
        }
      },
      clearCanvas: function () {
        this.canvasCtx.clearRect(
          0,
          0,
          this.dimensions.WIDTH,
          this.dimensions.HEIGHT
        );
      },
      update: function () {
        if (isDisposed) return;
        this.drawPending = false;
        const now = getTimeStamp();
        const deltaTime = now - (this.time || now);
        this.time = now;

        if (this.activated) {
          this.clearCanvas();
          if (this.tRex.jumping) {
            this.tRex.updateJump(deltaTime, this.config);
          }
          this.runningTime += deltaTime;
          const hasObstacles = this.runningTime > this.config.CLEAR_TIME;

          if (this.tRex.jumpCount === 1 && !this.playingIntro) {
            this.playIntro();
          }

          if (this.playingIntro) {
            this.horizon.update(0, this.currentSpeed, hasObstacles);
          } else {
            const dt = !this.started ? 0 : deltaTime;
            this.horizon.update(dt, this.currentSpeed, hasObstacles);
          }

          const collision =
            hasObstacles &&
            checkForCollision(this.horizon.obstacles[0], this.tRex);

          if (!collision) {
            this.distanceRan +=
              (this.currentSpeed * deltaTime) / this.msPerFrame;
            if (this.currentSpeed < this.config.MAX_SPEED) {
              this.currentSpeed += this.config.ACCELERATION;
            }
          } else {
            this.gameOver();
          }

          if (
            this.distanceMeter.getActualDistance(this.distanceRan) >
            this.distanceMeter.maxScore
          ) {
            this.distanceRan = 0;
          }
          const playAchievementSound = this.distanceMeter.update(
            deltaTime,
            Math.ceil(this.distanceRan)
          );
          if (playAchievementSound) {
            this.playSound("SCORE");
          }
        }

        if (!this.crashed) {
          this.tRex.update(deltaTime);
          this.raqId = requestAnimationFrame(this.update.bind(this));
        }
      },
      playIntro: function () {
        if (!this.started && !this.crashed) {
          this.playingIntro = false;
          this.tRex.playingIntro = false;
          this.tRex.xPos = Trex.config.START_X_POS;
          this.activated = true;
          this.started = true;
          this.runningTime = 0;
        }
      },
      gameOver: function () {
        this.playSound("HIT");
        this.crashed = true;
        this.activated = false;
        cancelAnimationFrame(this.raqId);
        this.tRex.update(100, Trex.status.CRASHED);
        this.gameOverPanel = new (GameOverPanel as any)(
          this.canvas,
          this.images.TEXT_SPRITE,
          this.images.RESTART,
          this.dimensions
        );
        if (this.distanceRan > this.highestScore) {
          this.highestScore = Math.ceil(this.distanceRan);
          this.distanceMeter.setHighScore(this.highestScore);
        }
        this.time = getTimeStamp();
      },
      restart: function () {
        this.runningTime = 0;
        this.activated = true;
        this.crashed = false;
        this.distanceRan = 0;
        this.currentSpeed = this.config.SPEED;
        this.time = getTimeStamp();
        this.clearCanvas();
        this.distanceMeter.reset();
        this.horizon.reset();
        this.tRex.reset();
        this.playSound("BUTTON_PRESS");
        this.update();
      },
      onKeyDown: function (e: KeyboardEvent) {
        // Prevent interfering with input/textarea elements
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;

        const isJump = e.code === "Space" || e.code === "ArrowUp" || e.keyCode === 32 || e.keyCode === 38;
        const isDuck = e.code === "ArrowDown" || e.keyCode === 40;
        const isRestart = e.code === "Enter" || e.keyCode === 13;

        if (isJump) {
          e.preventDefault();
          if (!this.activated) {
            this.loadSounds();
            this.activated = true;
          }
          if (this.crashed) {
            this.restart();
          } else if (!this.tRex.jumping) {
            this.playSound("BUTTON_PRESS");
            this.tRex.startJump();
          }
        } else if (isDuck && this.tRex.jumping) {
          e.preventDefault();
          this.tRex.setSpeedDrop();
        } else if (this.crashed && isRestart) {
          e.preventDefault();
          this.restart();
        }
      },
      onKeyUp: function (e: KeyboardEvent) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;

        const isJump = e.code === "Space" || e.code === "ArrowUp" || e.keyCode === 32 || e.keyCode === 38;
        const isDuck = e.code === "ArrowDown" || e.keyCode === 40;

        if (isJump && this.activated && !this.crashed) {
          this.tRex.endJump();
        } else if (isDuck) {
          this.tRex.speedDrop = false;
        }
      },
      onActionTrigger: function (e: Event) {
        e.preventDefault();
        if (!this.activated) {
          this.loadSounds();
          this.activated = true;
        }
        if (this.crashed) {
          this.restart();
        } else if (!this.tRex.jumping) {
          this.playSound("BUTTON_PRESS");
          this.tRex.startJump();
        }
      },
      startListening: function () {
        this.boundKeyDown = this.onKeyDown.bind(this);
        this.boundKeyUp = this.onKeyUp.bind(this);
        this.boundAction = this.onActionTrigger.bind(this);

        document.addEventListener("keydown", this.boundKeyDown);
        document.addEventListener("keyup", this.boundKeyUp);
        this.outerContainerEl.addEventListener("mousedown", this.boundAction);
        this.outerContainerEl.addEventListener("touchstart", this.boundAction, { passive: false });
      },
      stopListening: function () {
        document.removeEventListener("keydown", this.boundKeyDown);
        document.removeEventListener("keyup", this.boundKeyUp);
        this.outerContainerEl.removeEventListener("mousedown", this.boundAction);
        this.outerContainerEl.removeEventListener("touchstart", this.boundAction);
        if (this.onResize) window.removeEventListener("resize", this.onResize);
        if (this.resizeTimerId) clearTimeout(this.resizeTimerId);
        cancelAnimationFrame(this.raqId);
        if (this.audioContext) {
          this.audioContext.close().catch(() => {});
        }
      },
    };

    const runner = new (Runner as any)(container);
    runnerRef.current = runner;

    return () => {
      isDisposed = true;
      if (runnerRef.current) {
        runnerRef.current.stopListening();
      }
    };
  }, [height]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none cursor-pointer ${className}`}
      style={{ height: `${height}px` }}
      aria-label="Chrome Dino Runner Game. Press Space or Click to Jump."
      role="region"
    />
  );
}
