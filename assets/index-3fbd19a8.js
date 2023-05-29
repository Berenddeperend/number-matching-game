var m=Object.defineProperty;var f=(n,e,t)=>e in n?m(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var r=(n,e,t)=>(f(n,typeof e!="symbol"?e+"":e,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const o of l.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(s){if(s.ep)return;s.ep=!0;const l=t(s);fetch(s.href,l)}})();class p{constructor(e,t,i){r(this,"value");r(this,"index");r(this,"id");r(this,"element");r(this,"solved");this.value=Math.floor(Math.random()*9+1),this.solved=!1,this.index=e,this.id=t,this.element=document.createElement("div"),this.element.setAttribute("data-index",this.index.toString()),this.element.setAttribute("data-id",this.id.toString()),this.element.classList.add("cell"),this.element.classList.add("initial-frame"),i.appendChild(this.element),setTimeout(()=>{this.element.classList.remove("initial-frame")},100),this.render()}render(){this.element.innerHTML=this.value.toString()}pulse(){this.element.addEventListener("animationend",()=>{this.element.classList.remove("pulse")},{once:!0}),this.element.classList.add("pulse")}solve(){this.solved=!0,this.element.classList.add("solved")}toggleSelect(){this.element.classList.toggle("selected")}}const C=["right","downRight","down","downLeft"];class v{constructor(e){r(this,"gridWidth");r(this,"cells");r(this,"gridElement");r(this,"selectedCell");r(this,"drawnCells");this.gridWidth=9,this.gridElement=e,this.cells=[],this.selectedCell=null,this.drawnCells=0,this.initialize(e)}initialize(e){this.gridElement=document.createElement("div"),this.gridElement.classList.add("grid"),this.gridElement.style.gridTemplateColumns=`repeat(${this.gridWidth}, 1fr)`,e.appendChild(this.gridElement),this.addCells(),this.attachEventListeners(),this.autoplay()}autoplay(){setInterval(()=>{const e=this.nextUnsolvedPair();e.length?(e.forEach(t=>{t.pulse()}),setTimeout(()=>this.solvePair(e),500)):this.addCells()},1e3)}solvePair(e){e.forEach(t=>t.solve()),this.clearEmptyRows()}clearEmptyRows(){(()=>{const i=[];for(let s=0;s<this.cells.length/this.gridWidth;s++)i.push(this.cells.slice(s*this.gridWidth,s*this.gridWidth+this.gridWidth));return i})().filter(i=>i.every(s=>s.solved)).forEach(i=>{i.forEach(s=>{s.element.remove()}),this.cells.splice(i[0].index,this.gridWidth),this.cells.forEach((s,l)=>{s.index=l,s.element.setAttribute("data-index",l.toString())})})}attachEventListeners(){document.querySelector(".grid").addEventListener("click",e=>{const t=e.target;if(t.classList.contains("cell")){const i=this.cells.find(s=>s.index===parseInt(t.getAttribute("data-index")));this.selectedCell?(this.compareCells(this.selectedCell,i)&&(this.selectedCell.solve(),i.solve()),this.selectedCell.toggleSelect(),this.selectedCell=null,this.nextUnsolvedPair().forEach(l=>l.pulse()),this.nextUnsolvedPair().length||this.addCells()):(this.selectedCell=i||null,i.toggleSelect())}})}nextUnsolvedPair(){return this.cells.filter(e=>!e.solved).reduce((e,t)=>{if(e.length)return e;const i=this.getNeighborCells(t).filter(s=>!s.solved).find(s=>this.compareCellsByValue(t,s));return i&&(e=[t,i]),e},[])}getLookDeltaFromDirection(e){switch(e){case"right":return 1;case"downRight":return this.gridWidth+1;case"down":return this.gridWidth;case"downLeft":return this.gridWidth-1;default:throw new Error("this should not happen")}}getCellConstraints(e){const t=[];return e%this.gridWidth===0&&t.push("left"),e%this.gridWidth===this.gridWidth-1&&t.push("bottomRight"),e>=this.cells.length-this.gridWidth&&t.push("bottom"),e+this.gridWidth+1>=this.cells.length&&t.push("bottom","right"),e===this.cells.length-1&&t.push("last"),t}getAllowedDirectionsFromConstraints(e){const t={left:["downLeft"],right:["downRight","right"],bottom:["downLeft","down","downRight"],bottomRight:["downRight"],last:["right","down","downRight","downLeft"]},i=Array.from(new Set(e.map(s=>t[s]).flat()));return C.filter(s=>!i.includes(s))}getNeighborCells(e){const t=e.index,i=this.getCellConstraints(t);return this.getAllowedDirectionsFromConstraints(i).reduce((l,o)=>{const a=this.getLookDeltaFromDirection(o),h=(u,c)=>{const d=this.cells[u.index+c];if(d&&!d.solved)l.push(d);else{const g=this.getCellConstraints(d.index);this.getAllowedDirectionsFromConstraints(g).includes(o)&&h(d,c)}};return h(e,a),l},[])}addCells(){const e=this.gridWidth*3.5;for(let t=0;t<Math.floor(e);t++)this.cells.push(new p(this.cells.length,this.drawnCells++,document.querySelector(".grid")))}compareCells(e,t){return this.compareCellsByValue(e,t)&&this.compareCellsByPosition(e,t)}compareCellsByPosition(e,t){const i=[e,t].sort((l,o)=>l.index-o.index);return this.getNeighborCells(i[0]).includes(i[1])}compareCellsByValue(e,t){return this.compareValue(e.value,t.value)}compareValue(e,t){return e===t||e+t===10}}document.querySelector("#app").innerHTML=`
  <div class="game"></div>
`;new v(document.querySelector(".game"));