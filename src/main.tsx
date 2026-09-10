import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BarChart3, Bell, Building2, ChevronRight, CircleHelp, Globe2, LayoutDashboard, Lightbulb, MapPin, Search, Settings, Star, TrendingUp, Users } from 'lucide-react'
import './styles.css'
import './onboarding.css'

const stats = [
  {label:'Local visibility', value:'72', suffix:'/100', delta:'+4 this month', icon:MapPin, tone:'purple'},
  {label:'Reputation score', value:'83', suffix:'/100', delta:'+2 this month', icon:Star, tone:'orange'},
  {label:'Competitive position', value:'3rd', suffix:'of 6', delta:'Up 1 position', icon:TrendingUp, tone:'green'},
  {label:'Opportunities', value:'8', suffix:'open', delta:'3 high priority', icon:Lightbulb, tone:'blue'}
]
const competitors = [
  {name:'Your Business', rating:'4.7', reviews:86, visibility:72, yours:true},
  {name:'Bright Local Co.', rating:'4.8', reviews:175, visibility:88},
  {name:'ServicePro Group', rating:'4.5', reviews:120, visibility:79},
  {name:'Neighbourly Works', rating:'4.6', reviews:67, visibility:64}
]
const actions = [
  {level:'High priority', title:'Increase your Google reviews', detail:'Top competitors gained 11 reviews on average while you gained 3.', cta:'Create review plan', color:'red'},
  {level:'Medium priority', title:'Create a dedicated service page', detail:'Three competitors have a page for your highest opportunity keyword.', cta:'View content gap', color:'amber'},
  {level:'Opportunity', title:'Publish a Google Business update', detail:'No recent activity was detected for your business profile.', cta:'Draft a post', color:'blue'}
]

const navigation = [
 ['overview','Overview',LayoutDashboard],['competitors','Competitors',Users],['visibility','Local visibility',MapPin],
 ['reviews','Reviews',Star],['website','Website audit',Globe2],['actions','Action center',Lightbulb]
] as const
type Business = {name:string;website:string;industry:string;city:string;country:string}
const starter:Business={name:'Ville Ann Services',website:'https://example.com',industry:'Cleaning services',city:'Fredericksburg, VA',country:'United States'}

function Onboarding({initial,onSave,onClose}:{initial:Business;onSave:(b:Business)=>void;onClose:()=>void}){
 const [step,setStep]=useState(1),[data,setData]=useState(initial)
 const field=(key:keyof Business,label:string,placeholder:string)=><label>{label}<input value={data[key]} placeholder={placeholder} onChange={e=>setData({...data,[key]:e.target.value})}/></label>
 return <div className="modal-backdrop"><div className="modal"><div className="modal-top"><b>Set up your LocalSignal workspace</b><button onClick={onClose}>×</button></div><div className="steps">{[1,2,3].map(n=><span className={step>=n?'active':''} key={n}>{n}</span>)}</div>
  <div className="form-step">{step===1&&<><small>STEP 1 OF 3</small><h2>Tell us about your business</h2><p>We use these details to build your market workspace.</p>{field('name','Business name','Bright Cleaning Co.')}{field('website','Website','https://yourbusiness.com')}</>}{step===2&&<><small>STEP 2 OF 3</small><h2>Define your local market</h2><p>This helps us organize competitors and local visibility.</p><label>Industry<select value={data.industry} onChange={e=>setData({...data,industry:e.target.value})}><option>Cleaning services</option><option>Home services</option><option>Health services</option><option>Professional services</option><option>Beauty services</option><option>Retail</option><option>Other local business</option></select></label>{field('city','Primary city or service area','Fredericksburg, VA')}{field('country','Country','United States')}</>}{step===3&&<div className="finish"><span><TrendingUp/></span><h2>Your workspace is ready</h2><p>We created a starter dashboard for <b>{data.name}</b>. Next, add competitors and connect real data sources.</p><div className="summary"><b>{data.name}</b><b>{data.city}</b><b>{data.industry}</b></div></div>}</div>
  <div className="modal-actions">{step>1&&<button onClick={()=>setStep(step-1)}>Back</button>}<button className="primary" disabled={step===1&&!data.name.trim()} onClick={()=>step<3?setStep(step+1):onSave(data)}>{step===3?'Open dashboard':'Continue'}<ChevronRight size={15}/></button></div>
 </div></div>
}

function ModulePage({id,business}:{id:string;business:Business}){
 const data:Record<string,[string,string,string]>= {competitors:['Competitor intelligence','Monitor and compare nearby businesses.','Add competitor'],visibility:['Local visibility','Track your most valuable local search terms.','Add keywords'],reviews:['Reviews and reputation','Understand review growth and customer themes.','Connect reviews'],website:['Website audit',`Find technical and content gaps on ${business.website}.`,'Run website audit'],actions:['AI Action Center','Turn verified signals into clear next steps.','Run analysis']}
 const [title,description,button]=data[id]
 return <><header><div><h1>{title}</h1><p>{description}</p></div><button className="primary page-button">{button}</button></header><article className="panel empty-state"><span><Search/></span><h2>No data here yet</h2><p>Complete the first setup action and LocalSignal will organize your results and recommendations here.</p><button className="primary">{button}</button></article></>
}

function App(){
 const [page,setPage]=useState('overview'),[showOnboarding,setShowOnboarding]=useState(false)
 const [business,setBusiness]=useState<Business>(()=>{try{return JSON.parse(localStorage.getItem('localsignal-business')||'null')||starter}catch{return starter}})
 useEffect(()=>{if(!localStorage.getItem('localsignal-onboarded'))setShowOnboarding(true)},[])
 const save=(b:Business)=>{setBusiness(b);localStorage.setItem('localsignal-business',JSON.stringify(b));localStorage.setItem('localsignal-onboarded','true');setShowOnboarding(false)}
 return <div className="app">
  {showOnboarding&&<Onboarding initial={business} onSave={save} onClose={()=>setShowOnboarding(false)}/>} 
  <aside className="sidebar">
   <div className="brand"><span className="brandmark"><BarChart3 size={21}/></span><span>LocalSignal<span>AI</span></span></div>
   <div className="workspace"><small>WORKSPACE</small><button onClick={()=>setShowOnboarding(true)}><span className="avatar">{business.name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}</span><span><b>{business.name}</b><small>{business.city}</small></span><ChevronRight size={16}/></button></div>
   <nav>
    {navigation.map(([id,label,Icon])=><button key={id} className={page===id?'active':''} onClick={()=>setPage(id)}><Icon/>{label}{id==='actions'&&<span className="badge">8</span>}</button>)}
   </nav>
   <div className="nav-bottom"><a><Settings/>Settings</a><a><CircleHelp/>Help & support</a><div className="user"><span className="avatar">EK</span><span><b>Ebenezer Kwaw</b><small>Owner</small></span></div></div>
  </aside>
  <main>{page==='overview'?<>
   <header><div><h1>Good morning, Ebenezer</h1><p>Here is what is happening in your local market.</p></div><div className="header-actions"><button className="icon"><Bell size={19}/><i/></button><button className="primary"><Search size={17}/>Run new analysis</button></div></header>
   <section className="stats">{stats.map(({label,value,suffix,delta,icon:Icon,tone})=><article className="stat" key={label}><div className={'stat-icon '+tone}><Icon/></div><div className="stat-label">{label}</div><div className="stat-value">{value}<span>{suffix}</span></div><div className="delta"><TrendingUp size={14}/>{delta}</div></article>)}</section>
   <section className="grid">
    <article className="panel priority"><div className="panel-head"><div><span className="eyebrow">TOP PRIORITY</span><h2>Your competitors are gaining reviews faster</h2></div><span className="spark"><TrendingUp/></span></div><p>Your three closest competitors gained an average of <b>11 reviews</b> this month. You gained <b>3</b>.</p><div className="recommend"><b>Recommended action</b><span>Send a review request to recent satisfied customers this week.</span></div><button>View action plan <ChevronRight size={16}/></button></article>
    <article className="panel score"><div className="panel-head"><div><span className="eyebrow muted">MARKET SCORE</span><h2>Overall performance</h2></div><button className="dots">•••</button></div><div className="score-body"><div className="ring"><strong>76</strong><span>GOOD</span></div><div><div className="meter"><span>Visibility</span><b>72</b><i><em style={{width:'72%'}}/></i></div><div className="meter"><span>Reputation</span><b>83</b><i><em style={{width:'83%'}}/></i></div><div className="meter"><span>Website</span><b>74</b><i><em style={{width:'74%'}}/></i></div></div></div></article>
   </section>
   <section className="lower">
    <article className="panel table-panel"><div className="panel-head"><div><span className="eyebrow muted">COMPETITOR SNAPSHOT</span><h2>How you compare</h2></div><button className="text-btn">View all <ChevronRight size={15}/></button></div><table><thead><tr><th>Business</th><th>Rating</th><th>Reviews</th><th>Visibility</th></tr></thead><tbody>{competitors.map(c=><tr className={c.yours?'yours':''} key={c.name}><td><span className="company"><Building2 size={15}/></span><b>{c.name}</b>{c.yours&&<small>YOU</small>}</td><td><Star size={14} fill="currentColor"/> {c.rating}</td><td>{c.reviews}</td><td><div className="mini"><i style={{width:c.visibility+'%'}}/></div><b>{c.visibility}</b></td></tr>)}</tbody></table></article>
    <article className="panel actions"><div className="panel-head"><div><span className="eyebrow muted">ACTION CENTER</span><h2>What to do next</h2></div><button className="text-btn">View all <ChevronRight size={15}/></button></div>{actions.map(a=><div className="action" key={a.title}><span className={'dot '+a.color}/><div><small>{a.level}</small><h3>{a.title}</h3><p>{a.detail}</p><button>{a.cta}<ChevronRight size={14}/></button></div></div>)}</article>
   </section></>:<ModulePage id={page} business={business}/>}</main>
 </div>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
