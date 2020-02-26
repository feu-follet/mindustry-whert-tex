const discharge = new PowerTurret("discharge");

discharge.shootType = extend(BasicBulletType, {
    draw(b) { },

    init(b){
        if (b == null) return;
        const amount = 2 + Math.floor(Math.random() * 4)
        const damagePerOne = this.damage / amount;
        for (var i = 0; i != amount; ++i) {
            Lightning.create(b.getTeam(), Pal.lancerLaser, damagePerOne, b.x, b.y, b.rot(), 40 + Math.floor(Math.random() * 21));
        };
    }
});

discharge.shootType.lifetime = 1;
discharge.shootType.damage = 180;
discharge.shootType.despawnEffect = Fx.none;
discharge.shootType.hitEffect = Fx.hitLancer;
