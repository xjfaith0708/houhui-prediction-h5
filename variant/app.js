const predictionData=[
  {state:'open',tag:'热　进行中',title:'《后会友期》节目中青稚（张庆波）与白小纯（陈礼根）会和好吗'},
  {state:'closed',tag:'新　已封盘',title:'PEL巅峰挑战赛上青稚和白小纯是否会对上'},
  {state:'open',tag:'进行中',title:'节目《后会友期》节目中许飞与厉娜会和好吗'},
  {state:'closed',tag:'已封盘',title:'节目《后会友期》节目中王子璇与文吉儿会和好吗'}
];
const predictions=document.querySelector('#predictions');
function drawUnifiedChart(index){
 window.activePredictionIndex=index;
 renderTopCoins(index);
 const names=['许飞和厉娜','张萌和马天宇','白小纯和青稚','王子璇和文吉儿'];
 let feed=document.querySelector('.top-comment-preview');
 if(!feed){
  feed=document.createElement('div');feed.className='top-comment-preview';feed.tabIndex=0;feed.setAttribute('aria-label','人物预测滚动评论');
  const card=document.querySelector('.unified-top-card');
  const wrapper=document.createElement('section');wrapper.className='unified-card-shell';card.before(wrapper);wrapper.append(card,feed);
 }
 const texts=[`小林：希望${names[index]}能好好聊一次。`,'晴天：这一段看得很感慨，期待后续！','追更中：你们觉得最后会和好吗？','晚风：等下一期更新，再来看看大家的预测。'];
 feed.innerHTML='<div class="top-comment-track">'+[...texts,...texts].map((text,i)=>`<div${i>=texts.length?' aria-hidden="true"':''}><span class="preview-avatar" aria-hidden="true">${['🌸','☀️','🌿','🌙'][i%4]}</span><span>${text}</span></div>`).join('')+'</div>';
 feed.scrollTop=0;
 const host=document.querySelector('.unified-top-card');
 let chart = host.querySelector('.prediction-chart');
 if (!chart) {
  chart = document.createElement('div');
  chart.className = 'prediction-chart';
  host.append(chart);
 }
 const red = [[62,48,58,32,46],[55,40,58,25,34],[25,45,32,55,34],[60,42,25,50,34]][index];
 const blue = red.map(value => 100 - value);
 const dates = ['11.16', '11.17', '11.18', '11.19', '11.20'];
 const x = i => 12 + i * 69;
 const y = value => 100 - value;
 const series = (values, color) => {
  const points = values.map((value, i) => x(i) + ',' + y(value)).join(' ');
  const dots = values.map((value, i) => `<ellipse class="chart-dot" data-day="${i}" cx="${x(i)}" cy="${y(value)}" rx="3" ry="3.9" fill="${color}"/>`).join('');
  return `<polyline stroke="${color}" points="${points}"/>${dots}`;
 };
 chart.innerHTML = `
  <div class="chart-ratios" aria-live="polite"><span></span><span></span></div>
  <div class="chart-body">
   <svg class="chart-lines" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
    ${[0,25,50,75,100].map(value => `<path d="M 0 ${value} H 300"/>`).join('')}
    ${series(red, '#f775a1')}${series(blue, '#36a9e7')}
   </svg>
   <div class="chart-marker-layer" aria-hidden="true"><i></i><i></i></div>
   <div class="chart-scale" aria-hidden="true">${[100,75,50,25,0].map(value => `<span style="--tick:${100-value}%">${value}%</span>`).join('')}</div>
   <div class="chart-days" aria-label="选择走势图日期">
    ${dates.map((date, i) => `<button type="button" aria-label="查看 ${date} 占比" data-day="${i}" style="--day-x:${x(i)/3}%"><span>${date}</span></button>`).join('')}
   </div>
  </div>`;
 const ratios = chart.querySelectorAll('.chart-ratios span');
 const days = [...chart.querySelectorAll('.chart-days button')];
 const markers = chart.querySelectorAll('.chart-marker-layer i');
 function selectDay(day) {
  ratios[0].textContent = '和好 ' + red[day] + '%';
  ratios[1].textContent = '不和好 ' + blue[day] + '%';
  days.forEach((button, i) => button.setAttribute('aria-pressed', String(day === i)));
  [red[day], blue[day]].forEach((value, side) => {
   markers[side].style.left = x(day) / 3 + '%';
   markers[side].style.top = y(value) + '%';
  });
 }
 days.forEach((button, i) => button.onclick = () => selectDay(i));
 selectDay(dates.length - 1);
}
const betHotspots = document.createElement('div');
betHotspots.className = 'bet-hotspots';
for (const label of ['和好', '不和好']) {
 const button = document.createElement('button');
 button.type = 'button';
 button.innerHTML = '<span class="top-bet-label">' + label + '</span>' +
  '<span class="top-bet-coins"><span class="coin-icon" aria-hidden="true">币</span><span class="coin-total"></span></span>';
 betHotspots.append(button);
}
document.querySelector('.unified-top-card').append(betHotspots);

const coinTotals = [
 [3034123, 3034123],
 [5304802, 723381],
 [3298146, 143398],
 [180921, 4342104]
];
const coinSlots = [...betHotspots.querySelectorAll('.coin-total')];

function renderTopCoins(index) {
 coinSlots.forEach((slot, side) => {
  slot.textContent = coinTotals[index][side];
  slot.setAttribute('aria-label', coinTotals[index][side] + '枚硬币');
 });
}

function rollTopCoin(side) {
 const totals = coinTotals[window.activePredictionIndex];
 const before = String(totals[side]);
 const increments = [500, 800, 1000, 1200];
 totals[side] += increments[Math.floor(Math.random() * increments.length)];
 const after = String(totals[side]);
 const slot = coinSlots[side];
 slot.setAttribute('aria-label', after + '枚硬币');
 const previousDigits = before.padStart(after.length, ' ');
 const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
 slot.replaceChildren(...[...after].map((digit, position) => {
  const cell = document.createElement('span');
  cell.className = 'coin-digit';
  cell.textContent = digit;
  if (digit === previousDigits[position] || reduceMotion) return cell;
  const oldDigit = document.createElement('span');
  oldDigit.textContent = previousDigits[position];
  oldDigit.className = 'coin-digit-old';
  oldDigit.setAttribute('aria-hidden', 'true');
  const direction = Math.random() < .5 ? -1 : 1;
  const newDigit = document.createElement('span');
  newDigit.textContent = digit;
  cell.replaceChildren(oldDigit, newDigit);
  const options = {duration: 420, easing: 'ease-out'};
  oldDigit.animate([{transform: 'translateY(0)'}, {transform: 'translateY(' + (direction * 100) + '%)'}], options);
  newDigit.animate([{transform: 'translateY(' + (-direction * 100) + '%)'}, {transform: 'translateY(0)'}], options)
   .finished.then(() => cell.replaceChildren(digit));
  return cell;
 }));
}

drawUnifiedChart(0);
const coinUpdateInterval = 1000;
setInterval(() => rollTopCoin(0), coinUpdateInterval);
setTimeout(() => {
 rollTopCoin(1);
 setInterval(() => rollTopCoin(1), coinUpdateInterval);
}, coinUpdateInterval / 2);
const betDialog=document.createElement('dialog');betDialog.className='bet-dialog';
betDialog.innerHTML=`<form method="dialog" class="bet-sheet"><button type="button" class="sheet-close" aria-label="关闭预测弹窗">×</button><div class="sheet-handle"></div><h2></h2><div class="sheet-meta"><span>进行中</span> 硬币奖池：10598　8月31日 15:30封盘</div><div class="sheet-options"><button type="button" data-option="0">会和好 <b></b></button><button type="button" data-option="1">不会和好 <b></b></button></div><div class="balance-row">投入硬币 <small></small></div><div class="amount-stepper"><button type="button" data-step="-100">−</button><input aria-label="投入硬币" type="number" min="1" step="1" value="100"><button type="button" data-step="100">＋</button></div><div class="amount-presets">${[300,500,1000,5000].map(n=>`<button type="button" data-amount="${n}">${n}</button>`).join('')}</div><div class="estimate">预测正确预计获得硬币 <b>100</b></div><p class="bet-error" role="alert"></p><button class="bet-submit" type="submit">提交预测</button><div class="sheet-home"></div></form>`;
document.body.append(betDialog);
let betOption=0,betBalance=10000,betReturnFocus=null;
const betInput=betDialog.querySelector('input');
function updateBet(){
 const amount=Number(betInput.value);
 const valid=Number.isInteger(amount)&&amount>0&&amount<=betBalance;
 betDialog.querySelector('.bet-submit').disabled=!valid;
 betDialog.querySelector('.estimate b').textContent=valid?amount:'−';
 betDialog.querySelector('.balance-row small').textContent='硬币余额：'+betBalance;
 betDialog.querySelector('.bet-error').textContent=amount>betBalance?'硬币余额不足':'';
 betDialog.querySelectorAll('[data-option]').forEach(b=>b.classList.toggle('chosen',Number(b.dataset.option)===betOption));
}
betHotspots.querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>{
 betReturnFocus=button;betOption=i;betInput.value=100;
 const names=['许飞与厉娜','马天宇与张萌','白小纯与张庆波','王子璇与文吉儿'];
 const percentages=[[54,46],[88,12],[92,4],[4,96]][window.activePredictionIndex];
 betDialog.querySelector('h2').textContent='节目《后会友期》中'+names[window.activePredictionIndex]+'会和好吗';
 betDialog.querySelectorAll('[data-option] b').forEach((b,j)=>b.textContent=percentages[j]+'%');
 updateBet();betDialog.showModal();
}));
betDialog.addEventListener('click',e=>{
 const b=e.target.closest('button');
 if(e.target===betDialog||b?.classList.contains('sheet-close'))betDialog.close();
 if(b?.dataset.option!==undefined){betOption=Number(b.dataset.option);updateBet();}
 if(b?.dataset.amount){betInput.value=b.dataset.amount;updateBet();}
 if(b?.dataset.step){betInput.value=Math.max(1,Math.min(betBalance,Number(betInput.value)+Number(b.dataset.step)));updateBet();}
});
betInput.addEventListener('input',updateBet);
betDialog.querySelector('form').addEventListener('submit',e=>{e.preventDefault();updateBet();if(betDialog.querySelector('.bet-submit').disabled)return;betBalance-=Number(betInput.value);betDialog.close();toast('预测成功，已投入'+betInput.value+'硬币');});
betDialog.addEventListener('close',()=>betReturnFocus?.focus());
const tabImages = Array.from({length: 4}, (_, index) => {
 const image = new Image();
 image.src = './assets/unified-top-' + (index + 1) + '.webp';
 image.decode().catch(() => {});
 return image;
});
const tabList = document.querySelector('.unified-top-tabs');
const carouselTabs = [...tabList.querySelectorAll('button')];
function updateTabEdge() {
 tabList.classList.toggle('has-more-tabs', tabList.scrollWidth - tabList.clientWidth - tabList.scrollLeft > 1);
}
tabList.addEventListener('scroll', updateTabEdge, {passive: true});
new ResizeObserver(updateTabEdge).observe(tabList);
updateTabEdge();

const progressFill = document.createElement('i');
progressFill.className = 'tab-progress';
progressFill.setAttribute('aria-hidden', 'true');
let progressAnimation;

function startTabProgress(position, reveal) {
 const button = carouselTabs[position];
 progressAnimation?.cancel();
 button.prepend(progressFill);
 if (reveal) {
  const left = button.offsetLeft;
  if (left < tabList.scrollLeft || left + button.offsetWidth > tabList.scrollLeft + tabList.clientWidth) {
   tabList.scrollTo({left, behavior: 'smooth'});
  }
 }
 progressAnimation = progressFill.animate(
  [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}],
  {duration: 10000, fill: 'forwards'}
 );
 progressAnimation.finished.then(
  () => selectCarouselTab((position + 1) % carouselTabs.length),
  () => {}
 );
}

function selectCarouselTab(position) {
 const button = carouselTabs[position];
 const index = Number(button.dataset.card);
 const image = document.querySelector('#unified-top-image');
 image.src = tabImages[index].src;
 image.alt = button.textContent + '预测卡';
 drawUnifiedChart(index);
 carouselTabs.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 startTabProgress(position, true);
}

carouselTabs.forEach((button, position) => {
 button.addEventListener('click', () => selectCarouselTab(position));
});
betHotspots.addEventListener('click', () => {
 if (betDialog.open) progressAnimation?.pause();
});
betDialog.addEventListener('close', () => progressAnimation?.play());
startTabProgress(0, false);
predictions.innerHTML=predictionData.map((p,i)=>`<article class="prediction" data-state="${p.state}"><h2>${p.title}</h2><div class="meta"><span class="tag ${p.state==='closed'?'closed':i===1?'new':''}">${p.tag}</span> 硬币奖池：10598　8月31日 15:30封盘</div><button class="vote" style="--bar:50%">会 <b>50%</b></button><button class="vote" style="--bar:30%">不会 <b>30%</b></button></article>`).join('');

document.querySelectorAll('.prediction').forEach((card,i)=>{
 card.classList.add('screenshot-card');
 const image=document.createElement('img');
 image.src=`./assets/prediction-card-${i+1}.png`;
 image.alt=predictionData[i].title;
 card.prepend(image);
});
const firstPrediction=predictions.querySelector('.prediction');
const coinRows=[{coins:30341,percent:50},{coins:9341,percent:50}];
coinRows.forEach((row,i)=>{
 const overlay=document.createElement('div');
 overlay.className='coin-progress coin-progress-'+i;
 overlay.innerHTML='<span class="coin-counter">+0硬币</span><span class="live-percent">'+row.percent+'%</span><i class="coin-bar"></i>';
 firstPrediction.append(overlay);
 row.element=overlay;
});
function animateCoinProgress(){
 coinRows.forEach(row=>{row.element.querySelector('.coin-counter').textContent='';row.element.querySelector('.coin-bar').style.width=row.percent+'%';});
 let tick=0;
 const timer=setInterval(()=>{
  const row=coinRows[tick%2];
  const amount=[500,1000,800,500,1200][tick%5];
  const counter=row.element.querySelector('.coin-counter');
  counter.replaceChildren();
  const entry=document.createElement('span');
  entry.className='bet-entry';entry.textContent='+'+amount+'硬币';counter.append(entry);
  tick++;
  if(tick%3===0){
   coinRows[0].percent=[54,51,57][tick/3-1];
   coinRows[1].percent=100-coinRows[0].percent;
   coinRows.forEach(item=>{
    item.element.querySelector('.coin-bar').style.width=item.percent+'%';
    item.element.querySelector('.live-percent').textContent=item.percent+'%';
   });
  }
  if(tick>=9)clearInterval(timer);
 },1400);
}
const coinObserver=new IntersectionObserver(entries=>{
 if(entries.some(entry=>entry.isIntersecting)){animateCoinProgress();coinObserver.unobserve(firstPrediction);}
},{threshold:.4});
coinObserver.observe(firstPrediction);
let moreExpanded=false;
let activePredictionFilter='all';
const sampleCards=[...predictions.querySelectorAll('.prediction')];
for(let i=4;i<10;i++){
 const copy=sampleCards[2+i%2].cloneNode(true);
 predictions.append(copy);
}
const emptyPredictionImage = new Image();
emptyPredictionImage.src = 'data:image/png;base64,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';
emptyPredictionImage.decode().catch(() => {});
function updatePredictionList(filter='all'){
 activePredictionFilter=filter;
 predictions.querySelectorAll('.prediction-empty').forEach(el=>el.remove());
 const cards=[...predictions.querySelectorAll('.prediction')];
 const matches=cards.filter(card=>filter==='all'||card.dataset.state===filter);
 cards.forEach(card=>card.classList.toggle('hidden',!matches.slice(0,4).includes(card)));
 const more=document.querySelector('.more');
 more.hidden=matches.length<=4;
 more.style.display=matches.length<=4?'none':'';
 more.classList.remove('expanded');
 moreExpanded=false;
 if(!matches.length){const empty=document.createElement('div');empty.className='prediction-empty';const image=document.createElement('img');image.src=emptyPredictionImage.src;image.alt='暂时没有预测哦';empty.append(image);predictions.append(empty);}
}
updatePredictionList();
function toggleMorePredictions(button){
 moreExpanded=true;
 predictions.querySelectorAll('.prediction').forEach(card=>card.classList.toggle('hidden',activePredictionFilter!=='all'&&card.dataset.state!==activePredictionFilter));
 button.classList.toggle('expanded',moreExpanded);
 button.setAttribute('aria-expanded',String(moreExpanded));
 button.setAttribute('aria-label',moreExpanded?'收起更多预测':'查看更多预测内容');
}
const comments=[
 {name:'乘风千朵',text:'盲猜刚被运输到空岛的庞克记录被黑胡子海贼团的毒q和拉菲特（会飞并且能兵不血刃制敌）给带走了',imgs:['raw13.png','raw14.png','raw15.png'],likes:667},
 {name:'初行',text:'看莱莉的视频就知道，莱莉真的是一个很抢外卖收拾好打开，视频看完了',likes:2053,reply:'科伊思：知识滑过了我光滑的大脑皮层　👍'},
 {name:'小熊人',text:'盲猜刚被运输到空岛的庞克记录被黑胡子海贼团的毒q和拉菲特给带走了',likes:667},
 {name:'hiddlila',text:'你厉害了，我也这样以为的',likes:47,reply:'月亮上行走的人：银魂通宵有雷存下太多的影像记录…　查看 23 条回复 ›'}
];
document.querySelector('#comments').innerHTML=comments.map((c,i)=>`<article class="comment"><div class="avatar">${['🌺','🧑','🌸','🎀'][i]}</div><div><h3>${c.name} <small>LV6</small></h3><p>${c.text}</p>${c.imgs?`<div class="photos">${c.imgs.map(x=>`<img src="./assets/${x}" alt="评论图片">`).join('')}</div>`:''}<div class="actions"><span>评论来自视频 · 2小时前　回复</span><button class="like">♡ ${c.likes}</button></div>${c.reply?`<div class="reply">${c.reply}</div>`:''}</div></article>`).join('');

const allCommentsMarkup=document.querySelector('#comments').innerHTML;
const discussionDock=document.createElement('aside');
discussionDock.className='discussion-dock';
discussionDock.innerHTML='<button class="dock-header" aria-expanded="false"><span class="dock-grip"></span><span class="dock-label"><img src="./assets/discussion-bubble.svg" alt="">热点讨论 124</span><span class="dock-arrow">⌃</span></button><div class="dock-body"></div>';
document.body.append(discussionDock);
const dockBody=discussionDock.querySelector('.dock-body');
const originalPanel=document.querySelector('.comment-panel');
const panelMarker=document.createComment('comment panel position');originalPanel.before(panelMarker);
let dockExpanded=false,previousOverflow='';
function syncDockVisibility(){
 if(dockExpanded)return;
 const rect=originalPanel.getBoundingClientRect();
 discussionDock.hidden=rect.top<window.innerHeight-64&&rect.bottom>0;
}
function setDockExpanded(expanded){
 dockExpanded=expanded;
 discussionDock.classList.toggle('open',expanded);
 discussionDock.querySelector('button').setAttribute('aria-expanded',String(expanded));
 if(expanded){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dockBody.append(originalPanel);discussionDock.hidden=false;}
 else {panelMarker.after(originalPanel);document.body.style.overflow=previousOverflow;syncDockVisibility();}
}
let dockDragged=false;
discussionDock.querySelector('button').addEventListener('click',()=>{if(dockDragged){dockDragged=false;return;}setDockExpanded(!dockExpanded);});
let drag = null;
const dockHeader = discussionDock.querySelector('.dock-header');
dockHeader.addEventListener('pointerdown', e => {
 if (!e.isPrimary || e.button !== 0) return;
 dockDragged = false;
 drag = {id:e.pointerId, y:e.clientY, height:discussionDock.offsetHeight, expanded:dockExpanded};
 dockHeader.setPointerCapture(e.pointerId);
});
dockHeader.addEventListener('pointermove', e => {
 if (!drag || drag.id !== e.pointerId) return;
 const distance = drag.y - e.clientY;
 if (!dockDragged && Math.abs(distance) < 5) return;
 dockDragged = true;
 discussionDock.style.transition = 'none';
 discussionDock.style.height = Math.min(innerHeight, Math.max(64, drag.height + distance)) + 'px';
 if (!dockExpanded) setDockExpanded(true);
});
function finishDrag(e) {
 if (!drag || drag.id !== e.pointerId) return;
 if (dockDragged) {
  const distance = drag.y - e.clientY;
  const threshold = Math.min(100, innerHeight * 0.15);
  const expanded = e.type === 'pointercancel' ? drag.expanded :
   (drag.expanded ? distance > -threshold : distance >= threshold);
  discussionDock.style.removeProperty('transition');
  discussionDock.style.removeProperty('height');
  if (expanded !== dockExpanded) setDockExpanded(expanded);
 }
 drag = null;
}
dockHeader.addEventListener('pointerup', finishDrag);
dockHeader.addEventListener('pointercancel', finishDrag);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dockExpanded)setDockExpanded(false);});
window.addEventListener('scroll',syncDockVisibility,{passive:true});
window.addEventListener('resize',syncDockVisibility);
new ResizeObserver(syncDockVisibility).observe(document.querySelector('.page'));
syncDockVisibility();
const discussionMessages={
 '许飞&厉娜':['看到她们终于坐下来聊天，还是挺感慨的，希望这次能把心里话说开。','感觉许飞和厉娜之间还有很多没说完的话，继续等下一期。'],
 '张萌&马天宇':['张萌和马天宇这段交流很真诚，两个人都愿意听对方解释。','这组我投和好！期待后面两个人的相处。'],
 '白小纯&青稚':['白小纯和青稚的互动太有意思了，比赛之外也想看他们多聊聊。','感觉他们只差一个主动开口的机会，你们怎么看？'],
 '王子璇&文吉儿':['王子璇和文吉儿这一组，我想再观察一下后面的发展。','希望两个人能好好沟通，把之前的误会说清楚。']
};
function filterDiscussion(type){
 const list=document.querySelector('#comments');
 list.innerHTML=allCommentsMarkup;
 if(type==='全部')return;
 const messages=discussionMessages[type]||[];
 const templates=[...list.querySelectorAll('.comment')];
 const expanded=[...messages,'这一期还有很多细节值得再看一遍，等更新以后再来讨论。','我觉得现在下结论还早，想看看后面怎么发展。','最喜欢能把话说开的环节，希望大家都能坦诚一点。','刚看完就来评论区了，你们更支持哪一方？','有些话换个角度理解，感受真的会不一样。','期待下一期，希望看到更多两个人的交流。'];
 list.replaceChildren();
 expanded.forEach((message,i)=>{
  const card=templates[i%templates.length].cloneNode(true);
  card.querySelector('p').textContent=message;
  card.querySelector('h3').textContent=['追更中的小林','山间来信','一颗小星星','认真看节目','晚风同学','今天也在追更','晴天笔记','等一个后续'][i]+' LV6';
  card.querySelectorAll('.photos,.reply').forEach(el=>el.remove());
  card.querySelector('.like').textContent='♡ '+(26+i*37);
  list.append(card);
 });
}
const toast=t=>{const el=document.querySelector('#toast');el.textContent=t;el.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>el.classList.remove('show'),1300)};
const topCardImages=['top-card-1.png?v=2','top-card-2.png?v=2','top-card-3.png?v=2','top-card-4.png?v=2'];
const topCardChartData=[
 {red:[62,48,58,32,46],blue:[38,52,42,68,54]},
 {red:[55,40,58,25,34],blue:[45,60,42,75,66]},
 {red:[25,45,32,55,34],blue:[75,55,68,45,66]},
 {red:[60,42,25,50,34],blue:[40,58,75,50,66]}
];
const renderTopChart=index=>{
 const card=document.querySelector('.feature-card');
 card.dataset.cardIndex=String(index);
 const lines=card.querySelectorAll('.chart polyline');
 const toPoints=values=>values.map((value,i)=>`${i*78.75},${70-value*.6}`).join(' ');
 lines[0].setAttribute('points',toPoints(topCardChartData[index].red));
 lines[1].setAttribute('points',toPoints(topCardChartData[index].blue));
 card.classList.remove('chart-animate');
 void card.offsetWidth;
 card.classList.add('chart-animate');
};
document.addEventListener('click',e=>{
 const b=e.target.closest('button'); if(!b)return;
 if(b.closest('.people-tabs')){const buttons=[...b.parentElement.querySelectorAll('button')];const index=buttons.indexOf(b);buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector('.feature-card').style.backgroundImage=`url('./assets/${topCardImages[index]}')`;renderTopChart(index);toast(`已切换到 ${b.textContent}`)}
 if(b.closest('.prediction-filter')){document.querySelectorAll('.prediction-filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active');updatePredictionList(b.dataset.filter);}
 if(b.classList.contains('vote')){const box=b.parentElement;box.querySelectorAll('.vote').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');toast(`已选择“${b.childNodes[0].textContent.trim()}”`)}
 if(b.dataset.choice)toast(`已支持“${b.dataset.choice}”`);
 if(b.classList.contains('like')){b.classList.toggle('active');b.textContent=b.classList.contains('active')?'♥ 已赞':'♡ 取消';}
 if(b.classList.contains('back'))toast('已返回上一页');
 if(b.classList.contains('more'))toggleMorePredictions(b);
 if(b.closest('.comment-filter')){b.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');filterDiscussion(b.textContent.trim());}
});
const commentInput = document.querySelector('.composer input');
commentInput.addEventListener('focus', () => {
 const sheet = commentInput.closest('.discussion-dock.open');
 if (sheet) sheet.style.setProperty('--discussion-focus-height', sheet.offsetHeight + 'px');
});
commentInput.addEventListener('blur', () => {
 document.querySelector('.discussion-dock').style.removeProperty('--discussion-focus-height');
});
document.querySelector('.composer').addEventListener('submit',e=>{e.preventDefault();const input=e.currentTarget.querySelector('input');if(input.value.trim()){toast('评论已发布');input.value=''}});
