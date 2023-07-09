import {
  handleDeletePost,
  handleEditPost,
  profileUserRequest,
  renderPostModal,
} from "./deshboard.js";
import { red } from "./index.js";
import { toast } from "./toast.js";

export async function render(array = []) {
  const ul = document.querySelector(".listPost__container");

  if (array.message) {
    toast(array.message, red);
    array = [];
  }

  ul.innerHTML = "";

  array.forEach((post) => {
    const card = createCard(post);
    ul.appendChild(card);
  });

  handleDeletePost();
  handleEditPost();
}

function createCard({
  id,
  title,
  content,
  user: { username, avatar },
  createdAt,
}) {
  const cardContainer = document.createElement("li");
  const cardTitle = document.createElement("h2");
  const cardTextContainer = document.createElement("p");
  const cardName = document.createElement("h3");
  const cardAvatar = document.createElement("img");
  const cardButtonEdit = document.createElement("button");
  const cardButtonDelete = document.createElement("button");
  const cardButtonAcess = document.createElement("button");
  const cardDate = document.createElement("p");

  cardContainer.classList.add("listPost__card");
  cardTitle.classList.add("listPost__card__title");
  cardTextContainer.classList.add("listPost__card__text");
  cardName.classList.add("listPost__card__name");
  cardAvatar.classList.add("listPost__card__avatar");
  cardButtonEdit.classList.add("listPost__card__button--edit");
  cardButtonDelete.classList.add("listPost__card__button--delete");
  cardButtonAcess.classList.add("listPost__card__button--acess");

  cardTitle.innerText = title;
  cardTextContainer.innerText =
    content.slice(0, 145) + (content.length > 145 ? "..." : "");
  cardName.innerText = username;
  cardAvatar.src = avatar;
  cardAvatar.alt = `${username} foto de perfil`;
  cardButtonEdit.innerText = "Editar";
  cardButtonDelete.innerText = "Excluir";
  cardButtonAcess.innerText = "Acessar publicação";

  cardAvatar.dataset.postId = id;
  cardButtonEdit.dataset.postId = id;
  cardButtonDelete.dataset.postId = id;
  cardButtonAcess.dataset.postId = id;

  cardContainer.appendChild(cardTitle);
  cardContainer.appendChild(cardTextContainer);
  cardContainer.appendChild(cardName);
  cardContainer.appendChild(cardAvatar);
  cardContainer.appendChild(cardButtonEdit);
  cardContainer.appendChild(cardButtonDelete);
  cardContainer.appendChild(cardButtonAcess);

  const formattedDate = formatPostDate(createdAt);
  cardDate.classList.add("dateClass");
  cardDate.innerText = formattedDate;
  cardContainer.appendChild(cardDate);

  cardButtonAcess.addEventListener("click", renderPostModal);

  return cardContainer;
}

function formatPostDate(createdAt) {
  const date = new Date(createdAt);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("pt-BR", options);
}

export function renderUser() {
  const user = profileUserRequest();
  const avatar = document.querySelector(".profile__avatar");
  const username = document.querySelector(".profile__username");

  user.then((user) => {
    avatar.src = user.avatar;
    avatar.alt = `${username} foto de perfil`;
    username.innerText = user.username;
  });
}
