const baseURl = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const cohortNum = "2412-FTB-MT-WEB-PT";
const list = document.querySelector("#list");
const partyView = document.querySelector("#parties");
const addButton = document.querySelector("#addButton");
const removeButton = document.querySelector("#removeButton");
const updateButon = document.querySelector("#update");
let form = document.querySelector("form");
let parties;
let selection = {
  item: "",
  id: "",
};

let selectedItem;
let selectedId;

let state = {
  name: "",
  description: "",
  date: "",
  location: "",
};

const highlightSelected = () => {
  let partyArray = Array.from(list.children);
  console.log("Party Array: ", partyArray);
  partyArray.forEach((party) => {
    if (party.childNodes[2].data === selection.id) {
      party.setAttribute("class", "highlight");
      form.name.value = party.childNodes[0].data.slice(6); 
      form.description.value = party.childNodes[4].data.slice(13);   
      form.location.value = party.childNodes[8].data.slice(10);
      //console.log(party.childNodes[6].data.slice(6, 27));
      //let thisNewDate =  Date.parse(party.childNodes[6].data.slice(6, 27));
      //console.log('NEW DATE: ' , thisNewDate);
      form[2].valueAsNumber = Date.parse(party.childNodes[6].data.slice(6,27));
      console.log("Here is the form: ", form)
      //form.date.valueAsDate
      //party.childNodes[6];
    //   console.log(party.childNodes[6].data.slice(7));
    //   console.log("here " ,form.name);  
    } else {
      party.setAttribute("class", "partyDiv");
    }
  });
};

const getParties = async () => {
  let partyData = await fetch(`${baseURl}/${cohortNum}/events`);
  let partyDataArray = await partyData.json();
  let partyDataFinal = await partyDataArray.data;
  parties = await partyDataFinal;
  console.log(parties);
};

const renderParties = async () => {
  while (list.hasChildNodes()) {
    list.removeChild(list.lastElementChild);
    
  }

  parties.forEach((party) => {
    const newParty = document.createElement(`div`);
    newParty.innerText = `Name: ${party.name}\nID: ${party.id}\nDescription: ${party.description}\nDate: ${party.date.slice(0,10)} \nLocation: ${party.location}`;
    newParty.setAttribute("class", "partyDiv");
    let partyHeight = partyView.clientHeight / 4 - 25;   
    let partyWidth = partyView.clientWidth / 3 - 25;    
    newParty.setAttribute( "style",
      `border: 2px solid black; width: ${partyWidth}px; height: ${partyHeight}px; overflow: auto`
    );
    newParty.addEventListener("click", (listing) => {     
      selection.item = listing.target;
      selection.id = listing.target.childNodes[2].data;
      highlightSelected();
      console.log(selection);
    });
    
    list.append(newParty);
    console.log("Added Element");
  });
};

const addParty = async (party) => {
  try {
    const response = await fetch(`${baseURl}/${cohortNum}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(party),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
  } catch (error) {
    alert("BE SURE TO ENTER INFORMATION IN ALL THE FIELDS BEFORE ADDING");
    console.error(error);
  }
};

const updateParty = async (party) => {
    try {
      const response = await fetch(`${baseURl}/${cohortNum}/events/${selection.id.slice(4)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(party),
      });
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error.message);
      }
    } catch (error) {
      alert("BE SURE TO SELECT A PARTY BEFORE UPDATING")  
      console.error(error);
    }
  };

const removeParty = async () => {
    if(selection.id === "" || selection.description === "" || selection.date === "" || selection.location === ""){
        alert("BE SURE TO SELECT A PARTY BEFORE REMOVING");
        return;
    }
  try {
    const response = await fetch(
      `${baseURl}/${cohortNum}/events/${selection.id.slice(4)}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    alert("BE SURE TO SELECT A PARTY BEFORE REMOVING");
    console.error(error);
  }
};

addButton.addEventListener("click", (event) => {
  event.preventDefault();
  state.name = form[0].value;
  state.description = form[1].value;
  state.date = form[2].valueAsDate;
  state.location = form[3].value;
  console.log(state);
  addProcedure();
});

removeButton.addEventListener("click", (event) => {
  event.preventDefault();
  removeProcedure();
});

updateButon.addEventListener("click", (event) => {
  event.preventDefault();
  state.name = form[0].value;
  state.description = form[1].value;
  state.date = form[2].valueAsDate;
  state.location = form[3].value;
  console.log(state);
  updateProcedure();
});

const addProcedure = async () => {
  await addParty(state);
  await getParties();
  await renderParties();
};

const updateProcedure = async() => {
    await updateParty(state);
    await getParties();
    await renderParties();
}

const removeProcedure = async () => {
  await removeParty();
  await getParties();
  await renderParties(); 
};

const startup = async () => {
  await getParties();
  await renderParties();
};

window.addEventListener('resize', renderParties);

startup();
