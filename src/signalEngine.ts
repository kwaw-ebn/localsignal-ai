export type Priority='High'|'Medium'|'Opportunity'
export type ActionStatus='To do'|'In progress'|'Completed'
export type SignalAction={id:string;type:string;priority:Priority;title:string;evidence:string;recommendation:string;impact:string;status:ActionStatus}

const read=<T>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}}
export function generateActions(previous:Record<string,ActionStatus>={}):SignalAction[]{
 const competitors=read<any[]>('localsignal-competitors',[]),keywords=read<any[]>('localsignal-keywords',[]),reviews=read<any[]>('localsignal-reviews',[]),audit=read<any>('localsignal-audit',null)
 const actions:Omit<SignalAction,'status'>[]=[]
 const competitorReviews=competitors.length?Math.round(competitors.reduce((n,x)=>n+(Number(x.reviews)||0),0)/competitors.length):0
 if(competitorReviews>86)actions.push({id:'review-gap',type:'REVIEW_GAP',priority:'High',title:'Close the competitor review gap',evidence:`Monitored competitors average ${competitorReviews} reviews compared with the starter business baseline of 86.`,recommendation:'Create a repeatable process to request reviews from recent satisfied customers.',impact:'Stronger trust and local prominence'})
 const nearPageOne=keywords.filter(x=>x.position>=11&&x.position<=20)
 if(nearPageOne.length)actions.push({id:'ranking-opportunity',type:'RANKING_OPPORTUNITY',priority:'High',title:'Improve near page one keywords',evidence:`${nearPageOne.length} tracked keyword${nearPageOne.length>1?'s':''} currently rank between positions 11 and 20.`,recommendation:`Prioritize the page targeting “${nearPageOne[0].keyword}” with clearer local content and internal links.`,impact:'Potential top 10 visibility gain'})
 const falling=keywords.filter(x=>x.position>x.previous)
 if(falling.length)actions.push({id:'ranking-drop',type:'RANKING_DROP',priority:'Medium',title:'Investigate ranking declines',evidence:`${falling.length} keyword${falling.length>1?'s have':' has'} moved down since the previous update.`,recommendation:'Review the affected pages, recent competitor changes and technical issues.',impact:'Protect existing search visibility'})
 const negative=reviews.filter(x=>x.sentiment==='Negative'||Number(x.rating)<=2)
 if(negative.length)actions.push({id:'reputation-risk',type:'REPUTATION_RISK',priority:'High',title:'Address negative review themes',evidence:`${negative.length} analyzed review${negative.length>1?'s are':' is'} negative or rated two stars and below.`,recommendation:'Respond professionally and correct the recurring service issue before requesting more reviews.',impact:'Improved customer confidence'})
 const communication=reviews.filter(x=>x.theme==='Communication').length
 if(communication)actions.push({id:'communication-theme',type:'REVIEW_THEME',priority:'Medium',title:'Strengthen customer communication',evidence:`Communication appears in ${communication} analyzed review${communication>1?'s':''}.`,recommendation:'Set response time expectations and use a simple follow up checklist.',impact:'Better service experience'})
 const failures=audit?.checks?.filter((x:any)=>x.status==='fail')||[]
 if(failures.length)actions.push({id:'website-failures',type:'WEBSITE_ISSUE',priority:'High',title:'Fix critical website issues',evidence:`The latest audit contains ${failures.length} failed check${failures.length>1?'s':''}: ${failures.map((x:any)=>x.name).join(', ')}.`,recommendation:failures[0].action,impact:'Better usability and crawl health'})
 if(audit?.checks?.some((x:any)=>x.name==='Structured data'&&x.status!=='pass'))actions.push({id:'schema',type:'SCHEMA_OPPORTUNITY',priority:'Opportunity',title:'Add LocalBusiness structured data',evidence:'The latest audit did not confirm LocalBusiness schema.',recommendation:'Add valid schema using business details consistent with the website and Google Business Profile.',impact:'Clearer business information for search engines'})
 if(!actions.length)actions.push({id:'collect-data',type:'DATA_REQUIRED',priority:'Opportunity',title:'Complete your first market analysis',evidence:'There is not enough saved evidence to calculate focused priorities.',recommendation:'Add competitors and keywords, then enter reviews or run a website audit.',impact:'Unlock personalized recommendations'})
 return actions.map(x=>({...x,status:previous[x.id]||'To do'}))
}
