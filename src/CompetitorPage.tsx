import { useMemo, useState } from 'react'
import { Building2, Edit3, Plus, Search, Star, Trash2, Users, X } from 'lucide-react'
import './competitors.css'
import './api-state.css'
import { ApiState, useApiCollection } from './useApiCollection'

export type Competitor={id:string;name:string;website:string;category:string;location:string;rating:number;reviews:number}
const samples:Competitor[]=[
 {id:'1',name:'Bright Local Co.',website:'https://example.com',category:'Cleaning services',location:'Fredericksburg, VA',rating:4.8,reviews:175},
 {id:'2',name:'ServicePro Group',website:'https://example.com',category:'Cleaning services',location:'Fredericksburg, VA',rating:4.5,reviews:120},
 {id:'3',name:'Neighbourly Works',website:'https://example.com',category:'Cleaning services',location:'Stafford, VA',rating:4.6,reviews:67}
]
const blank={name:'',website:'',category:'',location:'',rating:0,reviews:0}

export default function CompetitorPage(){
 const {items,connected,save,remove:removeApi}=useApiCollection<Competitor>('competitors','localsignal-competitors',samples,x=>x)
 const [query,setQuery]=useState(''),[open,setOpen]=useState(false),[editing,setEditing]=useState<string|null>(null),[form,setForm]=useState(blank)
 const filtered=useMemo(()=>items.filter(x=>[x.name,x.category,x.location].join(' ').toLowerCase().includes(query.toLowerCase())),[items,query])
 const average=items.length?(items.reduce((n,x)=>n+x.rating,0)/items.length).toFixed(1):'0.0'
 const total=items.reduce((n,x)=>n+x.reviews,0)
 const startAdd=()=>{setEditing(null);setForm(blank);setOpen(true)}
 const startEdit=(item:Competitor)=>{setEditing(item.id);setForm({...item});setOpen(true)}
 const submit=async(e:React.FormEvent)=>{e.preventDefault();await save(form,editing||undefined);setOpen(false)}
 const remove=(item:Competitor)=>{if(window.confirm(`Remove ${item.name} from monitoring?`))removeApi(item.id)}
 return <>
  <header><div><h1>Competitor intelligence</h1><p>Add and compare the local businesses competing for your customers.<ApiState connected={connected}/></p></div><button className="primary page-button" onClick={startAdd}><Plus size={16}/>Add competitor</button></header>
  <section className="competitor-stats"><article><span><Users/></span><div><small>Competitors monitored</small><b>{items.length}</b></div></article><article><span><Star/></span><div><small>Average competitor rating</small><b>{average}</b></div></article><article><span><Building2/></span><div><small>Combined competitor reviews</small><b>{total.toLocaleString()}</b></div></article></section>
  <article className="panel competitor-panel"><div className="competitor-toolbar"><div><h2>Monitored competitors</h2><p>Keep these records current for more useful comparisons.</p></div><label><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search competitors"/></label></div>
   {filtered.length?<div className="competitor-table-wrap"><table className="competitor-table"><thead><tr><th>Business</th><th>Category</th><th>Location</th><th>Rating</th><th>Reviews</th><th>Actions</th></tr></thead><tbody>{filtered.map(item=><tr key={item.id}><td><span className="company"><Building2 size={15}/></span><div><b>{item.name}</b><a href={item.website} target="_blank" rel="noreferrer">{item.website.replace(/^https?:\/\//,'')}</a></div></td><td>{item.category||'Not specified'}</td><td>{item.location||'Not specified'}</td><td><span className="rating"><Star size={13} fill="currentColor"/>{item.rating.toFixed(1)}</span></td><td><b>{item.reviews.toLocaleString()}</b></td><td><div className="row-actions"><button aria-label={`Edit ${item.name}`} onClick={()=>startEdit(item)}><Edit3/></button><button className="delete" aria-label={`Delete ${item.name}`} onClick={()=>remove(item)}><Trash2/></button></div></td></tr>)}</tbody></table></div>:<div className="competitor-empty"><Search/><h2>No matching competitors</h2><p>Try another search or add a new competitor.</p></div>}
  </article>
  {open&&<div className="modal-backdrop"><form className="modal competitor-form" onSubmit={submit}><div className="modal-top"><div><h2>{editing?'Edit competitor':'Add a competitor'}</h2><p>Enter the information currently available to you.</p></div><button type="button" onClick={()=>setOpen(false)}><X size={17}/></button></div><div className="form-grid"><label className="wide">Business name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Competitor business name"/></label><label className="wide">Website<input type="url" required value={form.website} onChange={e=>setForm({...form,website:e.target.value})} placeholder="https://competitor.com"/></label><label>Category<input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Cleaning services"/></label><label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="City, State"/></label><label>Google rating<input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})}/></label><label>Review count<input type="number" min="0" step="1" value={form.reviews} onChange={e=>setForm({...form,reviews:Number(e.target.value)})}/></label></div><div className="modal-actions"><button type="button" onClick={()=>setOpen(false)}>Cancel</button><button className="primary" type="submit">{editing?'Save changes':'Add competitor'}</button></div></form></div>}
 </>
}
