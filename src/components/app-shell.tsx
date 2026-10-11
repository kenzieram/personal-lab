import { Sidebar } from "@/components/sidebar";
export function AppShell({children}:{children:React.ReactNode}) { return <div className="min-h-screen"><Sidebar/><main className="min-h-screen md:pl-[248px]"><div className="mx-auto max-w-[1320px] px-5 pb-12 pt-7 sm:px-7 md:pt-10 lg:px-10">{children}</div></main></div> }
