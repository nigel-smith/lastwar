function calculate() {
    const tier = document.getElementById('heroTier').value;
    const currentStar = parseInt(document.getElementById('currStar').value);
    const currentDot = parseInt(document.getElementById('currDot').value);
    const targetStar = parseInt(document.getElementById('targetStar').value);
    const targetDot = parseInt(document.getElementById('targetDot').value);
    const userShards = parseInt(document.getElementById('userShards').value) || 0;
    const trainingLevel = parseInt(document.getElementById('trainingLevel').value) || 0;
    const userExp = parseInt(document.getElementById('userExp').value) || 0;

    const baseCost = (tier === "UR") ? {2: 5, 3: 10, 4: 20, 5: 30} : {2: 2, 3: 5, 4: 10, 5: 15};
    
    function getCumulativeShards(star, dot) {
        let total = 0;
        for (let s = 2; s <= 5; s++) {
            const costPerDot = baseCost[s];
            const dotsInThisStar = (s === star) ? dot : (s < star ? 5 : 0);
            total += dotsInThisStar * costPerDot;
        }
        return total;
    }

    const currentTotal = getCumulativeShards(currentStar, currentDot);
    const targetTotal = getCumulativeShards(targetStar, targetDot);
    let shardsNeeded = targetTotal - currentTotal;
    if (shardsNeeded < 0) shardsNeeded = 0;

    document.getElementById('shardsRequired').innerText = shardsNeeded;

    const shardStatusEl = document.getElementById('shardStatus');
    if (userShards >= shardsNeeded) {
        shardStatusEl.innerText = " Ready (+" + (userShards - shardsNeeded) + " Extra)";
        shardStatusEl.className = "font-bold text-emerald-400";
    } else {
        shardStatusEl.innerText = " Need " + (shardsNeeded - userShards) + " More";
        shardStatusEl.className = "font-bold text-rose-400";
    }

    const maxHeroCap = 15 + (trainingLevel * 5);
    document.getElementById('maxBuildingCap').innerText = "Lv " + maxHeroCap;

    let predictedLevel = 110; 
    let expLeft = userExp;
    
    while (expLeft > 0 && predictedLevel < maxHeroCap) {
        let costForNextLevel = 25; 
        if (predictedLevel >= 110) costForNextLevel = 45;
        if (predictedLevel >= 120) costForNextLevel = 75;
        
        if (expLeft >= costForNextLevel) {
            expLeft -= costForNextLevel;
            predictedLevel++;
        } else {
            break;
        }
    }
    document.getElementById('predictedLevel').innerText = "Lv " + predictedLevel;

    const alertEl = document.getElementById('calculatorAlert');
    if (predictedLevel >= maxHeroCap) {
        alertEl.innerText = "⚠️ Level cap ceiling reached! Upgrade your Hero Training Grounds building map level to invest further EXP.";
        alertEl.className = "p-3 rounded-lg text-xs bg-amber-950/40 border border-amber-500/30 text-amber-300";
    } else if (userShards >= shardsNeeded) {
        alertEl.innerText = "✅ Upgrade plan viable! Star threshold met. Hold deployments safely until Thursday VS initialization.";
        alertEl.className = "p-3 rounded-lg text-xs bg-emerald-950/40 border border-emerald-500/30 text-emerald-300";
    } else {
        alertEl.innerText = "ℹ️ Star upgrade path requires more shards. Farm Campaign store reset brackets to balance requirements.";
        alertEl.className = "p-3 rounded-lg text-xs bg-slate-950 border border-slate-800 text-slate-400";
    }
}

window.onload = calculate;
