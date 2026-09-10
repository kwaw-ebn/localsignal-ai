import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ChevronRight, Circle, Filter, Lightbulb, PlayCircle, RefreshCw, Sparkles } from 'lucide-react'
import { ActionStatus, generateActions, SignalAction } from './signalEngine'
import './action-center.css'

const savedStatuses=()=>{try{return JSON.parse(localStorage.getItem('localsignal-action-statuses')||'{}')}catch{return {}}}
export default function ActionCenterPage(){
 const [actions,setActions]=useState<SignalAction[]>(()=>generateActions(savedStatuses())),[filter,setFilter]=useState('All')
 const visible=useMemo(()=>actions.filter(x=>filter==='All'||x.priority===filter||x.status===filter),[actions,filter])
 const update=(id:string,status:ActionStatus)=>{const next=actions.map(x=>x.id===id?{...x,status}:x);setActions(next);localStorage.setItem('localsignal-action-statuses',JSON.stringify(Object.fromEntries(next.map(x=>[x.id,x.status]))))}
 const regenerate=()=>setActions(generateActions(savedStatuses()))
 const counts={high:actions.filter(x=>x.priority==='High'&&x.status!=='Completed').length,open:actions.filter(x=>x.status!=='Completed').length,done:actions.filter(x=>x.status==='Completed').length}
 return <>
  <header><div><h1>AI Action Center</h1><p>Turn verified market signals into focused, trackable marketing actions.</p></div><button className="primary page-button" onClick={regenerate}><RefreshCw/>Refresh signals</button></header>
  <div className="engine-note"><Sparkles/><p><b>Evidence first recommendations</b><span>This MVP uses deterministic rules across your saved data. Generative AI interpretation will be added through the backend later.</span></p></div>
  <section className="action-stats"><article><span className="red"><AlertTriangle/></span><div><small>High priority</small><b>{counts.high}</b></div></article><article><span className="purple"><Lightbulb/></span><div><small>Open actions</small><b>{counts.open}</b></div></article><article><span className="green"><CheckCircle2/></span><div><small>Completed</small><b>{counts.done}</b></div></article></section>
  <article className="panel action-board"><div className="action-toolbar"><div><h2>Your recommended actions</h2><p>Priorities are generated from structured evidence, not open ended guesses.</p></div><label><Filter/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>High</option><option>Medium</option><option>Opportunity</option><option>To do</option><option>In progress</option><option>Completed</option></select></label></div><div className="action-cards">{visible.map(action=><ActionCard key={action.id} action={action} update={update}/>)}</div></article>
 </>
}
function ActionCard({action,update}:{action:SignalAction;update:(id:string,s:ActionStatus)=>void}){
 return <div className={'signal-card '+action.priority.toLowerCase()}><div className="signal-marker">{action.priority==='High'?<AlertTriangle/>:action.priority==='Medium'?<PlayCircle/>:<Lightbulb/>}</div><div className="signal-main"><div className="signal-meta"><span>{action.priority} priority</span><code>{action.type}</code></div><h2>{action.title}</h2><p className="evidence"><b>Evidence</b>{action.evidence}</p><div className="recommended"><b>Recommended action</b><span>{action.recommendation}</span></div><small>Expected impact: {action.impact}</small></div><div className="signal-status"><label>Status<select value={action.status} onChange={e=>update(action.id,e.target.value as ActionStatus)}><option>To do</option><option>In progress</option><option>Completed</option></select></label><span className={action.status.toLowerCase().replace(' ','-')}>{action.status==='Completed'?<CheckCircle2/>:action.status==='In progress'?<PlayCircle/>:<Circle/>}{action.status}</span><button>View details<ChevronRight/></button></div></div>
}
