import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Edit3, MapPin, Minus, Plus, Search, Target, Trash2, TrendingUp, X } from 'lucide-react'
import './visibility.css'
import './api-state.css'
import { ApiState, useApiCollection } from './useApiCollection'

type Keyword={id:string;keyword:string;location:string;position:number;previous:number;volume:number}
const samples:Keyword[]=[
 {id:'k1',keyword:'commercial cleaning Fredericksburg',location:'Fredericksburg, VA',position:8,previous:11,volume:140},
 {id:'k2',keyword:'office cleaning near me',location:'Fredericksburg, VA',position:12,previous:10,volume:210},
 {id:'k3',keyword:'janitorial company Fredericksburg',location:'Fredericksburg, VA',position:5,previous:5,volume:90},
 {id:'k4',keyword:'professional cleaners Stafford VA',location:'Stafford, VA',position:18,previous:23,volume:70}
]
const blank={keyword:'',location:'',position:0,previous:0,volume:0}

export default function VisibilityPage(){
 const {items,connected,save,remove}=useApiCollection<Keyword>('keywords','localsignal-keywords',samples,x=>x)
 const saveItems=(next:Keyword[])=>{const deleted=items.find(x=>!next.some(n=>n.id===x.id));if(deleted)remove(deleted.id)}
 const [query,setQuery]=useState(''),[open,setOpen]=useState(false),[editing,setEditing]=useState<string|null>(null),[form,setForm]=useState(blank)
 const filtered=useMemo(()=>items.filter(x=>(x.keyword+' '+x.location).toLowerCase().includes(query.toLowerCase())),[items,query])
 const ranked=items.filter(x=>x.position>0), top10=ranked.filter(x=>x.position<=10).length
 const average=ranked.length?Math.round(ranked.reduce((n,x)=>n+x.position,0)/ranked.length):0
 const improved=items.filter(x=>x.previous>x.position&&x.position>0).length
 const start=(item?:Keyword)=>{setEditing(item?.id||null);setForm(item?{...item}:blank);setOpen(true)}
 const submit=async(e:React.FormEvent)=>{e.preventDefault();await save(form,editing||undefined);setOpen(false)}
 const movement=(x:Keyword)=>x.position===x.previous?0:x.previous-x.position
 return <>
  <header><div><h1>Local visibility</h1><p>Track where your business appears for valuable searches in each service area.<ApiState connected={connected}/></p></div><button className="primary page-button" onClick={()=>start()}><Plus size={16}/>Add keyword</button></header>
  <section className="visibility-stats"><article><span><Target/></span><div><small>Keywords tracked</small><b>{items.length}</b></div></article><article><span><TrendingUp/></span><div><small>Keywords in top 10</small><b>{top10}</b></div></article><article><span><MapPin/></span><div><small>Average position</small><b>{average||'—'}</b></div></article><article><span><ArrowUp/></span><div><small>Improved keywords</small><b>{improved}</b></div></article></section>
  <article className="panel visibility-panel"><div className="visibility-toolbar"><div><h2>Tracked keywords</h2><p>Positions are manually entered in this MVP and ready for an API connection later.</p></div><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search keywords"/></label></div>
   {filtered.length?<div className="visibility-table-wrap"><table className="visibility-table"><thead><tr><th>Keyword</th><th>Location</th><th>Position</th><th>Movement</th><th>Search volume</th><th>Actions</th></tr></thead><tbody>{filtered.map(item=>{const move=movement(item);return <tr key={item.id}><td><b>{item.keyword}</b></td><td><MapPin size={13}/>{item.location}</td><td><span className={'position '+(item.position<=3?'top3':item.position<=10?'top10':'other')}>{item.position||'—'}</span></td><td><span className={'movement '+(move>0?'up':move<0?'down':'flat')}>{move>0?<ArrowUp/>:move<0?<ArrowDown/>:<Minus/>}{move===0?'No change':Math.abs(move)+' places'}</span></td><td>{item.volume?item.volume.toLocaleString():'—'}</td><td><div className="row-actions"><button onClick={()=>start(item)} aria-label={`Edit ${item.keyword}`}><Edit3/></button><button className="delete" onClick={()=>{if(confirm(`Remove “${item.keyword}”?`))saveItems(items.filter(x=>x.id!==item.id))}} aria-label={`Delete ${item.keyword}`}><Trash2/></button></div></td></tr>})}</tbody></table></div>:<div className="visibility-empty"><Search/><h2>No matching keywords</h2><p>Add a keyword or change your search.</p></div>}
  </article>
  <article className="panel visibility-insight"><span><TrendingUp/></span><div><small>OPPORTUNITY DETECTED</small><h2>{top10} of {items.length} keywords rank in the top 10</h2><p>Focus first on keywords ranking between positions 11 and 20. They are usually the closest opportunities for meaningful visibility gains.</p></div></article>
  {open&&<div className="modal-backdrop"><form className="modal keyword-form" onSubmit={submit}><div className="modal-top"><div><h2>{editing?'Update keyword':'Add a keyword'}</h2><p>Record the latest local search position.</p></div><button type="button" onClick={()=>setOpen(false)}><X size={17}/></button></div><div className="form-grid"><label className="wide">Keyword<input required value={form.keyword} onChange={e=>setForm({...form,keyword:e.target.value})} placeholder="commercial cleaning Fredericksburg"/></label><label className="wide">Search location<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Fredericksburg, VA"/></label><label>Current position<input required type="number" min="1" max="100" value={form.position||''} onChange={e=>setForm({...form,position:Number(e.target.value)})}/></label><label>Previous position<input required type="number" min="1" max="100" value={form.previous||''} onChange={e=>setForm({...form,previous:Number(e.target.value)})}/></label><label className="wide">Monthly search volume<input type="number" min="0" value={form.volume||''} onChange={e=>setForm({...form,volume:Number(e.target.value)})} placeholder="Optional"/></label></div><div className="modal-actions"><button type="button" onClick={()=>setOpen(false)}>Cancel</button><button className="primary" type="submit">{editing?'Save changes':'Add keyword'}</button></div></form></div>}
 </>
}
