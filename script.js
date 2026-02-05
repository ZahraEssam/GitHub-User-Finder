const input = document.getElementById("usernameInput");
const searchBtn = document.getElementById("searchBtn");
const profileCard = document.getElementById("profileCard");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const themeToggle = document.getElementById("themeToggle");
const recentList = document.getElementById("recentList");

searchBtn.addEventListener("click", searchUser);
input.addEventListener("keypress", e=>{
if(e.key==="Enter") searchUser();
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    themeToggle.textContent = document.body.classList.contains("light") ? "🌙" : "☀️";
});

function searchUser(){
const username=input.value.trim();
if(!username) return;

loading.classList.remove("hidden");
profileCard.classList.add("hidden");
errorDiv.classList.add("hidden");

fetch(`https://api.github.com/users/${username}`)
.then(res=>{
if(!res.ok) throw new Error("User not found");
return res.json();
})
.then(data=>{
displayUser(data);
saveRecent(username);
})
.catch(err=>{
errorDiv.textContent=err.message;
errorDiv.classList.remove("hidden");
})
.finally(()=>{
loading.classList.add("hidden");
});
}

function displayUser(data){
document.getElementById("avatar").src=data.avatar_url;
document.getElementById("name").textContent=data.name||"";
document.getElementById("login").textContent="@"+data.login;
document.getElementById("bio").textContent=data.bio||"No bio available";
document.getElementById("repos").textContent=data.public_repos;
document.getElementById("followers").textContent=data.followers;
document.getElementById("following").textContent=data.following;
document.getElementById("profileLink").href=data.html_url;

profileCard.classList.remove("hidden");
}

function saveRecent(username){
let list=JSON.parse(localStorage.getItem("recent"))||[];
if(!list.includes(username)){
list.unshift(username);
list=list.slice(0,5);
localStorage.setItem("recent",JSON.stringify(list));
}
renderRecent();
}

function renderRecent(){
recentList.innerHTML="";
let list=JSON.parse(localStorage.getItem("recent"))||[];
list.forEach(user=>{
const btn=document.createElement("button");
btn.textContent=user;
btn.onclick=()=>{
input.value=user;
searchUser();
};
recentList.appendChild(btn);
});
}




renderRecent();
