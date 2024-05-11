class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 3500*SCALE;
        this.DRAG = 3500*SCALE;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1000*SCALE;
        this.JUMP_VELOCITY = -500*SCALE;
        this.MAX_SPEED = 175*SCALE;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        // this.map = this.add.tilemap("platformer-level-1", 18, 18, 45, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        // this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        
        this.map = this.add.tilemap("dungeontileset", 16, 16, 80, 25);
        this.tileset = this.map.addTilesetImage("dungeontileset", "DungeonTileSet");

        // Create a layer
        // this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        
        this.bgLayer = this.map.createLayer("background", this.tileset, 0, 0);
        this.bgLayer.setScale(SCALE);
        this.groundLayer = this.map.createLayer("ground", this.tileset, 0, 0);
        this.groundLayer.setScale(SCALE);
        this.propsLayer = this.map.createLayer("props", this.tileset, 0, 0);
        this.propsLayer.setScale(SCALE);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(game.config.width/4, game.config.height/2, "platformer_characters", "tile_0000.png").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        this.input.keyboard.on('keydown-R', () => {
            this.scene.start("platformerScene");
        }, this);
    }

    update() {
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            if(my.sprite.player.body.velocity.x < -this.MAX_SPEED) my.sprite.player.setVelocity(-this.MAX_SPEED,my.sprite.player.body.velocity.y);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            if(my.sprite.player.body.velocity.x > this.MAX_SPEED) my.sprite.player.setVelocity(this.MAX_SPEED,my.sprite.player.body.velocity.y);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

        }

        console.log(this.propsLayer.getTileAtWorldXY(my.sprite.player.x,my.sprite.player.y));
        var propTile = this.propsLayer.getTileAtWorldXY(my.sprite.player.x,my.sprite.player.y);
        if(propTile != null && propTile.properties.death){
            this.scene.start("platformerScene");
        }
    }
}