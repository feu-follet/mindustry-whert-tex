const Vertex = extendContent(ArtilleryTurret, "vertex", {
    playerPlaced(tile) {
        this.spots[tile.x + "," + tile.y] = tile.pos();
    },
    configured(tile, player, value) {
        this.spots[tile.x + "," + tile.y] = value;
    },
    drawConfigure(tile){
        Draw.color(Pal.accent);
        Lines.stroke(2.0);
        Lines.dashCircle(tile.drawx(), tile.drawy(), this.range);
        
        if(this.spots[tile.x + "," + tile.y] === undefined) {
            this.spots[tile.x + "," + tile.y] = tile.pos();
        }
        var spotTile = Vars.world.tile(this.spots[tile.x + "," + tile.y]);
        
        Drawf.dashCircle(spotTile.drawx(), spotTile.drawy(), this.spotRadius, tile.getTeam().color);
        
        Draw.color(tile.getTeam().color);
        var size = 6 + Mathf.absin(Time.time(), 4, 2)
        Lines.line(
            spotTile.drawx() - size, 
            spotTile.drawy() - size,
            spotTile.drawx() + size, 
            spotTile.drawy() + size
        )
        Lines.line(
            spotTile.drawx() - size, 
            spotTile.drawy() + size,
            spotTile.drawx() + size, 
            spotTile.drawy() - size
        )
        Draw.reset();
    },
    drawSelect(tile) {
        // Only draw firing spot
        Lines.stroke(2.0);
        
        if(this.spots[tile.x + "," + tile.y] === undefined) {
            this.spots[tile.x + "," + tile.y] = tile.pos();
        }
        var spotTile = Vars.world.tile(this.spots[tile.x + "," + tile.y]);
        
        Drawf.dashCircle(spotTile.drawx(), spotTile.drawy(), this.spotRadius, tile.getTeam().color);
        
        Draw.color(tile.getTeam().color);
        var size = 6 + Mathf.absin(Time.time(), 4, 2)
        Lines.line(
            spotTile.drawx() - size, 
            spotTile.drawy() - size,
            spotTile.drawx() + size, 
            spotTile.drawy() + size
        )
        Lines.line(
            spotTile.drawx() - size, 
            spotTile.drawy() + size,
            spotTile.drawx() + size, 
            spotTile.drawy() - size
        )
        Draw.reset();
    },
    onConfigureTileTapped(tile, other) {
        if(Math.pow(other.x - tile.x, 2) + Math.pow(other.y - tile.y, 2) > Math.pow((this.range - this.spotRadius) / Vars.tilesize, 2)) return true;
        if (this.spots[tile.x + "," + tile.y] === other.pos()) return true;
        tile.configure(other.pos());
        return false;
    },
    findTarget(tile) {
        entity = tile.ent();
        
        if(this.spots[tile.x + "," + tile.y] === undefined) {
            this.spots[tile.x + "," + tile.y] = tile.pos();
        }
        var spotTile = Vars.world.tile(this.spots[tile.x + "," + tile.y]);
        
        if (spotTile.block() != Blocks.air && spotTile.getTeam() != tile.getTeam()) entity.target = spotTile 
        else entity.target = Units.closestTarget(tile.getTeam(), spotTile.drawx(), spotTile.drawy(), this.spotRadius, boolf((e) => {return !e.isDead() && !e.isFlying()}));
    }
});

Vertex.spotRadius = 96;
Vertex.spots = {};
