addLayer("p", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#fcfcfc",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "points", // Name of prestige currency
    baseResource: "point fragments", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
      let mult = new Decimal(1)
      if (hasUpgrade('p', 14)) mult = mult.times(upgradeEffect('p', 14))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
      11: {
        title: "Starter Upgrade",
        description: "Start your journey, doubles point fragment gain.",
        cost: new Decimal(1),
      },
      12: {
        title: "Starter Upgrade 2: electric boogaloo",
        description: "Doubles point fragment gain...again.",
        cost: new Decimal(2),
        unlocked() { return hasUpgrade('p', 11) }
      },
      13: {
        title: "Starter Synergy",
        description: "Classic one,Points boost PF!",
        cost: new Decimal(5),
        unlocked() { return hasUpgrade('p', 12) }
        ,
        effect() {
            return player[this.layer].points.add(1).pow(0.5)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
      },
      14: {
        title: "Self Synergy",
        description: "Points boost themselves!",
        cost: new Decimal(20),
        unlocked() { return hasUpgrade('p', 13) }
        ,
        effect() {
            return player[this.layer].points.add(1).pow(0.2)
        },
        effectDisplay() { return format(upgradeEffect(this.layer, this.id))+"x" },
      },
      15: {
        title: "First Unlock",
        description: "Triple PF and unlock a new buyable",
        cost: new Decimal(100),
        unlocked() { return hasUpgrade('p', 14) }
      },
    },
    buyables: {
      11: {
        title: "Point Fragment Booster",
        description: "Doubles point fragment gain.",
        cost: new Decimal(250).times(getBuyableAmount('p', 11).add(1).pow(3)),
        costDisplay() { return format(this.cost) + " point fragments" },
        unlocked() { return hasUpgrade('p', 15) }
      },
    },
})
