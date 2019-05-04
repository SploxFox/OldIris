!function(e){var t={};function n(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(r,s,function(t){return e[t]}.bind(null,s));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=new(n(1).Iris)("https://review.st-ignati.us/chemistry/story.json");function s(){window.scrollTo(0,0),window.scrollTo(0,1)}document.body.appendChild(r.element),window.addEventListener("touchmove",s),window.addEventListener("load",s)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(2),s=n(3),i=n(4);t.Iris=class{constructor(e){this.touchStarted=!1,this.userInterface=new i.UserInterface,this.visuals=new s.Visuals,this.storyManager=new r.StoryManager(e),this.storyManager.currentCue.speech||this.storyManager.goToNextSpeech(),this.element=document.createElement("div"),this.element.classList.add("game");var t=document.createElement("div");t.classList.add("interface-wrapper"),t.appendChild(this.userInterface.textBox.element),this.element.appendChild(t),this.userInterface.textBox.showText(this.storyManager.currentCue.character,this.storyManager.currentSpeech),window.addEventListener("touchstart",function(){this.advance(),this.touchStarted=!0}.bind(this)),window.addEventListener("click",function(){this.touchStarted?this.touchStarted=!1:this.advance()}.bind(this))}advance(){this.storyManager.goToNextSpeech(),this.userInterface.textBox.showText(this.storyManager.currentCue.character,this.storyManager.currentSpeech)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.StoryManager=class{constructor(e){this.currentEpisodePosition=0,this.currentChapterPosition=0,this.currentCuePosition=0,this.currentSpeechPosition=0,this._currentEvidence=[];var t=new XMLHttpRequest;t.open("GET",e,!1),t.send(null),console.log(t.responseText),this.story=JSON.parse(t.responseText),console.log(this.story)}get currentSpeech(){var e=this.story.episodes[this.currentEpisodePosition].chapters[this.currentChapterPosition].content[this.currentCuePosition].speech[this.currentSpeechPosition];return console.log(e),e}get currentCue(){var e=this.story.episodes[this.currentEpisodePosition].chapters[this.currentChapterPosition].content[this.currentCuePosition];if(null==e)throw"Error: Found cue to be undefined!";return e}get currentChapter(){return this.story.episodes[this.currentEpisodePosition].chapters[this.currentChapterPosition]}get currentEpisode(){return this.story.episodes[this.currentEpisodePosition]}get currentEvidence(){return this._currentEvidence}register(){this.currentCue.newevidence&&this._currentEvidence.push({name:this.currentCue.name,id:this.currentCue.newevidence,image:this.currentCue.image?this.currentCue.image:"https://previews.123rf.com/images/iqoncept/iqoncept0901/iqoncept090100094/4221417-a-white-wrinkled-piece-of-paper-background-for-slides-brochures-and-presentations-.jpg"})}advance(){this.currentCue.speech&&this.currentCue.speech.length-1>this.currentSpeechPosition?(this.currentSpeechPosition++,console.log("Advanced to next speech. New position: "+this.currentSpeechPosition)):this.currentChapter.content.length>this.currentCuePosition?(this.currentCuePosition++,this.currentSpeechPosition=0,console.log("Advanced to next cue.")):this.currentEpisode.chapters.length>this.currentChapterPosition&&(this.currentChapterPosition++,this.currentSpeechPosition=0,this.currentCuePosition=0,console.log("Advanced to next chapter."))}goToNextSpeech(){do{this.register(),this.advance()}while(!this.currentCue.speech)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.Visuals=class{constructor(){this.canvas=document.createElement("canvas"),this.canvas.classList.add("visuals"),this.context=this.canvas.getContext("2d"),this.context.rect(10,10,20,20)}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=n(5),s=n(6);t.UserInterface=class{constructor(){this.textBox=new r.TextBox,this.courtRecord=new s.CourtRecord}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class r{constructor(){this.element=document.createElement("div"),this.element.classList.add("text","text-box"),this.speakerElement=document.createElement("span"),this.speakerElement.classList.add("name"),this.textElement=document.createElement("div"),this.textElement.classList.add("text-block"),this.element.appendChild(this.speakerElement),this.element.appendChild(this.textElement)}clear(){for(;this.textElement.firstElementChild;)this.textElement.firstElementChild.remove();this.speakerElement.textContent="",this.blipNum=0,this.isFinished=!1}showText(e,t){this.clear(),this.speakerElement.textContent=e;var n="fast",s="speech",i=function(e){if("#"!=t[e]||"#"!=t[e+1])return{character:t[e],mode:s,speed:n,index:e};try{for(var r="",i=e+2;"("!=t[i]&&t.length>i;i++)r+=t[i];for(var o,c="",a=i+1;")"!=t[a]&&t.length>a;a++)c+=t[a];switch(o=c.split(","),r){case"mode":s=o[0];break;case"speed":n=o[0]}return{index:a}}catch(e){console.log("Unable to parse command!"),console.log(e)}}.bind(this);for(var o=0;o<t.length;o++){var c=i(o);if(r.instanceOfQueuedCharacter(c)){var a=document.createElement("span");a.classList.add("text",s,"hidden"),a.textContent=t[o],a.dataset.index=""+o,this.textElement.appendChild(a)}else o=c.index}(function e(s){window.setTimeout(function(){if(s<t.length){var n=i(s),o=n.index+1;r.instanceOfQueuedCharacter(n)&&this.addChar(n),e.bind(this)(o)}}.bind(this),r.getWaitTime(n))}).bind(this)(0)}static getWaitTime(e){switch(e){case"fast":return 20;case"slow":return 50;case"very-slow":return 200}}static instanceOfQueuedCharacter(e){return void 0!==e.character}addChar(e){document.querySelector("[data-index='"+e.index+"']").classList.remove("hidden");this.blipNum++," "==e.character&&(this.blipNum=0)}}t.TextBox=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.CourtRecord=class{constructor(){this.element=document.createElement("div"),this.element.classList.add("court-record","text")}}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9pcmlzLnRzIiwid2VicGFjazovLy8uL3NyYy9zdG9yeS9zdG9yeS1tYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy92aXN1YWxzLnRzIiwid2VicGFjazovLy8uL3NyYy91c2VyLWludGVyZmFjZS9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXNlci1pbnRlcmZhY2UvdGV4dC1ib3gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VzZXItaW50ZXJmYWNlL2NvdXJ0LXJlY29yZC50cyJdLCJuYW1lcyI6WyJpbnN0YWxsZWRNb2R1bGVzIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsIm1vZHVsZUlkIiwiZXhwb3J0cyIsIm1vZHVsZSIsImkiLCJsIiwibW9kdWxlcyIsImNhbGwiLCJtIiwiYyIsImQiLCJuYW1lIiwiZ2V0dGVyIiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsInIiLCJTeW1ib2wiLCJ0b1N0cmluZ1RhZyIsInZhbHVlIiwidCIsIm1vZGUiLCJfX2VzTW9kdWxlIiwibnMiLCJjcmVhdGUiLCJrZXkiLCJiaW5kIiwibiIsIm9iamVjdCIsInByb3BlcnR5IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJwIiwicyIsImdhbWUiLCJJcmlzIiwiaGlkZUJvdHRvbUJhciIsIndpbmRvdyIsInNjcm9sbFRvIiwiZG9jdW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJlbGVtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInN0b3J5X21hbmFnZXJfMSIsInZpc3VhbHNfMSIsInVzZXJfaW50ZXJmYWNlXzEiLCJbb2JqZWN0IE9iamVjdF0iLCJwYXRoIiwidGhpcyIsInRvdWNoU3RhcnRlZCIsInVzZXJJbnRlcmZhY2UiLCJVc2VySW50ZXJmYWNlIiwidmlzdWFscyIsIlZpc3VhbHMiLCJzdG9yeU1hbmFnZXIiLCJTdG9yeU1hbmFnZXIiLCJjdXJyZW50Q3VlIiwic3BlZWNoIiwiZ29Ub05leHRTcGVlY2giLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiZ3VpV3JhcHBlciIsInRleHRCb3giLCJzaG93VGV4dCIsImNoYXJhY3RlciIsImN1cnJlbnRTcGVlY2giLCJhZHZhbmNlIiwiY3VycmVudEVwaXNvZGVQb3NpdGlvbiIsImN1cnJlbnRDaGFwdGVyUG9zaXRpb24iLCJjdXJyZW50Q3VlUG9zaXRpb24iLCJjdXJyZW50U3BlZWNoUG9zaXRpb24iLCJfY3VycmVudEV2aWRlbmNlIiwicmVxdWVzdCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNlbmQiLCJjb25zb2xlIiwibG9nIiwicmVzcG9uc2VUZXh0Iiwic3RvcnkiLCJKU09OIiwicGFyc2UiLCJlcGlzb2RlcyIsImNoYXB0ZXJzIiwiY29udGVudCIsImN1ZSIsInVuZGVmaW5lZCIsImN1cnJlbnRDaGFwdGVyIiwiY3VycmVudEVwaXNvZGUiLCJjdXJyZW50RXZpZGVuY2UiLCJuZXdldmlkZW5jZSIsInB1c2giLCJpZCIsImltYWdlIiwibGVuZ3RoIiwicmVnaXN0ZXIiLCJjYW52YXMiLCJjb250ZXh0IiwiZ2V0Q29udGV4dCIsInJlY3QiLCJ0ZXh0X2JveF8xIiwiY291cnRfcmVjb3JkXzEiLCJUZXh0Qm94IiwiY291cnRSZWNvcmQiLCJDb3VydFJlY29yZCIsInNwZWFrZXJFbGVtZW50IiwidGV4dEVsZW1lbnQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsInJlbW92ZSIsInRleHRDb250ZW50IiwiYmxpcE51bSIsImlzRmluaXNoZWQiLCJzcGVha2VyIiwidGV4dCIsImNsZWFyIiwic3BlZWQiLCJwYXJzZUNoYXIiLCJpbmRleCIsImNvbW1hbmQiLCJwYXJhbXMiLCJwYXJhbVN0cmluZyIsImoiLCJzcGxpdCIsImUiLCJjaGFyIiwiaW5zdGFuY2VPZlF1ZXVlZENoYXJhY3RlciIsImNoYXJFbGVtZW50IiwiZGF0YXNldCIsIm5leHRDaGFyIiwic2V0VGltZW91dCIsIm5leHRJbmRleCIsImFkZENoYXIiLCJnZXRXYWl0VGltZSIsInF1ZXJ5U2VsZWN0b3IiXSwibWFwcGluZ3MiOiJhQUNBLElBQUFBLEVBQUEsR0FHQSxTQUFBQyxFQUFBQyxHQUdBLEdBQUFGLEVBQUFFLEdBQ0EsT0FBQUYsRUFBQUUsR0FBQUMsUUFHQSxJQUFBQyxFQUFBSixFQUFBRSxHQUFBLENBQ0FHLEVBQUFILEVBQ0FJLEdBQUEsRUFDQUgsUUFBQSxJQVVBLE9BTkFJLEVBQUFMLEdBQUFNLEtBQUFKLEVBQUFELFFBQUFDLElBQUFELFFBQUFGLEdBR0FHLEVBQUFFLEdBQUEsRUFHQUYsRUFBQUQsUUFLQUYsRUFBQVEsRUFBQUYsRUFHQU4sRUFBQVMsRUFBQVYsRUFHQUMsRUFBQVUsRUFBQSxTQUFBUixFQUFBUyxFQUFBQyxHQUNBWixFQUFBYSxFQUFBWCxFQUFBUyxJQUNBRyxPQUFBQyxlQUFBYixFQUFBUyxFQUFBLENBQTBDSyxZQUFBLEVBQUFDLElBQUFMLEtBSzFDWixFQUFBa0IsRUFBQSxTQUFBaEIsR0FDQSxvQkFBQWlCLGVBQUFDLGFBQ0FOLE9BQUFDLGVBQUFiLEVBQUFpQixPQUFBQyxZQUFBLENBQXdEQyxNQUFBLFdBRXhEUCxPQUFBQyxlQUFBYixFQUFBLGNBQWlEbUIsT0FBQSxLQVFqRHJCLEVBQUFzQixFQUFBLFNBQUFELEVBQUFFLEdBRUEsR0FEQSxFQUFBQSxJQUFBRixFQUFBckIsRUFBQXFCLElBQ0EsRUFBQUUsRUFBQSxPQUFBRixFQUNBLEtBQUFFLEdBQUEsaUJBQUFGLFFBQUFHLFdBQUEsT0FBQUgsRUFDQSxJQUFBSSxFQUFBWCxPQUFBWSxPQUFBLE1BR0EsR0FGQTFCLEVBQUFrQixFQUFBTyxHQUNBWCxPQUFBQyxlQUFBVSxFQUFBLFdBQXlDVCxZQUFBLEVBQUFLLFVBQ3pDLEVBQUFFLEdBQUEsaUJBQUFGLEVBQUEsUUFBQU0sS0FBQU4sRUFBQXJCLEVBQUFVLEVBQUFlLEVBQUFFLEVBQUEsU0FBQUEs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LE9BQ0QsT0FBTyxHQUNYLElBQUssWUFDRCxPQUFPLEtBSW5CdEUsaUNBQWlDK0UsR0FHN0IsWUFBMEJ0QyxJQUFuQnNDLEVBQUs1RCxVQUdoQm5CLFFBQVErRSxHQUNjdkYsU0FBU2dHLGNBQWMsZ0JBQWtCVCxFQUFLUCxNQUFRLE1BRTVEMUQsVUFBVWlELE9BQU8sVUFlN0I3RCxLQUFLK0QsVUFDaUIsS0FBbEJjLEVBQUs1RCxZQUNMakIsS0FBSytELFFBQVUsSUFySjNCaEgsRUFBQXdHLHlGQ1BBeEcsRUFBQTBHLFlBQUEsTUFHSTNELGNBQ0lFLEtBQUtQLFFBQVVILFNBQVNxQixjQUFjLE9BQ3RDWCxLQUFLUCxRQUFRbUIsVUFBVUMsSUFBSSxlQUFlIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgeyBJcmlzIH0gZnJvbSBcIi4vaXJpc1wiO1xyXG5cclxudmFyIGdhbWUgPSBuZXcgSXJpcyhcImh0dHBzOi8vcmV2aWV3LnN0LWlnbmF0aS51cy9jaGVtaXN0cnkvc3RvcnkuanNvblwiKTtcclxuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChnYW1lLmVsZW1lbnQpO1xyXG5cclxuXHJcbi8vTm93IGxldCdzIHRhY2tsZSB0aGF0IHN0dXBpZCBib3R0b20gYmFyIG9uIGlPUyBTYWZhcmlcclxuZnVuY3Rpb24gaGlkZUJvdHRvbUJhcigpIHtcclxuICAgIHdpbmRvdy5zY3JvbGxUbygwLDApO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKDAsMSk7XHJcbn1cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgaGlkZUJvdHRvbUJhcik7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBoaWRlQm90dG9tQmFyKTsiLCJpbXBvcnQgeyBTdG9yeU1hbmFnZXIgfSBmcm9tIFwiLi9zdG9yeS9zdG9yeS1tYW5hZ2VyXCI7XHJcbmltcG9ydCB7IFZpc3VhbHMgfSBmcm9tIFwiLi92aXN1YWxzXCI7XHJcbmltcG9ydCB7IFVzZXJJbnRlcmZhY2UgfSBmcm9tIFwiLi91c2VyLWludGVyZmFjZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIElyaXMge1xyXG4gICAgc3RvcnlNYW5hZ2VyOiBTdG9yeU1hbmFnZXI7XHJcbiAgICB1c2VySW50ZXJmYWNlOiBVc2VySW50ZXJmYWNlO1xyXG4gICAgdmlzdWFsczogVmlzdWFscztcclxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgdG91Y2hTdGFydGVkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBjb25zdHJ1Y3RvcihwYXRoOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnVzZXJJbnRlcmZhY2UgPSBuZXcgVXNlckludGVyZmFjZSgpO1xyXG4gICAgICAgIHRoaXMudmlzdWFscyA9IG5ldyBWaXN1YWxzKCk7XHJcbiAgICAgICAgdGhpcy5zdG9yeU1hbmFnZXIgPSBuZXcgU3RvcnlNYW5hZ2VyKHBhdGgpO1xyXG5cclxuICAgICAgICAvL3RlbXAgY29kZVxyXG4gICAgICAgIGlmICghdGhpcy5zdG9yeU1hbmFnZXIuY3VycmVudEN1ZS5zcGVlY2gpIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9yeU1hbmFnZXIuZ29Ub05leHRTcGVlY2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJnYW1lXCIpO1xyXG4gICAgICAgIHZhciBndWlXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBndWlXcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJpbnRlcmZhY2Utd3JhcHBlclwiKTtcclxuICAgICAgICBndWlXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMudXNlckludGVyZmFjZS50ZXh0Qm94LmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChndWlXcmFwcGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy51c2VySW50ZXJmYWNlLnRleHRCb3guc2hvd1RleHQodGhpcy5zdG9yeU1hbmFnZXIuY3VycmVudEN1ZS5jaGFyYWN0ZXIsIHRoaXMuc3RvcnlNYW5hZ2VyLmN1cnJlbnRTcGVlY2gpO1xyXG5cclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWR2YW5jZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnRvdWNoU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b3VjaFN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hTdGFydGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkdmFuY2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcbiAgICBhZHZhbmNlKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuc3RvcnlNYW5hZ2VyLmdvVG9OZXh0U3BlZWNoKCk7XHJcbiAgICAgICAgdGhpcy51c2VySW50ZXJmYWNlLnRleHRCb3guc2hvd1RleHQodGhpcy5zdG9yeU1hbmFnZXIuY3VycmVudEN1ZS5jaGFyYWN0ZXIsIHRoaXMuc3RvcnlNYW5hZ2VyLmN1cnJlbnRTcGVlY2gpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgU3RvcnkgfSBmcm9tIFwiLi9zdG9yeVwiO1xyXG5pbXBvcnQgeyBDdWUgfSBmcm9tIFwiLi9jdWVcIjtcclxuaW1wb3J0IHsgQ2hhcHRlciB9IGZyb20gXCIuL2NoYXB0ZXJcIjtcclxuaW1wb3J0IHsgRXBpc29kZSB9IGZyb20gXCIuL2VwaXNvZGVcIjtcclxuaW1wb3J0IHsgRXZpZGVuY2UgfSBmcm9tIFwiLi9ldmlkZW5jZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0b3J5TWFuYWdlciB7XHJcbiAgICBwcml2YXRlIHN0b3J5OiBTdG9yeTtcclxuICAgIHByaXZhdGUgY3VycmVudEVwaXNvZGVQb3NpdGlvbjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgY3VycmVudENoYXB0ZXJQb3NpdGlvbjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgY3VycmVudEN1ZVBvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50U3BlZWNoUG9zaXRpb246IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50RXZpZGVuY2U6IEFycmF5PEV2aWRlbmNlPiA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IocGF0aDogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICByZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcGF0aCwgZmFsc2UpO1xyXG4gICAgICAgIHJlcXVlc3Quc2VuZChudWxsKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdG9yeSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgIC8vdGhpcy5zdG9yeSA9IDxTdG9yeT4oSlNPTi5wYXJzZSgneyBcImVwaXNvZGVzXCI6WyB7IFwidGl0bGVcIjpcIlRoZSBTY2llbnRpZmljIFR1cm5hYm91dFwiLCBcImNoYXB0ZXJzXCI6WyB7IFwidGl0bGVcIjpcIlRyaWFsIExvYmJ5XCIsIFwiY29udGVudFwiOlsgeyBcImNoYXJhY3RlclwiOlwiJFJvb2tpZVwiLCBcInNwZWVjaFwiOlsgXCIjI21vZGUodGhvdWdodCkoTXkgbmFtZSBpcyAkUm9va2llLCBhbmQgSW0gYSBkZWZlbmNlIGF0dG9ybmV5LilcIiwgXCIoTW9yZSBzcGVjaWZpY2FsbHksIEkgYW0gYSBzY2llbnRpZmljIGF0dG9ybmV5LS1hbmQgdG9kYXkgaXMgbXkgZmlyc3QgY2FzZS4pXCIgXSB9IF0gfSBdIH0sIHsgXCJ0aXRsZVwiOlwiVHVybmFib3V0IGZvciBGdXR1cml0eVwiLCBcImxvY2tlZFwiOnRydWUgfSBdIH0nKSk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5zdG9yeSk7XHJcbiAgICB9XHJcbiAgICBnZXQgY3VycmVudFNwZWVjaCgpOiBzdHJpbmcge1xyXG4gICAgICAgIHZhciBzcGVlY2ggPSB0aGlzLnN0b3J5LmVwaXNvZGVzW3RoaXMuY3VycmVudEVwaXNvZGVQb3NpdGlvbl0uY2hhcHRlcnNbdGhpcy5jdXJyZW50Q2hhcHRlclBvc2l0aW9uXS5jb250ZW50W3RoaXMuY3VycmVudEN1ZVBvc2l0aW9uXS5zcGVlY2hbdGhpcy5jdXJyZW50U3BlZWNoUG9zaXRpb25dO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNwZWVjaCk7XHJcbiAgICAgICAgcmV0dXJuIHNwZWVjaDtcclxuICAgIH1cclxuICAgIGdldCBjdXJyZW50Q3VlKCk6IEN1ZSB7XHJcbiAgICAgICAgdmFyIGN1ZSA9IHRoaXMuc3RvcnkuZXBpc29kZXNbdGhpcy5jdXJyZW50RXBpc29kZVBvc2l0aW9uXS5jaGFwdGVyc1t0aGlzLmN1cnJlbnRDaGFwdGVyUG9zaXRpb25dLmNvbnRlbnRbdGhpcy5jdXJyZW50Q3VlUG9zaXRpb25dO1xyXG4gICAgICAgIGlmIChjdWUgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRocm93IFwiRXJyb3I6IEZvdW5kIGN1ZSB0byBiZSB1bmRlZmluZWQhXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY29uc29sZS5sb2coY3VlKTtcclxuICAgICAgICByZXR1cm4gY3VlO1xyXG4gICAgfVxyXG4gICAgZ2V0IGN1cnJlbnRDaGFwdGVyKCk6IENoYXB0ZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3J5LmVwaXNvZGVzW3RoaXMuY3VycmVudEVwaXNvZGVQb3NpdGlvbl0uY2hhcHRlcnNbdGhpcy5jdXJyZW50Q2hhcHRlclBvc2l0aW9uXVxyXG4gICAgfVxyXG4gICAgZ2V0IGN1cnJlbnRFcGlzb2RlKCk6IEVwaXNvZGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3J5LmVwaXNvZGVzW3RoaXMuY3VycmVudEVwaXNvZGVQb3NpdGlvbl07XHJcbiAgICB9XHJcbiAgICBnZXQgY3VycmVudEV2aWRlbmNlKCk6IEFycmF5PEV2aWRlbmNlPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRFdmlkZW5jZTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRDdWUubmV3ZXZpZGVuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VycmVudEV2aWRlbmNlLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogdGhpcy5jdXJyZW50Q3VlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5jdXJyZW50Q3VlLm5ld2V2aWRlbmNlLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2U6IHRoaXMuY3VycmVudEN1ZS5pbWFnZSA/IHRoaXMuY3VycmVudEN1ZS5pbWFnZSA6IFwiaHR0cHM6Ly9wcmV2aWV3cy4xMjNyZi5jb20vaW1hZ2VzL2lxb25jZXB0L2lxb25jZXB0MDkwMS9pcW9uY2VwdDA5MDEwMDA5NC80MjIxNDE3LWEtd2hpdGUtd3JpbmtsZWQtcGllY2Utb2YtcGFwZXItYmFja2dyb3VuZC1mb3Itc2xpZGVzLWJyb2NodXJlcy1hbmQtcHJlc2VudGF0aW9ucy0uanBnXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYWR2YW5jZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50Q3VlLnNwZWVjaCAmJiB0aGlzLmN1cnJlbnRDdWUuc3BlZWNoLmxlbmd0aCAtIDEgPiB0aGlzLmN1cnJlbnRTcGVlY2hQb3NpdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTcGVlY2hQb3NpdGlvbisrO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFkdmFuY2VkIHRvIG5leHQgc3BlZWNoLiBOZXcgcG9zaXRpb246IFwiICsgdGhpcy5jdXJyZW50U3BlZWNoUG9zaXRpb24pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50Q2hhcHRlci5jb250ZW50Lmxlbmd0aCA+IHRoaXMuY3VycmVudEN1ZVBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEN1ZVBvc2l0aW9uKys7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFNwZWVjaFBvc2l0aW9uID0gMDtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBZHZhbmNlZCB0byBuZXh0IGN1ZS5cIik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRFcGlzb2RlLmNoYXB0ZXJzLmxlbmd0aCA+IHRoaXMuY3VycmVudENoYXB0ZXJQb3NpdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDaGFwdGVyUG9zaXRpb24rKztcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3BlZWNoUG9zaXRpb24gPSAwO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDdWVQb3NpdGlvbiA9IDA7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWR2YW5jZWQgdG8gbmV4dCBjaGFwdGVyLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnb1RvTmV4dFNwZWVjaCgpIHtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5hZHZhbmNlKCk7XHJcbiAgICAgICAgfSB3aGlsZSAoIXRoaXMuY3VycmVudEN1ZS5zcGVlY2gpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFZpc3VhbHMge1xyXG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5jbGFzc0xpc3QuYWRkKFwidmlzdWFsc1wiKTtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5yZWN0KDEwLDEwLDIwLDIwKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFRleHRCb3ggfSBmcm9tIFwiLi90ZXh0LWJveFwiO1xyXG5pbXBvcnQgeyBDb3VydFJlY29yZCB9IGZyb20gXCIuL2NvdXJ0LXJlY29yZFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJJbnRlcmZhY2Uge1xyXG4gICAgdGV4dEJveDogVGV4dEJveDtcclxuICAgIGNvdXJ0UmVjb3JkOiBDb3VydFJlY29yZDtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudGV4dEJveCA9IG5ldyBUZXh0Qm94KCk7XHJcbiAgICAgICAgdGhpcy5jb3VydFJlY29yZCA9IG5ldyBDb3VydFJlY29yZCgpO1xyXG4gICAgfVxyXG59IiwiaW50ZXJmYWNlIFF1ZXVlZENoYXJhY3RlciB7XHJcbiAgICBjaGFyYWN0ZXI6IHN0cmluZztcclxuICAgIG1vZGU6IHN0cmluZztcclxuICAgIHNwZWVkOiBzdHJpbmc7XHJcbiAgICBpbmRleDogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dEJveCB7XHJcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHNwZWFrZXJFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIHRleHRFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgIGJsaXBOdW06IG51bWJlcjtcclxuICAgIGlzRmluaXNoZWQ6IGJvb2xlYW47XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGV4dFwiLFwidGV4dC1ib3hcIik7XHJcblxyXG4gICAgICAgIHRoaXMuc3BlYWtlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICB0aGlzLnNwZWFrZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJuYW1lXCIpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLnRleHRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWJsb2NrXCIpO1xyXG5cclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zcGVha2VyRWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudGV4dEVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMudGV4dEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpIHsgdGhpcy50ZXh0RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5yZW1vdmUoKTsgfVxyXG4gICAgICAgIHRoaXMuc3BlYWtlckVsZW1lbnQudGV4dENvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuYmxpcE51bSA9IDA7XHJcbiAgICAgICAgdGhpcy5pc0ZpbmlzaGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBzaG93VGV4dChzcGVha2VyOiBzdHJpbmcsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGVha2VyRWxlbWVudC50ZXh0Q29udGVudCA9IHNwZWFrZXI7XHJcblxyXG4gICAgICAgIC8vdmFyIHF1ZXVlZENoYXJhY3RlcnM6IEFycmF5PFF1ZXVlZENoYXJhY3Rlcj4gPSBbXTtcclxuXHJcbiAgICAgICAgdmFyIHNwZWVkOiBcImZhc3RcIiB8IFwic2xvd1wiIHwgXCJ2ZXJ5LXNsb3dcIiA9IFwiZmFzdFwiO1xyXG4gICAgICAgIHZhciBtb2RlOiBcInNwZWVjaFwiIHwgXCJ0aG91Z2h0XCIgfCBcImVtcGhhc2lzXCIgfCBcIm9iamVjdFwiIHwgXCJxdWVzdGlvblwiID0gXCJzcGVlY2hcIjtcclxuXHJcbiAgICAgICAgdmFyIHBhcnNlQ2hhciA9IGZ1bmN0aW9uIChpbmRleDogbnVtYmVyKTogb2JqZWN0IHtcclxuICAgICAgICAgICAgdmFyIGNoYXIgPSB0ZXh0W2luZGV4XTtcclxuICAgICAgICAgICAgaWYgKCEoY2hhciA9PSBcIiNcIiAmJiB0ZXh0W2luZGV4ICsgMV0gPT0gXCIjXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAvL3JldHVybiBuZXcgUXVldWVkQ2hhcmFjdGVyKHRleHRbaW5kZXhdLCBtb2RlLCBzcGVlZCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHFjaGFyOiBRdWV1ZWRDaGFyYWN0ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyOiB0ZXh0W2luZGV4XSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBtb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVkOiBzcGVlZCxcclxuICAgICAgICAgICAgICAgICAgICBpbmRleDogaW5kZXhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBxY2hhcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9EZXRlcm1pbmluZyB0aGUgY29tbWFuZFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb21tYW5kID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gaW5kZXggKyAyOyB0ZXh0W2ldICE9IFwiKFwiICYmIHRleHQubGVuZ3RoID4gaTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmQgKz0gdGV4dFtpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vRGV0ZXJtaW5pbmcgaXRzIHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1TdHJpbmcgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IGkgKyAxOyB0ZXh0W2pdICE9IFwiKVwiICYmIHRleHQubGVuZ3RoID4gajsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtU3RyaW5nICs9IHRleHRbal07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyA9IHBhcmFtU3RyaW5nLnNwbGl0KFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjb21tYW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtb2RlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlID0gcGFyYW1zWzBdIGFzIFwic3BlZWNoXCIgfCBcInRob3VnaHRcIiB8IFwiZW1waGFzaXNcIiB8IFwib2JqZWN0XCIgfCBcInF1ZXN0aW9uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNwZWVkXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcGVlZCA9IHBhcmFtc1swXSBhcyBcImZhc3RcIiB8IFwic2xvd1wiIHwgXCJ2ZXJ5LXNsb3dcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL3JldHVybiBqICsgMTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBpbmRleDogaiB9O1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIHBhcnNlIGNvbW1hbmQhXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL3JldHVybiBpbmRleCArIDE7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBuZXh0Q2hhcihpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJpbmRleDogXCIgKyBpbmRleCArIFwiICB0ZXh0IGxlbmd0aDogXCIgKyB0ZXh0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA8IHRleHQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoYXIgPSBwYXJzZUNoYXIoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXh0SW5kZXggPSBjaGFyLmluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVGV4dEJveC5pbnN0YW5jZU9mUXVldWVkQ2hhcmFjdGVyKGNoYXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkQ2hhcihjaGFyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbmV4dENoYXIuYmluZCh0aGlzKShuZXh0SW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LmJpbmQodGhpcyksIFRleHRCb3guZ2V0V2FpdFRpbWUoc3BlZWQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgY2hhciA9IHBhcnNlQ2hhcihpKTtcclxuICAgICAgICAgICAgaWYgKCFUZXh0Qm94Lmluc3RhbmNlT2ZRdWV1ZWRDaGFyYWN0ZXIoY2hhcikpIHtcclxuICAgICAgICAgICAgICAgIGkgPSBjaGFyLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGNoYXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgICAgIGNoYXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0ZXh0XCIsIG1vZGUsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICBjaGFyRWxlbWVudC50ZXh0Q29udGVudCA9IHRleHRbaV07XHJcbiAgICAgICAgICAgIGNoYXJFbGVtZW50LmRhdGFzZXQuaW5kZXggPSBcIlwiICsgaTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hhckVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbmV4dENoYXIuYmluZCh0aGlzKSgwKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0V2FpdFRpbWUoc3BlZWQ6IFwiZmFzdFwiIHwgXCJzbG93XCIgfCBcInZlcnktc2xvd1wiKTogbnVtYmVyIHtcclxuICAgICAgICBzd2l0Y2goc3BlZWQpIHtcclxuICAgICAgICAgICAgY2FzZSBcImZhc3RcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiAyMDtcclxuICAgICAgICAgICAgY2FzZSBcInNsb3dcIjpcclxuICAgICAgICAgICAgICAgIHJldHVybiA1MDtcclxuICAgICAgICAgICAgY2FzZSBcInZlcnktc2xvd1wiOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDIwMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGluc3RhbmNlT2ZRdWV1ZWRDaGFyYWN0ZXIoY2hhcjogYW55KTogY2hhciBpcyBRdWV1ZWRDaGFyYWN0ZXIge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coY2hhcik7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhjaGFyLmNoYXJhY3RlciAhPT0gdW5kZWZpbmVkKTtcclxuICAgICAgICByZXR1cm4gY2hhci5jaGFyYWN0ZXIgIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDaGFyKGNoYXI6IFF1ZXVlZENoYXJhY3Rlcik6IHZvaWQge1xyXG4gICAgICAgIHZhciBjaGFyRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1pbmRleD0nXCIgKyBjaGFyLmluZGV4ICsgXCInXVwiKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKFwicmFuXCIpO1xyXG4gICAgICAgIGNoYXJFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XHJcbiAgICAgICAgLyp2YXIgY2hhckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBjaGFyRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGV4dFwiLCBtb2RlKTtcclxuICAgICAgICBjaGFyRWxlbWVudC50ZXh0Q29udGVudCA9IGNoYXJhY3RlcjtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkFkZGVkOiBcIiArIGNoYXJhY3Rlcik7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dEVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hhckVsZW1lbnQpOyovXHJcblxyXG4gICAgICAgIHZhciBpc1Byb25vdW5jZWQgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCI7XHJcblxyXG4gICAgICAgIC8vaWYgKChjaGFyLnNwZWVkICE9IFwiZmFzdFwiIHx8IHRoaXMuYmxpcE51bSAlIDIgPT0gMCkgJiYgaXNQcm9ub3VuY2VkLmluY2x1ZGVzKGNoYXIuY2hhcmFjdGVyLnRvTG93ZXJDYXNlKCkpKSB7XHJcbiAgICAgICAgICAgIC8vbmV3IEF1ZGlvKFwicmVzb3VyY2VzL0RlZXBNYWxlQmxpcC53YXZcIikucGxheSgpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiUGxheWVkIHNvdW5kLCBibGlwJTogXCIgKyB0aGlzLmJsaXBOdW0gJSAyKTtcclxuICAgICAgICAvL31cclxuICAgICAgICB0aGlzLmJsaXBOdW0rKztcclxuICAgICAgICBpZiAoY2hhci5jaGFyYWN0ZXIgPT0gXCIgXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5ibGlwTnVtID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQ291cnRSZWNvcmQge1xyXG4gICAgX3N0YXRlOiBcIm9wZW5lZFwiIHwgXCJjbG9zZWRcIjtcclxuICAgIGVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImNvdXJ0LXJlY29yZFwiLFwidGV4dFwiKTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290IjoiIn0=