import { useLocation } from 'wouter'
import { Button } from '../../components/button'
import { Input } from '../../components/input'
import { useRegister } from '../hooks/use-register'
import { useEffect, useState } from 'react'
import { signIn, signUp } from '../../services/auth'
import { createEmployee } from '../../services/users'
import { BiShowAlt, BiHide } from 'react-icons/bi'
import { Spinner } from 'flowbite-react'

export function RegisterForm() {
  const [, navigate] = useLocation()
  const { error, errorMessage, loading, setError, setErrorMessage, setLoading } = useRegister()

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (error == null) {
      return
    }

    if (error === 'user_already_exists') {
      setErrorMessage('El correo electrónico ya está registrado.')
    } else if (error === 'weak_password') {
      setErrorMessage('La contraseña es muy débil.')
    } else {
      setErrorMessage('Ocurrió un error inesperado, intenta de nuevo más tarde.')
    }

    const timeout = setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [error])

  const handleSubmit = async (e) => {
    setLoading(true)
    setError(null)
    setErrorMessage(null)
    e.preventDefault()
    const form = new FormData(e.target)
    const email = form.get('user-email')
    const password = form.get('user-password')
    const name = form.get('user-name')
    const lastname = form.get('user-lastname')
    const { data, error } = await signUp(email, password)

    if (error) {
      setError(error.code)
      setLoading(false)
      return
    }
    const newEmployee = { user_id: data.user.id, name, last_name: lastname, email, role_id: 3 }
    const { error: insertError } = await createEmployee(newEmployee)

    if (insertError) {
      setError(error.code)
      setLoading(false)
      return
    }
    const { error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(error.code)
      setLoading(false)
      return
    }

    navigate('/home')
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg bg-white p-6 shadow-md transition-all dark:bg-[#191c25] dark:shadow-lg'
    >
      <div className='grid grid-cols-2 gap-x-4'>
        <label className='flex flex-col gap-2'>
          <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>Nombres</span>
          <Input
            required
            placeholder='John'
            name='user-name'
            type='text'
            className='dark:bg-[#1f1f2e] dark:text-gray-200'
          />
        </label>
        <label className='flex flex-col gap-2'>
          <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>Apellidos</span>
          <Input
            required
            placeholder='Doe'
            name='user-lastname'
            type='text'
            className='dark:bg-[#1f1f2e] dark:text-gray-200'
          />
        </label>
      </div>
      <label className='mt-4 flex flex-col gap-2'>
        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
          Correo electrónico
        </span>
        <Input
          required
          placeholder='micorreo@correo.com'
          name='user-email'
          type='email'
          className='dark:bg-[#1f1f2e] dark:text-gray-200'
        />
      </label>
      <label className='mt-4 flex flex-col gap-2'>
        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>Contraseña</span>
        <div className='relative'>
          <Input
            required
            placeholder='********'
            name='user-password'
            type={showPassword ? 'text' : 'password'}
            className='dark:bg-[#1f1f2e] dark:text-gray-200'
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute inset-y-0 right-0 px-3 text-sm text-purple-500 dark:text-purple-300'
          >
            {showPassword ? (
              <BiShowAlt
                size={22}
                color='grey'
              />
            ) : (
              <BiHide
                size={22}
                color='grey'
              />
            )}
          </button>
        </div>
      </label>
      {errorMessage && (
        <p className='mt-2 text-sm text-red-500 dark:text-red-400'>{errorMessage}</p>
      )}
      <Button
        disabled={loading}
        type='submit'
        className='mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-purple-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-60 dark:bg-blue-900 dark:hover:bg-purple-700'
      >
        {loading && <Spinner />} <span>Crear cuenta</span>
      </Button>
    </form>
  )
}
