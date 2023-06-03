import { c as create_ssr_component, d as createEventDispatcher, v as validate_component } from "../../chunks/index.js";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
const LedgerProfile_svelte_svelte_type_style_lang = "";
const GoogleMap_svelte_svelte_type_style_lang = "";
const LogIn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const firebaseConfig = {
    apiKey: "AIzaSyBEQ0yl78oVx87pxPJd8Jrt-LOp7wPmTLA",
    authDomain: "cattymap-1b9a3.firebaseapp.com",
    projectId: "cattymap-1b9a3",
    storageBucket: "cattymap-1b9a3.appspot.com",
    messagingSenderId: "368074086145",
    appId: "1:368074086145:web:393f103f6ca32a06bbad00",
    measurementId: "G-442J384EW1",
    databaseURL: "https://cattymap-1b9a3-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
  const app = initializeApp(firebaseConfig);
  getDatabase(app);
  getAuth();
  createEventDispatcher();
  return `<div class="card w-96 bg-base-100 shadow-xl"><figure><img src="https://media.npr.org/assets/img/2021/08/11/gettyimages-1279899488_wide-f3860ceb0ef19643c335cb34df3fa1de166e2761-s1100-c50.jpg" alt="Image"></figure>
  <div class="card-body"><h2 class="card-title">Authentication
    </h2>
    <div><input type="text" id="email" placeholder="Your email" class="input input-bordered input-secondary w-full max-w-xs">
      <input type="text" id="username" placeholder="Your username" class="input input-bordered input-secondary w-full max-w-xs">
      <input type="password" id="password" placeholder="Your password" class="input input-bordered input-secondary w-full max-w-xs">
    
        <button class="btn btn-secondary">Sign up </button>
        <button class="btn btn-secondary">Log in </button></div></div></div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".app__container.svelte-1he3m0r{height:93%;width:100%}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `

${`<div class="app__container svelte-1he3m0r">${validate_component(LogIn, "LogIn").$$render($$result, {}, {}, {})}</div>`}`;
});
export {
  Page as default
};
