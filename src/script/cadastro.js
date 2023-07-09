import { green, red, url } from "./index.js";
import { toast } from "./toast.js";

async function createUser(requestBody) {
  const newUser = await fetch(`${url}/users/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then(async (response) => {
      const responseJson = await response.json();
      if (response.ok) {
        toast("Usuario cadastrado com sucesso", green);
        return responseJson;
      } else {
        throw new Error(responseJson.message);
      }
    })
    .catch((error) => toast(error.message, red));
  return newUser;
}

function handleNewUser() {
  const inputs = document.querySelectorAll("input");
  const button = document.querySelector("#cadastro");
  const spinner = document.querySelector("#spinnerCadastro");
  let count = 0;
  let newUser = {};

  button.addEventListener("click", (event) => {
    event.preventDefault();

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        count++;
      } else {
        newUser[input.name] = input.value.trim();
      }
    });

    if (count !== 0) {
      toast("Preencha todos os campos", "red", "red");
      count = 0;
    } else {
      spinner.classList.add("spinner--active");
      setTimeout(() => {
        createUser(newUser);
        spinner.classList.remove("spinner--active");
      }, 2000);
    }
  });
}

function returnLoginPage() {
  const button = document.querySelector("#voltar");
  const spinner = document.querySelector("#spinnerCadastro");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    spinner.classList.add("spinner--active");
    setTimeout(() => {
      location.replace(" ../../");
    }, 2000);
  });
}

handleNewUser();
returnLoginPage();
