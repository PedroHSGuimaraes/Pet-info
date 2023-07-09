import { render, renderUser } from "./render.js";
import { green, red, url } from "./index.js";
import { handModal } from "./modal.js";
import { toast } from "./toast.js";

export async function profileUserRequest() {
  const token = localStorage.getItem("@petInfo:token");
  const profileUser = await fetch(`${url}/users/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
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

  return profileUser;
}

export async function createPost(postBody) {
  const token = localStorage.getItem("@petInfo:token");
  const newPost = await fetch(`${url}/posts/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  })
    .then(async (response) => {
      const responseJson = await response.json();

      if (response.ok) {
        toast("Post criado com sucesso", green);
        return responseJson;
      } else {
        throw new Error(responseJson.message);
      }
    })
    .catch((error) => toast(error.message));

  return newPost;
}

export async function searchPosts() {
  const token = localStorage.getItem("@petInfo:token");
  const posts = await fetch(`${url}/posts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      const responseJson = response.json();

      if (response.ok) {
        return responseJson;
      } else {
        throw new Error(responseJson.message);
      }
    })
    .catch((error) => toast(error.message));

  return posts;
}

export async function searchPostID(postId, requestBody) {
  const token = localStorage.getItem("@petInfo:token");
  const postsId = await fetch(`${url}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
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

  return postsId;
}

export async function deletePost(postId) {
  const token = localStorage.getItem("@petInfo:token");
  const deletePost = await fetch(`${url}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const responseJson = await response.json();

      if (response.ok) {
        toast("Post deletado com sucesso", green);
        return responseJson;
      } else {
        throw new Error(responseJson.message);
      }
    })
    .catch((error) => toast(error.message));

  return deletePost;
}

function authentication() {
  const token = localStorage.getItem("@petInfo:token");
  if (!token) {
    location.replace("../../");
  }
}

async function showPost() {
  const allPosts = await searchPosts();

  render(allPosts.reverse());
}

export function handleNewPost() {
  const inputs = document.querySelectorAll(".create__post");
  const button = document.querySelector("#addPostSubmit");
  const modalControler = document.querySelector(".modal__controller--post");
  const newPost = {};
  let count = 0;

  button.addEventListener("click", async (event) => {
    event.preventDefault();

    inputs.forEach((input) => {
      if (input.value.trim() === "") {
        count++;
      }

      newPost[input.name] = input.value;
    });

    if (count !== 0) {
      count = 0;
      toast("Por favor preencha os campos necessários", red);
    } else {
      const confirmed = confirm("Tem certeza de que deseja criar o post?");

      if (confirmed) {
        await createPost(newPost);
        modalControler.close();

        showPost();

        inputs.forEach((input) => {
          input.value = "";
        });
      }
    }
  });
}
export function handleEditPost() {
  const buttonsEdit = document.querySelectorAll(
    ".listPost__card__button--edit"
  );

  buttonsEdit.forEach((buttonEdit) => {
    buttonEdit.addEventListener("click", async (event) => {
      const modalControler = document.querySelector(".modal__controller--edit");
      const inputs = document.querySelectorAll(".add__inputs");
      const submitButton = document.querySelector("#postSubmitEdit");
      modalControler.showModal();
      const newPost = {};
      let count = 0;
      const postId = event.target.dataset.postId;
      const post = await searchPostID(postId, newPost);

      const currentUser = getCurrentUser();
      if (currentUser !== currentUser) {
        toast("Você não tem permissão para editar este post.");
      }

      inputs.forEach((input) => {
        input.value = post[input.name];
      });

      submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        inputs.forEach((input) => {
          if (input.value === "") {
            count++;
          }

          newPost[input.name] = input.value;
        });

        if (count !== 0) {
          count = 0;
          toast("Por favor preencha os campos necessários", red);
        } else {
          const confirmed = confirm("Tem certeza de que deseja editar o post?");

          if (confirmed) {
            await searchPostID(postId, newPost);
            modalControler.close();

            inputs.forEach((input) => {
              input.value = "";
            });
            toast("Post editado com sucesso", green);
            showPost();
          }
        }
      });
    });
  });
}

export function handleDeletePost() {
  const buttonsDelete = document.querySelectorAll(
    ".listPost__card__button--delete"
  );

  buttonsDelete.forEach((buttonDelete) => {
    buttonDelete.addEventListener("click", async (event) => {
      const confirmed = confirm("Tem certeza de que deseja excluir o post?");

      if (confirmed) {
        const postId = event.target.dataset.postId;
        const post = await searchPostID(postId);

        const currentUser = getCurrentUser();
        if (currentUser !== currentUser) {
          toast("Você não tem permissão para excluir este post.");
          return;
        }

        await deletePost(postId);
        showPost();
        toast("Post deletado com sucesso", green);
      }
    });
  });
}
function logoutProfile() {
  const logoutButton = document.querySelector(".logout");
  logoutButton.addEventListener("click", () => {
    const confirmed = confirm("Tem certeza de que deseja sair?");

    if (confirmed) {
      localStorage.clear();
      location.replace("../../");
    }
  });
}

export async function renderPostModal(event) {
  try {
    const postId = event.target.dataset.postId;
    const posts = await searchPosts();

    const post = posts.find((p) => p.id === postId);

    if (!post) {
      toast("Post não encontrado");
      return;
    }

    const modal = document.querySelector("#modal");
    const modalTitle = document.querySelector("#modalTitle");
    const modalContentText = document.querySelector("#modalContentText");
    const modalCloseButton = document.querySelector("#modalCloseButton1");
    const imgModal = document.querySelector(".img__modal__post");

    modalTitle.innerText = post.title;
    modalContentText.innerText = post.content;
    imgModal.src = post.user.avatar;
    imgModal.alt = `${post.username} foto de perfil`;
    modal.showModal();
    modalCloseButton.addEventListener("click", () => {
      modal.close();
    });
  } catch (error) {
    toast(error.message);
  }
}
export function handleAccessPost() {
  const accessPostButtons = document.querySelectorAll(
    ".listPost__card__button--acess"
  );

  accessPostButtons.forEach((button) => {
    button.addEventListener("click", renderPostModal);
  });
}

function getCurrentUser() {
  const token = localStorage.getItem("@petInfo:token");
  if (token) {
    return token;
  }
}

authentication();
handModal();
showPost();
handleNewPost();
renderUser();
logoutProfile();
handleAccessPost();
