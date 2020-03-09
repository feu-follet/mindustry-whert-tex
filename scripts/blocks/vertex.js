const Vertex = extendContent(ArtilleryTurret, "vertex", {
    playerPlaced(tile) {
        this.spots[tile.x + "," + tile.y] = tile.pos();
    },
    
    configured(tile, player, value) {
        this.spots[tile.x + "," + tile.y] = value;
    },
    
    drawConfigure(tile){
        Draw.color(Pal.accent);
        Lines.stroke(1.0);
        Lines.dashCircle(tile.drawx(), tile.drawy(), this.range);
        
        if(this.spots[tile.x + "," + tile.y] === undefined) {
            this.spots[tile.x + "," + tile.y] = tile.pos();
        }
        var spotTile = Vars.world.tile(this.spots[tile.x + "," + tile.y]);
        var size = 6 + Mathf.absin(Time.time(), 4, 2)
        
        var dx = tile.drawx() - spotTile.drawx();
        var dy = tile.drawy() - spotTile.drawy();
        var turretCircleRadius = (tile.block().size / 2 + 1) * Vars.tilesize + Mathf.absin(Time.time(), 6, 1) - 2
        var isTurretOutOfItsSpot = Math.pow(dx, 2) + Math.pow(dy, 2) >= Math.pow(this.spotRadius + turretCircleRadius, 2)
        //Calculate coords of the line connecting turret with firing spot
        
        if (isTurretOutOfItsSpot) {
            var normalisationQuotient = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            var startX = tile.drawx() - dx / normalisationQuotient * turretCircleRadius;
            var startY = tile.drawy() - dy / normalisationQuotient * turretCircleRadius;
            var endX = spotTile.drawx() + dx / normalisationQuotient * this.spotRadius;
            var endY = spotTile.drawy() + dy / normalisationQuotient * this.spotRadius;
        }
        
        Lines.stroke(3.0);
        Draw.color(Pal.gray);
        if(isTurretOutOfItsSpot) Lines.dashLine(
            startX,
            startY,
            endX,
            endY,
            Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)) - turretCircleRadius - this.spotRadius) / 8
        )
        
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
     
        Lines.stroke(1.0);
        Draw.color(tile.getTeam().color);
        if(isTurretOutOfItsSpot) Lines.dashLine(
            startX,
            startY,
            endX,
            endY,
            Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)) - turretCircleRadius - this.spotRadius) / 8
        )
        
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
        
        Drawf.dashCircle(spotTile.drawx(), spotTile.drawy(), this.spotRadius, tile.getTeam().color);
        Drawf.circles(tile.drawx(), tile.drawy(), turretCircleRadius, tile.getTeam().color);
        
        Draw.reset();
    },
    
    drawSelect(tile) {
        // Only draw firing spot
        Lines.stroke(1.0);
        
        if(this.spots[tile.x + "," + tile.y] === undefined) {
            this.spots[tile.x + "," + tile.y] = tile.pos();
        }
        var spotTile = Vars.world.tile(this.spots[tile.x + "," + tile.y]);
        var size = 6 + Mathf.absin(Time.time(), 4, 2)
        
        Lines.stroke(3.0);
        Draw.color(Pal.gray);
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
        
        Lines.stroke(1.0);
        Draw.color(tile.getTeam().color);
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
        
        Drawf.dashCircle(spotTile.drawx(), spotTile.drawy(), this.spotRadius, tile.getTeam().color);
        
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
