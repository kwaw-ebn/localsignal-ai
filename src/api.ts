export const API_URL=(import.meta.env.VITE_API_URL||'http://localhost:8000').replace(/\/$/,'')
export class ApiError extends Error{constructor(public status:number,message:string){super(message)}}
async function request<T>(path:string,options?:RequestInit):Promise<T>{
 const response=await fetch(`${API_URL}${path}`,{...options,headers:{'Content-Type':'application/json',...(options?.headers||{})}})
 if(!response.ok){let message=`Request failed (${response.status})`;try{const body=await response.json();message=body.detail||message}catch{}throw new ApiError(response.status,message)}
 return response.status===204?undefined as T:response.json()
}
export const api={health:()=>request<{status:string}>('/health'),list:<T>(resource:string,businessId?:number)=>request<T[]>(`/api/${resource}${businessId?`?business_id=${businessId}`:''}`),create:<T>(resource:string,data:unknown)=>request<T>(`/api/${resource}`,{method:'POST',body:JSON.stringify(data)}),update:<T>(resource:string,id:string|number,data:unknown)=>request<T>(`/api/${resource}/${id}`,{method:'PUT',body:JSON.stringify(data)}),remove:(resource:string,id:string|number)=>request<void>(`/api/${resource}/${id}`,{method:'DELETE'})}
export const businessId=()=>Number(localStorage.getItem('localsignal-business-id'))||0
