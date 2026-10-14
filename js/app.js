const LS="glusense_demo_readings_v2", STEPS_KEY="glusense_demo_steps_v1";
const seed=[{value:108,time:"10:42 AM",meal:"Breakfast",source:"Seed demo"},{value:96,time:"08:15 AM",meal:"Before meal",source:"Seed demo"},{value:102,time:"06:30 AM",meal:"Before meal",source:"Seed demo"},{value:124,time:"Yesterday · 11:45 PM",meal:"Dinner",source:"Seed demo"}];
const $=id=>document.getElementById(id);
function getReadings(){try{const x=JSON.parse(localStorage.getItem(LS));return Array.isArray(x)&&x.length?x:seed}catch(e){return seed}}
function saveReadings(x){try{localStorage.setItem(LS,JSON.stringify(x.slice(0,100)))}catch(e){}}
function avg(a){return Math.round(a.reduce((s,x)=>s+Number(x.value||0),0)/Math.max(1,a.length))}
function status(v){return v<70?"Below common reference threshold":v<=140?"Within broad demo reference":"Above broad demo reference"}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function drawChart(canvas,data){if(!canvas)return;const dpr=window.devicePixelRatio||1,r=canvas.getBoundingClientRect(),w=Math.max(280,r.width),h=Math.max(200,r.height);canvas.width=w*dpr;canvas.height=h*dpr;const c=canvas.getContext("2d");c.scale(dpr,dpr);c.clearRect(0,0,w,h);const pad={l:42,r:18,t:20,b:30},vals=data.map(x=>Number(x.value)),min=Math.min(60,...vals)-5,max=Math.max(160,...vals)+5;const x=i=>pad.l+(i/Math.max(1,data.length-1))*(w-pad.l-pad.r),y=v=>pad.t+(1-(v-min)/(max-min))*(h-pad.t-pad.b);c.strokeStyle="#20343c";c.lineWidth=1;c.font="10px system-ui";c.fillStyle="#8da3a8";[70,100,130,160].forEach(v=>{if(v<min||v>max)return;c.beginPath();c.moveTo(pad.l,y(v));c.lineTo(w-pad.r,y(v));c.stroke();c.fillText(v,pad.l-30,y(v)+3)});if(!data.length)return;c.strokeStyle="#61e6d0";c.lineWidth=2;c.beginPath();data.forEach((q,i)=>i?c.lineTo(x(i),y(q.value)):c.moveTo(x(i),y(q.value)));c.stroke();data.forEach((q,i)=>{c.fillStyle="#61e6d0";c.beginPath();c.arc(x(i),y(q.value),4,0,Math.PI*2);c.fill()})}
function renderDashboard(){const r=getReadings(),cur=r[0]||seed[0],cg=$("currentGlucose");if(cg){cg.innerHTML=`${cur.value} <small>mg/dL</small>`;$("currentStatus").textContent=status(cur.value);$("avgGlucose").innerHTML=`${avg(r)} <small>mg/dL</small>`;$("lastScan").textContent=cur.time||"—";$("lastScanDate").textContent=cur.date||"Saved locally";$("recentReadings").innerHTML=r.slice(0,5).map(x=>`<div class="reading-row"><span>${esc(x.time||"—")}</span><b>${Number(x.value)} mg/dL</b><span>${esc(x.meal||"Demo sample")}</span><span class="reading-status">${esc(status(x.value))}</span></div>`).join("");drawChart($("glucoseChart"),r.slice().reverse())}}
function renderAnalytics(){const r=getReadings(),v=r.map(x=>Number(x.value));if(!$("analyticsAvg"))return;$("analyticsAvg").innerHTML=`${avg(r)} <small>mg/dL</small>`;$("analyticsHigh").innerHTML=`${Math.max(...v)} <small>mg/dL</small>`;$("analyticsLow").innerHTML=`${Math.min(...v)} <small>mg/dL</small>`;$("analyticsCount").textContent=r.length;drawChart($("analyticsChart"),r.slice().reverse());$("analyticsTable").innerHTML=r.map(x=>`<div class="reading-row"><span>${esc(x.time||"—")}</span><b>${Number(x.value)} mg/dL</b><span>${esc(x.meal||"Demo sample")}</span><span class="reading-status">${esc(status(x.value))}</span></div>`).join("");if($("patternText"))$("patternText") .textContent=`The current local demo log contains ${r.length} samples, with values from ${Math.min(...v)} to ${Math.max(...v)} mg/dL. This is a display summary, not a clinical interpretation.`}
function getSteps(){try{const x=JSON.parse(localStorage.getItem(STEPS_KEY));if(x&&x.date===new Date().toDateString())return Number(x.steps)||0}catch(e){}return 3842}
function saveSteps(n){try{localStorage.setItem(STEPS_KEY,JSON.stringify({date:new Date().toDateString(),steps:Math.max(0,n)}))}catch(e){}}
function renderSteps(){if(!$("stepCount"))return;const n=getSteps(),goal=8000,p=Math.min(100,Math.round(n/goal*100));$("stepCount").textContent=n.toLocaleString();$("stepGoalLabel").textContent=goal.toLocaleString();$("stepProgress").style.width=p+"%";$("stepPercent").textContent=p+"% of goal";$("stepRemaining").textContent=n>=goal?"Daily goal reached 🎉":(goal-n).toLocaleString()+" to go"}
function initSteps(){if(!$("addSteps"))return;renderSteps();$("addSteps").addEventListener("click",()=>{saveSteps(getSteps()+500);renderSteps()});$("resetSteps").addEventListener("click",()=>{saveSteps(0);renderSteps()})}
const foods=[
["Idli","south","carb","Breakfast","Steamed fermented rice-and-lentil cakes; portion and sides affect total carbohydrate."],
["Rava idli","south","carb","Breakfast","Semolina-based steamed cakes; typically carbohydrate-focused."],
["Plain dosa","south","carb","Breakfast","Rice-and-lentil crepe; cooking oil and portion affect the meal."],
["Masala dosa","south","carb","Breakfast","Dosa with potato filling; includes starch from both the crepe and filling."],
["Pesarattu","south","protein","Breakfast","Green-gram crepe; provides plant protein and carbohydrate."],
["Adai","south","protein","Breakfast","Lentil-rich savoury pancake; provides protein and carbohydrate."],
["Ven pongal","south","carb","Breakfast","Rice-and-lentil dish; portion and added ghee influence overall nutrition."],
["Ragi dosa","south","carb","Breakfast","Finger-millet dosa; still contributes carbohydrate."],
["Appam","south","carb","Breakfast","Fermented rice pancake; commonly served with vegetable or protein sides."],
["Puttu","south","carb","Breakfast","Steamed rice or millet flour; pairings affect overall meal balance."],
["Upma","south","carb","Breakfast","Semolina or grain dish; vegetables can add fiber."],
["Uthappam","south","carb","Breakfast","Thick dosa often topped with vegetables; carbohydrate content depends on size."],
["Sambar","south","vegetable","Lunch","Lentils and vegetables provide fiber and some protein."],
["Rasam","south","vegetable","Lunch","Light spiced broth; usually a small contributor to total energy."],
["Curd rice","south","carb","Lunch","Rice and curd provide carbohydrate and dairy protein."],
["Lemon rice","south","carb","Lunch","Rice-based dish; serving size determines carbohydrate load."],
["Tamarind rice","south","carb","Lunch","Rice dish; recipes vary in oil and added ingredients."],
["Vegetable biryani","indian","carb","Lunch","Rice and vegetables; portion size is important."],
["Chicken biryani","indian","protein","Lunch","Rice with chicken; contains both carbohydrate and protein."],
["Fish curry","south","protein","Lunch","Fish provides protein; gravy and accompaniments vary."],
["Chicken curry","indian","protein","Lunch","Protein-rich when made with chicken; gravy ingredients vary."],
["Sambar rice","south","carb","Lunch","Combined rice and lentil dish; both contribute carbohydrate."],
["Chapati","indian","carb","Lunch","Wheat flatbread; whole-wheat versions generally provide more fiber."],
["Phulka","indian","carb","Lunch","Whole-wheat flatbread, usually prepared without much added oil."],
["Parotta","south","carb","Dinner","Layered flatbread, often higher in refined flour and fat."],
["Curd","indian","protein","Anytime","Unsweetened curd provides protein; check for added sugar in flavoured products."],
["Paneer bhurji","indian","protein","Dinner","Paneer provides protein; preparation can add fat."],
["Tofu stir-fry","indian","protein","Dinner","Plant-based protein with vegetables; sauces can add sodium or sugar."],
["Boiled egg","protein","protein","Anytime","Protein-rich and contains very little carbohydrate."],
["Omelette","protein","protein","Breakfast","Egg-based protein; vegetables can add variety."],
["Grilled chicken","protein","protein","Dinner","Protein-focused option when served without sugary sauces."],
["Grilled fish","protein","protein","Dinner","Protein-rich option; preparation method affects overall nutrition."],
["Chana masala","indian","protein","Lunch","Chickpeas provide plant protein, fiber and carbohydrate."],
["Rajma","indian","protein","Lunch","Kidney beans provide fiber and plant protein, along with carbohydrate."],
["Dal tadka","indian","protein","Lunch","Lentils provide protein and fiber; oil and portion matter."],
["Moong dal chilla","indian","protein","Breakfast","Lentil pancake with plant protein."],
["Besan chilla","indian","protein","Breakfast","Chickpea-flour pancake; provides protein and carbohydrate."],
["Palak paneer","indian","protein","Dinner","Spinach and paneer combine vegetables with dairy protein."],
["Mixed vegetable poriyal","south","vegetable","Lunch","Vegetable side that can add fiber and micronutrients."],
["Avial","south","vegetable","Lunch","Mixed vegetables with coconut-based seasoning; recipes vary."],
["Beans poriyal","south","vegetable","Lunch","Vegetable side with fiber."],
["Cabbage poriyal","south","vegetable","Lunch","Vegetable side with relatively little carbohydrate per typical serving."],
["Carrot","vegetable","vegetable","Snack","Crunchy vegetable with fiber."],
["Cucumber","vegetable","vegetable","Snack","Hydrating vegetable that can be eaten as a simple side."],
["Tomato salad","vegetable","vegetable","Lunch","Vegetable side; dressings can change nutrition."],
["Spinach stir-fry","vegetable","vegetable","Dinner","Leafy greens provide fiber and micronutrients."],
["Broccoli","vegetable","vegetable","Dinner","Non-starchy vegetable with fiber."],
["Apple","vegetable","carb","Snack","Whole fruit contains carbohydrate and fiber."],
["Orange","vegetable","carb","Snack","Whole fruit provides carbohydrate and fiber."],
["Guava","vegetable","carb","Snack","Fruit with fiber; portion still matters."],
["Papaya","vegetable","carb","Snack","Fruit containing natural sugars and fiber."],
["Watermelon","vegetable","carb","Snack","Fruit with high water content; serving size matters."],
["Pear","vegetable","carb","Snack","Whole fruit containing carbohydrate and fiber."],
["Banana","vegetable","carb","Snack","Fruit containing carbohydrate; size and ripeness matter."],
["Roasted chana","snack","protein","Snack","Crunchy legume snack with fiber and plant protein."],
["Peanuts","snack","protein","Snack","Provides unsaturated fat and protein; energy-dense."],
["Almonds","snack","protein","Snack","Nuts provide unsaturated fat, some protein and fiber."],
["Walnuts","snack","protein","Snack","Nuts provide unsaturated fats; portions are energy-dense."],
["Makhana","snack","carb","Snack","Puffed lotus seeds; preparation and portion affect nutrition."],
["Plain popcorn","snack","carb","Snack","Whole-grain snack; toppings and portion matter."],
["Sprouts salad","snack","protein","Snack","Sprouts provide fiber and plant protein; prepare and store safely."],
["Greek yogurt, plain","protein","protein","Snack","Plain high-protein yogurt; check label for added sugar."],
["Milk, unsweetened","drink","protein","Anytime","Provides protein and naturally occurring lactose."],
["Buttermilk, unsalted","drink","protein","Anytime","Refreshing dairy drink; recipes and salt content vary."],
["Tender coconut water","drink","carb","Drink","Contains natural sugars and electrolytes; serving size matters."],
["Lemon water, unsweetened","drink","vegetable","Drink","Low-sugar hydration option when no sugar is added."],
["Green tea, unsweetened","drink","vegetable","Drink","Unsweetened tea has minimal energy."],
["Coffee, unsweetened","drink","vegetable","Drink","Coffee without added sugar has minimal energy."],
["Vegetable soup","vegetable","vegetable","Dinner","Soup can add vegetables; packaged varieties may contain more sodium."],
["Oats porridge","indian","carb","Breakfast","Oats provide carbohydrate and soluble fiber."],
["Millet upma","south","carb","Breakfast","Millet-based dish; still contains carbohydrate."],
["Millet roti","indian","carb","Lunch","Millet flatbread; nutrient content depends on millet and recipe."],
["Brown rice","indian","carb","Lunch","Provides carbohydrate and some fiber; portion remains important."],
["Quinoa bowl","indian","protein","Lunch","Provides carbohydrate and some protein; combine with vegetables."],
["Whole-wheat sandwich","snack","carb","Snack","Whole-grain bread with protein and vegetables can make a more balanced snack."],
["Hummus with cucumber","snack","protein","Snack","Chickpeas provide fiber and plant protein; cucumber adds crunch."],
["Sweet potato, boiled","snack","carb","Snack","Starchy vegetable that contributes carbohydrate."],
["Boiled corn","snack","carb","Snack","Corn contributes carbohydrate and fiber."],
["Dark chocolate, small portion","snack","carb","Snack","Can contain added sugar; check the nutrition label."],
["Vegetable poha","indian","carb","Breakfast","Flattened rice with vegetables; portion and recipe matter."],
["Kichdi","indian","carb","Dinner","Rice and lentil one-pot meal; ingredient ratios vary."],
["Dhokla","indian","protein","Snack","Steamed fermented chickpea-based snack."],
["Idiyappam","south","carb","Breakfast","Steamed rice noodles; often served with protein or vegetable sides."],
["Kootu","south","vegetable","Lunch","Vegetables and lentils provide fiber and some protein."],
["Egg curry","indian","protein","Dinner","Eggs provide protein; gravy ingredients vary."],
["Tuna salad","protein","protein","Lunch","Protein-rich fish with vegetables; dressings affect nutrition."],
["Lentil soup","vegetable","protein","Dinner","Lentils provide protein, fiber and carbohydrate."],
["Berries","vegetable","carb","Snack","Whole berries contain fiber and naturally occurring sugars."]
].map(([name,category,type,meal,note])=>({name,category,type,meal,note}));
let selectedFoods=new Set(),activeFilter="all",suggestionOffset=0;
function mealType(){return document.querySelector('input[name="meal"]:checked')?.value||"breakfast"}
function currentFoodReading(){return Math.max(40,Math.min(500,Number($("foodGlucose")?.value)||108))}
function foodStatus(v){return v<70?"Low demo value":v<=140?"Demo value in broad reference band":"Elevated demo value"}
function initFood(){if(!$("foodOptions"))return;const search=$("foodSearch");function render(){const q=(search?.value||"").toLowerCase().trim();let list=foods.filter(f=>(activeFilter==="all"||f.category===activeFilter)&&(!q||f.name.toLowerCase().includes(q)||f.note.toLowerCase().includes(q)));const meal=mealType();if(activeFilter==="all"&&!q){const preferred=list.filter(f=>f.meal.toLowerCase()===meal||f.meal==="Anytime"||meal==="snack");const rest=list.filter(f=>!preferred.includes(f));list=[...preferred,...rest]}if(list.length){const rotated=list.slice(suggestionOffset%list.length).concat(list.slice(0,suggestionOffset%list.length));list=rotated} $("foodOptions").innerHTML=list.map(f=>`<button type="button" class="food-card ${selectedFoods.has(f.name)?"chosen":""}" data-food="${esc(f.name)}"><span class="food-card-top"><span class="food-icon">${f.category==="south"?"◈":f.category==="drink"?"◉":f.category==="vegetable"?"✿":f.category==="protein"?"◆":f.category==="snack"?"◇":"▦"}</span><span class="food-add">${selectedFoods.has(f.name)?"✓ Added":"＋ Add"}</span></span><strong>${esc(f.name)}</strong><span class="food-meta">${esc(f.meal)} · ${esc(f.category==="south"?"South Indian":f.category==="indian"?"Indian":f.category==="vegetable"?"Vegetable / fruit":f.category==="protein"?"Protein-rich":f.category==="drink"?"Drink":f.category==="snack"?"Snack":"Food")}</span><span class="food-note">${esc(f.note)}</span></button>`).join("")||'<div class="empty-state">No foods match those filters. Try another category or search.</div>';document.querySelectorAll("[data-food]").forEach(b=>b.addEventListener("click",()=>{const n=b.dataset.food;selectedFoods.has(n)?selectedFoods.delete(n):selectedFoods.add(n);render();renderSelected()}));renderSelected()}
function renderSelected(){$("selectedFoods").innerHTML=selectedFoods.size?[...selectedFoods].map(n=>`<button class="selected-tag" data-remove="${esc(n)}">${esc(n)} <b>×</b></button>`).join(""):'<span class="muted">Tap suggested foods above to start building your plate.</span>';$("plateCount").textContent=`${selectedFoods.size} food${selectedFoods.size===1?"":"s"} selected`;document.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{selectedFoods.delete(b.dataset.remove);render();renderSelected()}))}
render();search?.addEventListener("input",render);document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("selected",x===b));render()}));$("refreshFoods")?.addEventListener("click",()=>{suggestionOffset+=7;render()});document.querySelectorAll('input[name="meal"]').forEach(x=>x.addEventListener("change",render));$("foodGlucose")?.addEventListener("input",()=>{$("foodGlucoseStatus").textContent=`Demo reading: ${currentFoodReading()} mg/dL · ${foodStatus(currentFoodReading())}. Food suggestions are general, not medical advice.`});$("clearPlate")?.addEventListener("click",()=>{selectedFoods.clear();render();renderSelected();$("foodResults").innerHTML='<div class="empty-state">Your plate review will appear here.</div>'; $("plateSection").hidden=true});$("analyzeFood")?.addEventListener("click",()=>{if(!selectedFoods.size){$("foodResults").innerHTML='<div class="empty-state">Choose at least one suggested food first.</div>';return}const picked=[...selectedFoods].map(n=>foods.find(f=>f.name===n)).filter(Boolean);const groups={carb:picked.filter(f=>f.type==="carb").length,protein:picked.filter(f=>f.type==="protein").length,veg:picked.filter(f=>f.type==="vegetable").length};$("foodResults").innerHTML=`<article class="food-result"><div class="result-top"><h3>Plate overview</h3><span class="tag green">${picked.length} items</span></div><p>${groups.veg} vegetable/fruit options · ${groups.protein} protein-focused options · ${groups.carb} carbohydrate-focused options.</p><small class="muted">These are broad categories, not a glucose-response prediction.</small></article>`+picked.map(f=>`<article class="food-result"><div class="result-top"><h3>${esc(f.name)}</h3><span class="tag ${f.type==="protein"||f.type==="vegetable"?"green":"yellow"}">${f.type==="protein"?"Protein-focused":f.type==="vegetable"?"Vegetable / fruit":"Contains carbohydrate"}</span></div><p>${esc(f.note)}</p><small class="muted">Portion size, recipe, and individual response matter.</small></article>`).join("");$("plateSection").hidden=false;$("plateTitle").textContent=`${picked.length} foods selected`;$("plateText").textContent=`Your selection includes ${groups.veg} vegetable/fruit, ${groups.protein} protein-focused and ${groups.carb} carbohydrate-focused options. Consider variety and appropriate portions; this is not an individualized meal prescription.`; $("plateSection").scrollIntoView({behavior:"smooth",block:"nearest"})})}
function initScan(){const btn=$("startScan");if(!btn)return;let running=false;btn.addEventListener("click",()=>{if(running)return;running=true;btn.disabled=true;btn.textContent="Scanning…";$("scanResult").hidden=true;const steps=[["Detecting wearable…","Searching for GluSense demo device"],["Establishing NFC session…","Short-range handshake simulated"],["Validating payload…","Checking device ID and sample timestamp"],["Processing sample…","Applying demo plausibility checks"],["Syncing local dashboard…","Preparing a local demo record"]];const pipe=[...document.querySelectorAll("#pipeline>div")];pipe.forEach(x=>x.classList.remove("done","active"));let i=0;const run=()=>{if(i>0)pipe[i-1]?.classList.add("done");if(i<steps.length){pipe[i]?.classList.add("active");$("scanState").innerHTML=`<span class="pulse"></span><div><b>${steps[i][0]}</b><small>${steps[i][1]}</small></div>`;i++;setTimeout(run,650+Math.floor(Math.random()*300));return}const val=[94,101,106,108,112,117,123][Math.floor(Math.random()*7)]+Math.floor(Math.random()*3);const now=new Date();const time=now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});const signal=82+Math.floor(Math.random()*17);pipe.forEach(x=>x.classList.add("done"));$("scanSignal")&&($("scanSignal").textContent=signal+"%");$("scanState").innerHTML='<span class="pulse"></span><div><b>Demo payload validated</b><small>Session complete · synthetic sample</small></div>';$("scanValue").textContent=val;$("scanMeta").textContent=`${now.toLocaleDateString()} · ${time} · Device GS-WR-2048`;$("scanQuality").textContent=`Payload format valid · sample quality ${signal}% · synthetic demo value only.`;$("scanResult").hidden=false;$("saveScan").dataset.value=val;$("saveScan").dataset.time=time;btn.disabled=false;btn.textContent="Run another demo scan";running=false};setTimeout(run,350)});$("saveScan")?.addEventListener("click",()=>{const r=getReadings(),value=Number($("saveScan").dataset.value);if(!value)return;const time=$("saveScan").dataset.time||new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});r.unshift({value,time,meal:"NFC demo scan",source:"Synthetic NFC demo",date:new Date().toLocaleDateString()});saveReadings(r);$("saveScan").textContent="Saved locally ✓";$("saveScan").disabled=true;setTimeout(()=>location.href="index.html",850)})}
function initSystem(){const b=$("saveSettings");if(!b)return;b.addEventListener("click",()=>{try{localStorage.setItem("glusense_unit",$("unitSelect").value)}catch(e){}$("settingsSaved").textContent="Saved locally ✓";setTimeout(()=>$("settingsSaved").textContent="",1800)});try{const u=localStorage.getItem("glusense_unit");if(u&&$("unitSelect"))$("unitSelect").value=u}catch(e){}}
renderDashboard();renderAnalytics();initSteps();initFood();initScan();initSystem();window.addEventListener("resize",()=>{renderDashboard();renderAnalytics()});
