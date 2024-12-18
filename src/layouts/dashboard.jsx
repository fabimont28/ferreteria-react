import { useEffect, useState } from 'react'
import { IoIosHelpCircleOutline, IoIosNotificationsOutline } from 'react-icons/io'
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarRightCollapse } from 'react-icons/tb'
import { useLocation } from 'wouter'
import { CurrentRoute } from '../components/current-route'
import { logout } from '../services/auth'
import { getEmployee } from '../services/users'
import { useSessionStore } from '../store/session'
import { Sidebar } from './components/sidebar'
import { UserDropdown } from './components/user-dropdown'
import { Spinner } from 'flowbite-react'

export function DashboardLayout({ children }) {
  const session = useSessionStore((state) => state.session)
  const employee = useSessionStore((state) => state.employee)
  const setEmployee = useSessionStore((state) => state.setEmployee)
  const [loadingApp, setLoadingApp] = useState(true)
  const [location, navigate] = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (session == null) {
      return
    }

    getEmployee(session.user.id)
      .then(({ data }) => {
        const [employee] = data
        setEmployee(employee)
        if (employee == null) {
          logout().finally(() => {
            navigate('/login')
            setLoadingApp(false)
          })
          return
        }

        if (employee.verified) {
          setLoadingApp(false)
          return
        }

        logout().finally(() => {
          navigate('/login?not_verified')
          setLoadingApp(false)
        })
      })
      .catch(() => {
        logout().finally(() => {
          navigate('/login')
          setLoadingApp(false)
        })
      })
  }, [session])

  if (loadingApp) {
    return (
      <div className='grid min-h-screen w-full place-content-center'>
        <div className='flex flex-col items-center gap-4'>
          <Spinner className='size-12 text-purple-500' />
          <p className='text-lg font-semibold'>Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-[100dvh] w-full flex-col dark:bg-neutral-900 dark:text-white'>
      <header className='sticky top-0 z-10 flex w-full items-center border bg-white dark:bg-neutral-900'>
        <div className={`${collapsed ? 'w-[80px]' : 'w-[260px]'} border-r px-4 pb-6 pt-4`}>
          <div className={`flex ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div>
                <h1 className='text-lg font-semibold'>Ferreteria</h1>
                <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                  Facturación e inventario.
                </p>
              </div>
            )}
            <div>
              <button onClick={() => setCollapsed((prev) => !prev)}>
                {collapsed ? (
                  <TbLayoutSidebarRightCollapse
                    strokeWidth={1.5}
                    className='h-8 w-7 text-neutral-600 dark:text-neutral-400'
                  />
                ) : (
                  <TbLayoutSidebarLeftCollapse
                    strokeWidth={1.5}
                    className='h-8 w-7 text-neutral-600 dark:text-neutral-400'
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className='flex flex-1 justify-between'>
          <div className='ml-12 flex items-center gap-1 place-self-center'>
            <CurrentRoute pathToMatch={location} />
          </div>
          <div className='mr-12 flex items-center gap-4'>
            <button>
              <IoIosNotificationsOutline className='size-6 text-neutral-700 dark:text-neutral-400' />
            </button>
            <button>
              <IoIosHelpCircleOutline className='size-6 text-neutral-700 dark:text-neutral-400' />
            </button>
            {session && employee && (
              <UserDropdown
                employee={employee}
                session={session}
              />
            )}
          </div>
        </div>
      </header>
      <div className='flex h-full flex-grow'>
        <Sidebar
          employee={employee}
          collapsed={collapsed}
        />
        <div className='scroll-bar flex-1 overflow-y-auto bg-[#f7f9fb] dark:bg-[#000]'>
          <div className='px-12 pt-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}
