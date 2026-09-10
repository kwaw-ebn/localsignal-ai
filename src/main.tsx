import React from 'react'
import ReactDOM from 'react-dom/client'
import { BarChart3, Bell, Building2, ChevronRight, CircleHelp, Globe2, LayoutDashboard, Lightbulb, MapPin, Search, Settings, Star, TrendingUp, Users } from 'lucide-react'
import './styles.css'

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

function App(){
 return <div className="app">
  <aside className="sidebar">
   <div className="brand"><span className="brandmark"><BarChart3 size={21}/></span><span>LocalSignal<span>AI</span></span></div>
   <div className="workspace"><small>WORKSPACE</small><button><span className="avatar">VA</span><span><b>Ville Ann Services</b><small>Fredericksburg, VA</small></span><ChevronRight size={16}/></button></div>
   <nav>
    <a className="active"><LayoutDashboard/>Overview</a><a><Users/>Competitors</a><a><MapPin/>Local visibility</a><a><Star/>Reviews</a><a><Globe2/>Website audit</a><a><Lightbulb/>Action center<span className="badge">8</span></a>
   </nav>
   <div className="nav-bottom"><a><Settings/>Settings</a><a><CircleHelp/>Help & support</a><div className="user"><span className="avatar">EK</span><span><b>Ebenezer Kwaw</b><small>Owner</small></span></div></div>
  </aside>
  <main>
   <header><div><h1>Good morning, Ebenezer</h1><p>Here is what is happening in your local market.</p></div><div className="header-actions"><button className="icon"><Bell size={19}/><i/></button><button className="primary"><Search size={17}/>Run new analysis</button></div></header>
   <section className="stats">{stats.map(({label,value,suffix,delta,icon:Icon,tone})=><article className="stat" key={label}><div className={'stat-icon '+tone}><Icon/></div><div className="stat-label">{label}</div><div className="stat-value">{value}<span>{suffix}</span></div><div className="delta"><TrendingUp size={14}/>{delta}</div></article>)}</section>
   <section className="grid">
    <article className="panel priority"><div className="panel-head"><div><span className="eyebrow">TOP PRIORITY</span><h2>Your competitors are gaining reviews faster</h2></div><span className="spark"><TrendingUp/></span></div><p>Your three closest competitors gained an average of <b>11 reviews</b> this month. You gained <b>3</b>.</p><div className="recommend"><b>Recommended action</b><span>Send a review request to recent satisfied customers this week.</span></div><button>View action plan <ChevronRight size={16}/></button></article>
    <article className="panel score"><div className="panel-head"><div><span className="eyebrow muted">MARKET SCORE</span><h2>Overall performance</h2></div><button className="dots">•••</button></div><div className="score-body"><div className="ring"><strong>76</strong><span>GOOD</span></div><div><div className="meter"><span>Visibility</span><b>72</b><i><em style={{width:'72%'}}/></i></div><div className="meter"><span>Reputation</span><b>83</b><i><em style={{width:'83%'}}/></i></div><div className="meter"><span>Website</span><b>74</b><i><em style={{width:'74%'}}/></i></div></div></div></article>
   </section>
   <section className="lower">
    <article className="panel table-panel"><div className="panel-head"><div><span className="eyebrow muted">COMPETITOR SNAPSHOT</span><h2>How you compare</h2></div><button className="text-btn">View all <ChevronRight size={15}/></button></div><table><thead><tr><th>Business</th><th>Rating</th><th>Reviews</th><th>Visibility</th></tr></thead><tbody>{competitors.map(c=><tr className={c.yours?'yours':''} key={c.name}><td><span className="company"><Building2 size={15}/></span><b>{c.name}</b>{c.yours&&<small>YOU</small>}</td><td><Star size={14} fill="currentColor"/> {c.rating}</td><td>{c.reviews}</td><td><div className="mini"><i style={{width:c.visibility+'%'}}/></div><b>{c.visibility}</b></td></tr>)}</tbody></table></article>
    <article className="panel actions"><div className="panel-head"><div><span className="eyebrow muted">ACTION CENTER</span><h2>What to do next</h2></div><button className="text-btn">View all <ChevronRight size={15}/></button></div>{actions.map(a=><div className="action" key={a.title}><span className={'dot '+a.color}/><div><small>{a.level}</small><h3>{a.title}</h3><p>{a.detail}</p><button>{a.cta}<ChevronRight size={14}/></button></div></div>)}</article>
   </section>
  </main>
 </div>
}
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
