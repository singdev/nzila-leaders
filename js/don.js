const URL = "https://nzila-backend.pivot40.tech/v1/api";

let montant = 200;
const stepHigh = 10000;
const stepLow = 100;

window.addEventListener("load", () => {
  invite();
  pay();
})

displayMontant();
document.getElementById("high").innerHTML = "+/- " + stepHigh + " CFA";
document.getElementById("low").innerHTML = "+/- " + stepLow + " CFA";

function addHigh(ratio) {
  addMontant(ratio, stepHigh);
}

function addLow(ratio) {
  addMontant(ratio, stepLow);
}

function addMontant(ratio, step) {
  montant += ratio * step;
  if (montant < 200) {
    montant = 200;
  }
  displayMontant();
}

function displayMontant() {
  document.getElementById("montant").innerHTML = montant + " CFA";
}

async function createDon(data) {
  const res = await fetch(`${URL}/don`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    return null;
  }
}

async function createPaiement() {
  const data = {
    paiement_reference: generateReference("DON", 3),
    paiement_amount: montant,
    paiement_date: new Date()
  };
  const res = await fetch(`${URL}/paiement`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    return null;
  }
}

async function getPaiementLink(paiement) {
  const route = "/pay-with/link/" + paiement._id;
  const res = await fetch(`${URL}/paiement${route}`, {
    method: "GET",
  });
  if (res.status == 200) {
    return await res.json();
  } else {
    return null;
  }
}

function generateReference(libelle, index) {
  const date = new Date();
  const d = date.getDate() < 10 ? '0' : '' + date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear() - 2000;
  return libelle + d + m + y + (index * 1000 + Math.floor(Math.random() * 999));
}

function pay() {
  document.getElementById("pay").addEventListener("click", async () => {
    document.getElementById("loader").classList.add("loading");
    try {
      const paiement = await createPaiement();
      if (paiement) {
        const data = {
          nom: document.getElementById("nom").value,
          telephone: document.getElementById("telephone").value,
          email: document.getElementById("email").value,
          date: new Date(),
          montant: montant,
          pays: document.getElementById("pays").value,
          paiement: paiement._id
        };
        if (!data.nom || data.nom == "" || !data.email || data.email == "") {
          alert("Les informations suivant sont importante pour nous, veuillez les renseigner s'il vous plait:\n -Nom\n -Prénom\n -Adresse email");
          document.getElementById("loader").classList.remove("loading");
          return;
        }
        const don = await createDon(data);
        if (don) {
          const link = await getPaiementLink(paiement);
          if (link) {
            window.open(link.link, "blank");
          } else {
            alert("Echec de la récupération du lien de paiement, veuillez réessayer");
          }
        } else {
          alert("Echec de l'enregistrement du don, veuillez réessayer");
        }
      } else {
        alert("Echec de l'initialisation, veuillez réessayer");
      }
    } catch (err) {
      console.log(err);
    }
    document.getElementById("loader").classList.remove("loading");
    document.getElementById("nom").value = "";
    document.getElementById("telephone").value = "";
    document.getElementById("email").value = "";
    montant = 200;
    displayMontant();
  })
}

function invite() {
  document.getElementById("plan").addEventListener("click", async () => {
    document.getElementById("loader2").classList.add("loading");
    try {
      const data = {
        nom: document.getElementById("nom2").value,
        telephone: document.getElementById("telephone2").value,
        email: document.getElementById("email2").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value,
        pays: document.getElementById("pays2").value,
        type: "Nature",
      };
      if (!data.nom || data.nom == "" || !data.email || data.email == "" || !data.date || data.date == "" || !data.description || data.description == "") {
        alert("Les informations suivant sont importante pour nous, veuillez les renseigner s'il vous plait:\n -Nom\n -Prénom\n -Adresse email\n-Date\n-Description");
        document.getElementById("loader2").classList.remove("loading");
        return;
      }
      const don = await createDon(data);
      if (don) {
        alert("MERCI BEAUCOUP pour votre don !");
      } else {
        alert("Echec de l'enregistrement du don, veuillez réessayer");
      }
    } catch (err) {
      console.log(err);
    }
    document.getElementById("loader2").classList.remove("loading");
    document.getElementById("nom2").value = "";
    document.getElementById("telephone2").value = "";
    document.getElementById("email2").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
  })
}