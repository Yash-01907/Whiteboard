import Login from './Login'
const AuthLayout = () => {
  return (
    <div className='flex justify-center items-center h-screen bg-gray-950'>
        <div className='w-full max-w-md'>
            <Login />
        </div>
    </div>
  )
}

export default AuthLayout