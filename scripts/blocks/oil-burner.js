const oilBurner = extendContent(BurnerGenerator, "oil-burner", {
    getItemEfficiency(item){
        return 0.0;
    },

    getLiquidEfficiency(liquid){
        return 1.0;
    }
})
