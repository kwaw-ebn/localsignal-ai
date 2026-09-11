import { useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck, ExternalLink, RotateCcw, Save, Share2, Store, TrendingUp } from 'lucide-react'
import './marketing-audit.css'

type AuditKind='gbp'|'social'
type AuditItem={id:string;label:string;help:string;recommendation:string}
type SavedAudit={score:number;completed:string[];url:string;platform?:string;date:string}

const gbpItems:AuditItem[]=[
 {id:'verified',label:'Profile is verified',help:'The business controls and can update the listing.',recommendation:'Complete Google Business Profile verification.'},
 {id:'nap',label:'Name, address and phone are accurate',help:'Details match the website and other listings.',recommendation:'Correct the business name, address and phone everywhere.'},
 {id:'category',label:'Primary category is specific',help:'The primary category closely matches the main service.',recommendation:'Select the most specific primary business category.'},
 {id:'services',label:'Services or products are complete',help:'Important offers have descriptions and prices where relevant.',recommendation:'Add every core service or product with clear descriptions.'},
 {id:'description',label:'Business description is optimized',help:'It explains services, location and value clearly.',recommendation:'Rewrite the description around services and service areas.'},
 {id:'photos',label:'Recent, high-quality photos are published',help:'The profile has current team, work and location photos.',recommendation:'Upload at least three recent, authentic business photos.'},
 {id:'posts',label:'A post was published in the last 14 days',help:'Offers, updates or useful content appear regularly.',recommendation:'Publish a useful Google Business Profile update this week.'},
 {id:'reviews',label:'New reviews arrive consistently',help:'Recent customers are actively leaving feedback.',recommendation:'Create a compliant process for requesting customer reviews.'},
 {id:'responses',label:'Reviews receive helpful responses',help:'Positive and negative reviews receive professional replies.',recommendation:'Respond to every recent review with a specific, helpful reply.'},
 {id:'links',label:'Website and appointment links work',help:'Important profile links open the correct pages.',recommendation:'Test and correct all website, booking and action links.'}
]

const socialItems:AuditItem[]=[
 {id:'branding',label:'Branding is consistent',help:'Logo, colors and business name match across channels.',recommendation:'Standardize the logo, colors and business name.'},
 {id:'bio',label:'Bio explains the offer clearly',help:'Visitors can quickly understand the service and audience.',recommendation:'Rewrite the bio with the offer, audience and service area.'},
 {id:'contact',label:'Contact and website links work',help:'Phone, email, website and booking actions are current.',recommendation:'Correct and test all contact and website links.'},
 {id:'cadence',label:'Content is posted consistently',help:'The account follows a realistic weekly schedule.',recommendation:'Create a sustainable weekly publishing schedule.'},
 {id:'mix',label:'Content has a balanced mix',help:'Posts educate, build trust and promote offers.',recommendation:'Balance educational, proof, community and promotional content.'},
 {id:'creative',label:'Images and videos are high quality',help:'Creative is clear, branded and suitable for the platform.',recommendation:'Use clear, platform-sized visuals with consistent branding.'},
 {id:'captions',label:'Captions include clear next steps',help:'Posts tell readers what to do after engaging.',recommendation:'Add one relevant call to action to each post.'},
 {id:'engagement',label:'Comments and messages receive replies',help:'The business responds promptly and professionally.',recommendation:'Set a daily routine for replying to comments and messages.'},
 {id:'proof',label:'Customer proof is visible',help:'Reviews, outcomes or case studies support credibility.',recommendation:'Publish recent customer proof with permission.'},
 {id:'measurement',label:'Performance is reviewed monthly',help:'Reach, engagement, clicks and leads inform decisions.',recommendation:'Record monthly reach, engagement, clicks and enquiries.'}
]

const config={
 gbp:{title:'Google Business Profile audit',description:'Assess profile completeness, local trust and conversion readiness.',urlLabel:'Google Business Profile URL',urlPlaceholder:'https://google.com/maps/...',icon:Store,items:gbpItems,storage:'localsignal-gbp-audit'},
 social:{title:'Social media audit',description:'Review profile quality, content consistency, engagement and measurement.',urlLabel:'Social profile URL',urlPlaceholder:'https://instagram.com/yourbusiness',icon:Share2,items:socialItems,storage:'localsignal-social-audit'}
}

export default function MarketingAuditPage({kind}:{kind:AuditKind}){
 const c=config[kind], Icon=c.icon
 const initial=()=>{try{return JSON.parse(localStorage.getItem(c.storage)||'null') as SavedAudit|null}catch{return null}}
 const [saved,setSaved]=useState<SavedAudit|null>(initial),[url,setUrl]=useState(saved?.url||''),[platform,setPlatform]=useState(saved?.platform||'Instagram'),[completed,setCompleted]=useState<string[]>(saved?.completed||[]),[notice,setNotice]=useState('')
 const score=Math.round(completed.length/c.items.length*100)
 const recommendations=useMemo(()=>c.items.filter(x=>!completed.includes(x.id)).map(x=>x.recommendation),[c.items,completed])
 const rating=score>=85?'Excellent':score>=70?'Good':score>=50?'Needs attention':'High priority'
 const toggle=(id:string)=>setCompleted(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id])
 const save=()=>{const audit={score,completed,url,platform:kind==='social'?platform:undefined,date:new Date().toISOString()};localStorage.setItem(c.storage,JSON.stringify(audit));setSaved(audit);setNotice('Audit saved');setTimeout(()=>setNotice(''),2200)}
 const reset=()=>{setCompleted([]);setSaved(null);setNotice('');localStorage.removeItem(c.storage)}
 return <>
  <header><div><h1>{c.title}</h1><p>{c.description}</p></div><div className="audit-header-actions"><button onClick={reset}><RotateCcw size={15}/>Reset</button><button className="primary page-button" onClick={save}><Save size={16}/>Save audit</button></div></header>
  <section className="audit-summary-grid">
   <article className="panel audit-score-card"><div className="audit-score-ring" style={{background:`conic-gradient(#6656e8 0 ${score}%,#eceaf9 ${score}% 100%)`}}><span><b>{score}</b><small>/100</small></span></div><div><small>CURRENT SCORE</small><h2>{rating}</h2><p>{completed.length} of {c.items.length} checks completed</p></div></article>
   <article className="panel audit-progress-card"><span><TrendingUp/></span><div><small>OPPORTUNITIES</small><h2>{recommendations.length} improvements found</h2><p>Complete the checklist using information you can verify.</p></div></article>
   <article className="panel audit-saved-card"><span><ClipboardCheck/></span><div><small>LAST SAVED</small><h2>{saved?new Date(saved.date).toLocaleDateString():'Not saved yet'}</h2><p>{notice||'Results remain available on this device.'}</p></div></article>
  </section>
  <section className="audit-layout">
   <div>
    <article className="panel audit-source"><div className="audit-section-title"><Icon/><div><h2>Profile details</h2><p>Identify the profile being assessed.</p></div></div><div className="audit-fields">{kind==='social'&&<label>Platform<select value={platform} onChange={e=>setPlatform(e.target.value)}><option>Instagram</option><option>Facebook</option><option>LinkedIn</option><option>TikTok</option><option>Pinterest</option><option>YouTube</option></select></label>}<label className={kind==='social'?'wide':''}>{c.urlLabel}<div className="url-input"><input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder={c.urlPlaceholder}/>{url&&<a href={url} target="_blank" rel="noreferrer" aria-label="Open profile"><ExternalLink/></a>}</div></label></div></article>
    <article className="panel audit-checklist"><div className="audit-section-title"><CheckCircle2/><div><h2>Audit checklist</h2><p>Select only checks you have verified.</p></div></div>{c.items.map(item=><label className={completed.includes(item.id)?'audit-check checked':'audit-check'} key={item.id}><input type="checkbox" checked={completed.includes(item.id)} onChange={()=>toggle(item.id)}/><span><b>{item.label}</b><small>{item.help}</small></span><em>{completed.includes(item.id)?'Pass':'Review'}</em></label>)}</article>
   </div>
   <aside><article className="panel audit-recommendations"><small>PRIORITY ACTIONS</small><h2>Recommendations</h2>{recommendations.length?recommendations.slice(0,6).map((item,index)=><div key={item}><span>{index+1}</span><p>{item}</p></div>):<div className="audit-complete"><CheckCircle2/><p>All checks passed. Save the audit and review it again next month.</p></div>}<button className="primary" onClick={save}><Save size={15}/>Save {score}/100 audit</button></article></aside>
  </section>
 </>
}
