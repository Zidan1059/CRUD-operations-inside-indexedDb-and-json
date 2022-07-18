let url = "https://jsonplaceholder.typicode.com/users";

// create database

const nameValue = document.getElementById("name-value");
const emailValue = document.getElementById("email-value");
const addressValue = document.getElementById("address-value");
const phoneValue = document.getElementById("phone-value");
//Edit Variable
const nameEditValue = document.getElementById("name-edit-value");
const emailEditValue = document.getElementById("email-edit-value");
const addressEditValue = document.getElementById("address-edit-value");
const phoneEditValue = document.getElementById("phone-edit-value");

//btn and popups
const btn = document.querySelector("#addBtn");
const btnEdit = document.querySelector("#editSubmit");
const btnDelete = document.querySelector("#deletebtn");
const editclr = document.getElementById("editUser");
//deleting notification
const deleteYes = document.getElementById("yesbtn");
const deleteNo = document.getElementById("nobtn");
let inputs = document.querySelectorAll("input");
//email validation
let regExp = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

const userList = document.querySelector(".user-table");

const myList = document.getElementById("tbody");
let newListItem = document.createElement("tr");

document.querySelector("#show-login").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("active");
});
document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
  });

document
  .querySelector(".popup2 .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup2").classList.remove("active");
  });

//const addUserForm = document.querySelector(".add-user-form");
const editUserForm = document.querySelector(".edit-user-form");

let allData = [];

function allDataShow() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      //let users = "";

      let userArray = [...data];
      //console.log(userArray);
      db.users.toArray((r) => {
        const idbData = [...r];

        let isFirstIteration = true;
        let newIDBdata = [];

        for (i = 0; i < userArray.length; i++) {
          let item;
          for (j = 0; j < idbData.length; j++) {
            idbData[j].id =
              Math.floor(Math.random() * 999) + Math.floor(Math.random() * 999);
            if (userArray[i].id == idbData[j].jid) {
              item = idbData[j];
            } else if (isFirstIteration && !idbData[j].jid) {
              newIDBdata.push(idbData[j]);
            }
          }
          isFirstIteration = false;
          if (item) {
            allData.push(item);
          } else {
            allData.push(userArray[i]);
          }
        }
        allData = [...allData, ...newIDBdata];
        //console.log(allData);
        let users = "";
        if (allData.length > 0) {
          allData.forEach((u) => {
            users += "<tr id='row_" + u.id + "' data-id=${u.id}>";
            users += "<td id='name' class='name'>" + u.name + "</td>";
            users += "<td id='email' >" + u.email + "</td>";
            users += "<td id='address'>" + u.address.street + "</td>";
            users += "<td id='phone'>" + u.phone + "</td>";
            users +=
              "<td><button id='editbtn" +
              u.id +
              "' onclick=edit(" +
              u.id +
              ")>Edit</button></td>";
            users +=
              "<td><button id='deletebtn" +
              u.id +
              "' onclick=deleteUser(" +
              u.id +
              ")>Delete</button></td></tr>";
          });
          document.getElementById("tbody").innerHTML = users;
        }
      });
    });
}

allDataShow();
//indexed db start

const usersdb = (dbname, table) => {
  const db = new Dexie(dbname);
  db.version(1).stores(table);
  db.open();
  return db;
};

let db = usersdb("Users", {
  users: `++iid, name, email, address, phone, jid`,
});

const dbIdInput = document.getElementById("id-value");
const dbNameInput = document.getElementById("name-value");
const dbEmailInput = document.getElementById("email-value");
const dbAddressInput = document.getElementById("address-value");
const dbPhoneInput = document.getElementById("phone-value");

//const btnAddIndexDb = document.getElementById("addBtn");
const addUserIndex = document.querySelector(".add-user-form");
const bulkcreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
  } else {
  }
  return flag;
};

//check textbox validation
const empty = (object) => {
  let flag = false;
  for (const value in object) {
    if (object[value] != "" && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};

let newUser = addUserIndex.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    name: nameValue.value,
    email: emailValue.value,
    address: {
      city: "",
      geo: { lat: "", lng: "" },
      street: addressValue.value,
      suite: "",
      zipcode: "",
    },
    phone: phoneValue.value,
  };
  db.users.add(user).then((res) => {
    nameValue.value =
      emailValue.value =
      addressValue.value =
      phoneValue.value =
        "";
    // getData(db.users, (data) => {
    //   dbIdInput.value = data.iid + 1 || 1;
    // });
    document.querySelector(".popup").classList.remove("active");
    user.iid = res;
    bindNewItem(user);
    //console.log(res);
  });
});

//const IndexData = () => {
// db.users.count((count) => {
//   if (count) {
//     db.users.each((table) => {
//       obj = Sortobj(table);
//       indexArray = obj;
//       console.log(indexArray);
//     });
//   }
// });
//};
let show = () => {
  console.log(indexArray);
};
const getData = (dbtable, fn) => {
  let index = 0;
  let obj = {};
  dbtable.count((count) => {
    if (count) {
      dbtable.each((table) => {
        obj = Sortobj(table);
        fn(obj, index++);
      });
    } else {
      fn(0);
    }
  });
};

const Sortobj = (sortobj) => {
  let obj = {};
  obj = {
    iid: sortobj.iid,
    name: sortobj.name,
    email: sortobj.email,
    address: {
      city: "",
      geo: { lat: "", lng: "" },
      street: sortobj.address,
      suite: "",
      zipcode: "",
    },
    phone: sortobj.phone,
  };
  return obj;
};
// document
//   .querySelector(".popup .form .add-user-form button")
//   .addEventListener("click", function () {
//     document.querySelector(".popup").classList.remove("active");
//     location.reload();
//   });

//data adding in indexdb end

//showing data in index db

//Indexed db end

function deleteUser(id) {
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].id == id) {
      selectedUser = allData[i];
    }
  }
  if (selectedUser.id <= 10) {
    document.getElementById("popup3").classList.add("active");
    deleteYes.addEventListener("click", (e) => {
      e.preventDefault();
      fetch(`${url}/${id}`, {
        method: "DELETE",
      }).then((res) => res.json());
      document.getElementById("row_" + id).remove();
    });
  } else {
    document.getElementById("popup3").classList.add("active");
    deleteYes.addEventListener("click", (e) => {
      e.preventDefault();
      let flag = selectedUser.iid;
      db.users.delete(flag);
      location.reload();
    });
  }
}
//delete popup close
document
  .querySelector(".popup3 .yesbtn")
  .addEventListener("click", function () {
    document.querySelector(".popup3").classList.remove("active");
  });
document.querySelector(".popup3 .nobtn").addEventListener("click", function () {
  document.querySelector(".popup3").classList.remove("active");
});

//edit button
const dbEditIdInput = document.getElementById("edit-id-value");
let selectedUser = {};
let editUser;
const editUserIndex = document.querySelector(".edit-user-form");
function edit(id) {
  for (let i = 0; i < allData.length; i++) {
    if (allData[i].id == id) {
      selectedUser = allData[i];
    }
  }
  editUser = id;
  //console.log(editUser);
  if (selectedUser.id <= 10) {
    document.querySelector("#edit-id-value").value = selectedUser.id;
  } else {
    document.querySelector("#edit-id-value").value = selectedUser.iid;
  }

  document.querySelector("#name-edit-value").value = selectedUser.name;
  document.querySelector("#email-edit-value").value = selectedUser.email;
  document.querySelector("#address-edit-value").value =
    selectedUser.address.street;
  document.querySelector("#phone-edit-value").value = selectedUser.phone;

  document.getElementById("popup2").classList.add("active");
  //console.log(selectedUser);
}
const dbUpdateIdInput = document.getElementById("edit-id-value");
let updateUser = editUserIndex.addEventListener("submit", (e) => {
  e.preventDefault();
  let idInput = selectedUser.id;
  let userIdInput = selectedUser.iid;
  //console.log(idInput);
  let people = {
    name: nameEditValue.value,
    email: emailEditValue.value,
    address: {
      city: "",
      geo: { lat: "", lng: "" },
      street: addressEditValue.value,
      suite: "",
      zipcode: "",
    },
    phone: phoneEditValue.value,
  };

  let dbOperation = [];
  if (idInput <= 10) {
    people.jid = dbEditIdInput.value;
    dbOperation = db.users.add(people);
  } else {
    dbOperation = db.users.update(userIdInput, people);
  }

  nameEditValue.value =
    emailEditValue.value =
    addressEditValue.value =
    phoneEditValue.value =
      "";
  //console.log(people);

  //let NewselectedUser = people;

  dbOperation.then((res) => {
    
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].id == editUser) {
        allData[i] = people;
        //allData.push(people);
        console.log(allData);
        let users = "";
        if (allData.length > 0) {
          allData.forEach((u) => {
            users += "<tr id='row_" + u.id + "' data-id=${u.id}>";
            users += "<td id='name' class='name'>" + u.name + "</td>";
            users += "<td id='email' >" + u.email + "</td>";
            users += "<td id='address'>" + u.address.street + "</td>";
            users += "<td id='phone'>" + u.phone + "</td>";
            users +=
              "<td><button id='editbtn" +
              u.id +
              "' onclick=edit(" +
              u.id +
              ")>Edit</button></td>";
            users +=
              "<td><button id='deletebtn" +
              u.id +
              "' onclick=deleteUser(" +
              u.id +
              ")>Delete</button></td></tr>";
          });
          document.getElementById("tbody").innerHTML = users;
        }
      }
    }
    document.querySelector(".popup2").classList.remove("active");
  });
});
//btnEdit.onclick =  allDataShow();

function check() {
  if (emailValue.value.match(regExp)) {
    emailValue.style.borderColor = "#27ae60";
    btn.style.display = "block";
  } else {
    emailValue.style.borderColor = "#e74c3c";
    btn.style.display = "none";
  }
}
function bindNewItem(data) {
  const tr = document.createElement("tr");
  tr.setAttribute("id", "row_" + data.id);

  let row_content = "";
  row_content += "<td id='name' class='name'>" + data.name + "</td>";
  row_content += "<td id='email'>" + data.email + "</td>";
  row_content += "<td id='address'>" + data.address.street + "</td>";
  row_content += "<td id='phone'>" + data.phone + "</td>";
  row_content +=
    "<td><button id='editbtn" +
    data.id +
    "' onclick=edit(" +
    data.id +
    ")>Edit</button></td>";
  row_content +=
    "<td><button id='deletebtn" +
    data.id +
    "' onclick=deleteUser(" +
    data.id +
    ")>Delete</button></td>";
  tr.innerHTML = row_content;
  //console.log(row_content);

  const tbody = document.getElementById("tbody");
  tbody.insertBefore(tr, tbody.children[0]);
}

function bindEditItem(data) {
  let edit_content = "";
  edit_content += "<td id='name' class='name'>" + data.name + "</td>";
  edit_content += "<td id='email'>" + data.email + "</td>";
  edit_content += "<td id='address'>" + data.address.street + "</td>";
  edit_content += "<td id='phone'>" + data.phone + "</td>";
  edit_content +=
    "<td><button id='editbtn" +
    data.id +
    "' onclick=edit(" +
    data.id +
    ")>Edit</button></td>";
  edit_content +=
    "<td><button id='deletebtn" +
    data.id +
    "' onclick=deleteUser(" +
    data.id +
    ")>Delete</button></td>";

  document.getElementById("row_" + data.id).innerHTML = edit_content;
}
