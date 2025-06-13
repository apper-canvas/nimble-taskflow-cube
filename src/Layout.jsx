import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout