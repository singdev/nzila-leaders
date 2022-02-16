
function selectTabAndPane(index){
  const tabs = document.querySelectorAll(".tab");
  const panes = document.querySelectorAll(".pane");
  for(let i = 0; i < tabs.length; i++){
    tabs[i].classList.remove("selected-tab");
    panes[i].classList.remove("selected-pane");
  }
  tabs[index].classList.add("selected-tab");
  panes[index].classList.add("selected-pane");
  
}

selectTabAndPane(0);