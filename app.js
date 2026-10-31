
const SUPABASE_URL = "https://djlzxakgpkymontfzpub.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fOryY6hzvPhsWxch3YLE7G";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const translations = {
 ku:{home:"سەرەتا",projects:"بەرهەمەکان",about:"دەربارە",login:"چوونەژوورەوە",logout:"چوونەدەرەوە",eyebrow:"دەنگێکی نوێ بۆ چیرۆکەکان",heroTitle:"چیرۆکەکان، بە دەنگی ئێمە.",heroCopy:"بەرهەمەکانی دوبلاژمان ببینە و لەگەڵ جیهانی دەنگ و هونەر ئاشنا ببە.",explore:"بینینی بەرهەمەکان",library:"کتێبخانە",latest:"دوایین بەرهەمەکان",search:"گەڕان بەدوای بەرهەم...",all:"هەمووی",empty:"هیچ بەرهەمێک نەدۆزرایەوە.",aboutEyebrow:"دەربارەی ستۆدیۆ",aboutTitle:"دەنگ، هەست و چیرۆک.",aboutCopy:"For test شوێنێکە بۆ پیشاندانی بەرهەمەکانی دوبلاژ و ناساندنی کاری تیمەکە.",footer:"دروستکراوە بە خۆشەویستی بۆ هونەری دەنگ",welcome:"بەخێربێیت",signup:"دروستکردنی ئەکاونت",email:"ئیمەیڵ",password:"وشەی نهێنی",watch:"بینینی بەرهەم",loginFirst:"سەرەتا بچۆ ژوورەوە."},
 ar:{home:"الرئيسية",projects:"الأعمال",about:"من نحن",login:"تسجيل الدخول",logout:"تسجيل الخروج",eyebrow:"صوت جديد للقصص",heroTitle:"قصص تُروى بأصواتنا.",heroCopy:"اكتشف أعمال الدبلجة وتعرّف على عالم الصوت والفن.",explore:"استكشف الأعمال",library:"المكتبة",latest:"أحدث الأعمال",search:"ابحث عن عمل...",all:"الكل",empty:"لم يتم العثور على أعمال.",aboutEyebrow:"عن الاستوديو",aboutTitle:"الصوت، الإحساس، والقصة.",aboutCopy:"For test مساحة لعرض أعمال الدبلجة والتعريف بإبداع الفريق.",footer:"صُنع بحب لفن الأداء الصوتي",welcome:"أهلاً بك",signup:"إنشاء حساب",email:"البريد الإلكتروني",password:"كلمة المرور",watch:"شاهد العمل",loginFirst:"يرجى تسجيل الدخول أولاً."},
 en:{home:"Home",projects:"Projects",about:"About",login:"Log in",logout:"Log out",eyebrow:"A new voice for every story",heroTitle:"Stories, in our voices.",heroCopy:"Explore our dubbing projects and discover the world of voice and art.",explore:"Explore projects",library:"LIBRARY",latest:"Latest projects",search:"Search projects...",all:"All",empty:"No projects found.",aboutEyebrow:"ABOUT THE STUDIO",aboutTitle:"Voice, feeling, and story.",aboutCopy:"For test is a place to showcase dubbing projects and introduce the team's work.",footer:"Made with love for the art of voice",welcome:"Welcome",signup:"Create account",email:"Email",password:"Password",watch:"Watch project",loginFirst:"Please log in first."}
};

let lang="ku", mode="login", projects=[], currentUser=null;

const $=id=>document.getElementById(id);

function t(key){return translations[lang][key]||key}

function safe(v){
 return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

function applyLanguage(){
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==="en"?"ltr":"rtl";
 document.querySelectorAll("[data-i18n]").forEach(el=>{
  const key=el.dataset.i18n;
  if(translations[lang][key])el.textContent=t(key);
 });
 document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
  el.placeholder=t(el.dataset.i18nPlaceholder);
 });
 $("authSubmit").textContent=t(mode==="login"?"login":"signup");
 $("loginTab").textContent=t("login");
 $("signupTab").textContent=t("signup");
 renderProjects();
}

function renderProjects(){
 const q=$("search").value.trim().toLowerCase();
 const cat=$("category").value;

 const list=projects.filter(p=>
  (cat==="all"||p.category===cat)&&
  (`${p.title} ${p.description||""} ${p.category||""}`).toLowerCase().includes(q)
 );

 $("projectCount").textContent=list.length;
 $("emptyState").classList.toggle("hidden",list.length!==0);

 $("projectGrid").innerHTML=list.map(p=>`
  <article class="project">
   ${p.video_url ? `
    <div style="width:100%;background:#000;overflow:hidden;border-radius:12px;">
     <video controls playsinline preload="metadata"
      ${p.thumbnail_url ? `poster="${safe(p.thumbnail_url)}"` : ""}
      style="display:block;width:100%;height:auto;max-height:440px;">
      <source src="${safe(p.video_url)}" type="video/mp4">
      Your browser does not support video playback.
     </video>
    </div>
   ` : `
    <div class="poster">
     ${p.thumbnail_url ? `<img src="${safe(p.thumbnail_url)}" alt="">` : `<span>FOR TEST</span>`}
    </div>
   `}
   <div class="project-info">
    <h3>${safe(p.title)}</h3>
    <p>${safe(p.description||"")}</p>
    <span class="tag">${safe(p.category||"Project")}</span>
   </div>
  </article>
 `).join("");
}

function toast(msg){
 $("toast").textContent=msg;
 $("toast").classList.add("show");
 setTimeout(()=>$("toast").classList.remove("show"),2600);
}

async function loadProjects(){
 const {data,error}=await db
  .from("projects")
  .select("id,title,category,description,video_url,thumbnail_url,language")
  .order("created_at",{ascending:false});

 if(error){
  console.error("Project loading error:",error);
  toast("هەڵە لە بارکردنی بەرهەمەکان.");
  return;
 }

 projects=data||[];
 renderProjects();
}

function setUser(user){
 currentUser=user;
 $("authOpen").classList.toggle("hidden",!!user);
 $("logoutBtn").classList.toggle("hidden",!user);
}

function openAuth(){
 $("authModal").classList.remove("hidden");
 $("authNotice").textContent="";
}

function closeAuth(){
 $("authModal").classList.add("hidden");
}

$("language").addEventListener("change",e=>{
 lang=e.target.value;
 applyLanguage();
});

$("search").addEventListener("input",renderProjects);
$("category").addEventListener("change",renderProjects);

$("authOpen").addEventListener("click",openAuth);
$("authClose").addEventListener("click",closeAuth);

$("authModal").addEventListener("click",e=>{
 if(e.target===$("authModal"))closeAuth();
});

$("loginTab").addEventListener("click",()=>{
 mode="login";
 $("loginTab").classList.add("active");
 $("signupTab").classList.remove("active");
 $("authSubmit").textContent=t("login");
 $("password").autocomplete="current-password";
});

$("signupTab").addEventListener("click",()=>{
 mode="signup";
 $("signupTab").classList.add("active");
 $("loginTab").classList.remove("active");
 $("authSubmit").textContent=t("signup");
 $("password").autocomplete="new-password";
});

$("authForm").addEventListener("submit",async e=>{
 e.preventDefault();

 const email=$("email").value;
 const password=$("password").value;

 const result=mode==="signup"
  ? await db.auth.signUp({email,password})
  : await db.auth.signInWithPassword({email,password});

 if(result.error){
  $("authNotice").textContent=result.error.message;
  return;
 }

 if(mode==="signup"&&!result.data.session){
  $("authNotice").textContent="Check your email to confirm your account, then log in.";
  return;
 }

 setUser(result.data.user);
 closeAuth();
 toast(mode==="signup"?"Account created.":"Welcome back!");
});

$("logoutBtn").addEventListener("click",async()=>{
 await db.auth.signOut();
 setUser(null);
 toast("Signed out.");
});

$("year").textContent=new Date().getFullYear();

applyLanguage();

db.auth.getSession().then(({data})=>{
 setUser(data.session?.user||null);
});

db.auth.onAuthStateChange((_event,session)=>{
 setUser(session?.user||null);
});

loadProjects();
