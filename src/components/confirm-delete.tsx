"use client";
import { Trash2 } from "lucide-react";
export function ConfirmDelete({action,id,label}:{action:(data:FormData)=>void;id:string;label:string}){return <form action={action} onSubmit={e=>{if(!window.confirm(`Delete “${label}”? This cannot be undone.`))e.preventDefault()}}><input type="hidden" name="id" value={id}/><button aria-label={`Delete ${label}`} className="focus-ring grid size-9 place-items-center rounded-lg text-zinc-600 hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={15}/></button></form>}
