import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, ExternalLink, FileSearch, Globe2, Play, ShieldCheck, XCircle } from 'lucide-react'
import './website-audit.css'

type Status='pass'|'warning'|'fail'
type Check={name:string;status:Status;detail:string;action:string}
type Audit={url:string;score:number;date:string;checks:Check[]}
const makeAudit=(url:string):Audit=>({url,score:74,date:new Date().toISOString(),checks:[
 {name:'HTTPS security',status:url.startsWith('https://')?'pass':'fail',detail:url.startsWith('https://')?'The website uses a secure connection.':'The submitted address does not use HTTPS.',action:'Install an SSL certificate and redirect HTTP traffic.'},
 {name:'Page title',status:'pass',detail:'A descriptive page title was detected in the starter audit.',action:'Keep the title concise and aligned with the primary service.'},
 {name:'Meta description',status:'warning',detail:'The description may need stronger local relevance.',action:'Add the primary service and service area naturally.'},
 {name:'Primary heading',status:'pass',detail:'One clear H1 is represented in the current audit.',action:'Keep one descriptive H1 on the page.'},
 {name:'Mobile readiness',status:'pass',detail:'The layout appears configured for mobile screens.',action:'Test important actions on several screen sizes.'},
 {name:'XML sitemap',status:'warning',detail:'Sitemap verification requires the backend crawler.',action:'Confirm /sitemap.xml exists and submit it in Search Console.'},
 {name:'Broken links',status:'fail',detail:'Two potential broken links are included in this MVP result.',action:'Repair or redirect links returning an error.'},
 {name:'Structured data',status:'warning',detail:'LocalBusiness schema was not confirmed.',action:'Add valid LocalBusiness schema with consistent business details.'}
]})

export default function WebsiteAuditPage({initialUrl}:{initialUrl:string}){
 const stored=()=>{try{return JSON.parse(localStorage.getItem('localsignal-audit')||'null') as Audit|null}catch{return null}}
 const [url,setUrl]=useState(initialUrl&&initialUrl!=='https://example.com'?initialUrl:'https://yourbusiness.com'),[audit,setAudit]=useState<Audit|null>(stored),[running,setRunning]=useState(false)
 const run=()=>{setRunning(true);window.setTimeout(()=>{const next=makeAudit(url);setAudit(next);localStorage.setItem('localsignal-audit',JSON.stringify(next));setRunning(false)},700)}
 const counts={pass:audit?.checks.filter(x=>x.status==='pass').length||0,warning:audit?.checks.filter(x=>x.status==='warning').length||0,fail:audit?.checks.filter(x=>x.status==='fail').length||0}
 return <>
  <header><div><h1>Website audit</h1><p>Identify technical SEO issues and content opportunities that affect local visibility.</p></div></header>
  <article className="panel audit-runner"><div><span><Globe2/></span><div><h2>Analyze your website</h2><p>This MVP uses local rules and sample checks. A live crawler will replace them in the backend milestone.</p></div></div><form onSubmit={e=>{e.preventDefault();run()}}><input required type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yourbusiness.com"/><button className="primary" disabled={running}>{running?<Clock3 className="spin"/>:<Play/>}{running?'Analyzing…':'Run audit'}</button></form></article>
  {audit?<><section className="audit-summary"><article className="audit-score"><div className="audit-ring" style={{background:`conic-gradient(#6656e8 0 ${audit.score}%,#eceaf9 ${audit.score}%)`}}><strong>{audit.score}</strong><span>GOOD</span></div><div><small>WEBSITE HEALTH</small><h2>{audit.url.replace(/^https?:\/\//,'')}</h2><p>Last scanned {new Date(audit.date).toLocaleString()}</p></div></article><article><span className="pass"><CheckCircle2/></span><div><small>Passed</small><b>{counts.pass}</b></div></article><article><span className="warning"><AlertTriangle/></span><div><small>Warnings</small><b>{counts.warning}</b></div></article><article><span className="fail"><XCircle/></span><div><small>Issues</small><b>{counts.fail}</b></div></article></section>
   <section className="audit-layout"><article className="panel checks-panel"><div className="audit-heading"><div><h2>Technical and on page checks</h2><p>Resolve failed checks first, then review warnings.</p></div><a href={audit.url} target="_blank" rel="noreferrer">Open website <ExternalLink/></a></div><div className="checks-list">{audit.checks.map(check=><div className="check" key={check.name}><span className={check.status}>{check.status==='pass'?<CheckCircle2/>:check.status==='warning'?<AlertTriangle/>:<XCircle/>}</span><div><h3>{check.name}</h3><p>{check.detail}</p><small>{check.action}</small></div><b className={check.status}>{check.status}</b></div>)}</div></article>
   <aside className="audit-side"><article className="panel"><span className="eyebrow muted">CONTENT COVERAGE</span><h2>Potential service gaps</h2><p className="side-intro">These starter opportunities should be verified against competitor pages.</p><div className="gap"><FileSearch/><div><b>Medical office cleaning</b><small>Competitor page detected</small></div></div><div className="gap"><FileSearch/><div><b>Post construction cleaning</b><small>Competitor page detected</small></div></div></article><article className="panel audit-recommend"><span><ShieldCheck/></span><small>TOP RECOMMENDATION</small><h2>Repair broken links first</h2><p>Broken destinations interrupt visitors and waste crawl activity. Confirm each reported URL before updating or redirecting it.</p></article></aside></section></>:<article className="panel audit-empty"><Globe2/><h2>Run your first website audit</h2><p>Enter a website above to generate the initial technical and content review.</p></article>}
 </>
}
