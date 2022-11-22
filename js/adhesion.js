const URL = "https://api.nzilaleaders.com/v1/api/adhesion";

let file = null;

window.addEventListener('load', async () => {
  const adhesions = await fetchAllAdhesion();
  displayAllAdherants(adhesions);
  document.getElementById("send").addEventListener("click", async () => {
    await postAdhesion();
  })
})

async function fetchAllAdhesion() {
  const res = await fetch(URL, {
    method: "GET",
  });

  if (res.status == 200) {
    return await res.json();
  }
}

async function postAdhesion() {

  if(!document.getElementById("accept").checked){
    alert("Vous devez accepter la condition ci-dessus avant d'envoyer votre demande");
    return;
  }
  
  document.getElementById("loader").classList.add("loading");

  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const email = document.getElementById("email").value;
  const telephone = document.getElementById("telephone").value;
  const adresse = document.getElementById("adresse").value;
  const ville = document.getElementById("ville").value;
  const date_naissance = document.getElementById("date_naissance").value;
  const lieu_naissance = document.getElementById("lieu_naissance").value;

  if (!nom || !prenom || !email || !telephone || !adresse || !ville || !date_naissance || !lieu_naissance) {
    alert("Veuillez renseignez toutes les informations du formulaire avant soumission");
    document.getElementById("loader").classList.remove("loading");
    return;
  }

  if (!file) {
    alert("N'oubliez pas votre photo");
    document.getElementById("loader").classList.remove("loading");
    return;
  }

  const formData = new FormData();

  formData.append('nom', nom);
  formData.append('prenom', prenom);
  formData.append('email', email);
  formData.append('telephone', telephone);
  formData.append('adresse', adresse);
  formData.append('ville', ville);
  formData.append('date_naissance', date_naissance);
  formData.append('lieu_naissance', lieu_naissance);
  formData.append('photo', file, "photo");

  try {
    const res = await fetch(URL, {
      method: "POST",
      body: formData
    });

    if (res.status == 200) {
      document.getElementById("loader").classList.remove("loading");
      clear();
      alert("Votre demande d'adhésion a été envoyé avec succès");
    } else {
      document.getElementById("loader").classList.remove("loading");
      alert("Votre demande d'adhésion n'a pas pu être envoyé, veuillez essayer à nouveau");
    }
  } catch (err) {
    document.getElementById("loader").classList.remove("loading");
    alert("Votre demande d'adhesion n'a pas pu être envoyé, veuillez essayer à nouveau");
    console.log(err);
  }
}

function clear() {
  document.getElementById("nom").value = "";
  document.getElementById("prenom").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telephone").value = "";
  document.getElementById("adresse").value = "";
  document.getElementById("ville").value = "";
  document.getElementById("photo").src = "#";
  file = null;
}

function displayAllAdherants(adhesions) {
  const adherants = document.getElementById("adherants");

  const p = document.getElementById("adherant-count");

  p.innerHTML = "L'Association NZILA Leaders compte une pléiade membres au Gabon";

  let str = "";
  for (let i = 0; i < adhesions.length; i++) {
    const adhesion = adhesions[i];
    if(!(adhesion.fraisLink && adhesion.fraisLink.paiement_status == "Success")){
      continue;
    }
    if (!adhesion.isValidate) {
      continue;
    }
    let img = `
          <img src="${adhesions[i].photoURL}" onerror="onImgErrorSmall(this)">
          `;
    let item = `<img src="/assets/logo.png" onerror="onImgErrorSmall(this)">`;
    str += `
      <div class="adherant flex flex-column flex1-start flex2-center gap05">
        <div class="photo-container">
           ${adhesion.photoURL ? img : item}
        </div>
        <span class="text-align-center text-p10 color-primary text-bold">${adhesion.nom} ${adhesion.prenom}</span>
        <span class="text-align-center text-p color-gray3">${adhesion.poste}</span>
      </div>
    `;
  }
  adherants.innerHTML = str;
}

function onImgErrorSmall(source) {
  source.src = "/assets/logo.png";
  // disable onerror to prevent endless loop
  source.onerror = "";
  return true;
}


function readURL(input) {
  var url = input.value;

  var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
  if (input.files && input.files[0] && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
    var reader = new FileReader();
    file = input.files[0];

    reader.onload = function (e) {
      document.getElementById("photo").src = e.target.result;
    }
    reader.readAsDataURL(input.files[0]);
  }
}