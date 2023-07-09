import { toast } from "./toast.js";

export const url = "http://localhost:3333";
export const green = "#168821";
export const red = "#df1545";

export async function loginRequest(loginBody) {
  const token = await fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginBody),
  })
    .then(async (response) => {
      const responseJson = await response.json();
      if (response.ok) {
        localStorage.setItem("@petInfo:token", responseJson.token);
        toast(
          "Login realizado com sucesso , redirecionando para o seu perfil...",
          green
        );

        setTimeout(() => {
          location.replace("./src/pages/dashboard.html");
        }, 2000);

        return responseJson;
      } else {
        throw new Error(responseJson.message);
      }
    })
    .catch((error) => toast(error.message, red));

  return token;
}

export function handleLogin() {
  const inputsLogin = document.querySelectorAll(".input__login");
  const buttonLogin = document.querySelector(".button__login");
  const spinner = document.querySelector("#spinnerProfile");

  let loginBody = {};
  let count = 0;

  if (buttonLogin) {
    buttonLogin.addEventListener("click", (event) => {
      event.preventDefault();

      inputsLogin.forEach((input) => {
        if (input.value.trim() === "") {
          count++;
        } else {
          loginBody[input.name] = input.value.trim();
        }
      });

      if (count !== 0) {
        count = 0;

        inputsLogin.forEach((input) => {
          if (input.value.trim() === "") {
            toast(`Preencha o campo ${input.name}`, red);
          }
        });
      } else {
        spinner.classList.add("spinner--active");
        setTimeout(() => {
          loginRequest(loginBody);
          spinner.classList.remove("spinner--active");
        }, 3000);
      }
    });
  }
}

export async function getProfile() {
  const token = localStorage.getItem("@petInfo:token");
  const profileInfos = await fetch(`${url}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const responseJson = await response.json();

      if (response.ok) {
        return responseJson;
      } else {
        throw new Error(responseJson.message);
      }
    })
    .catch((error) => toast(error.message));
  return profileInfos;
}

function buttonReturnCadastro() {
  const buttonReturn = document.querySelector(".button__cadastro--page");
  const spinner = document.querySelector("#spinnerProfile");
  if (buttonReturn) {
    buttonReturn.addEventListener("click", () => {
      spinner.classList.add("spinner--active");
      setTimeout(() => {
        location.replace("./src/pages/cadastro.html");
      }, 2000);
    });
  }
}

handleLogin();
buttonReturnCadastro();
