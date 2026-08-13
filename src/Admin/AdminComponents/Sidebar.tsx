import { Icon } from "@iconify/react/dist/iconify.js"
import LogoSidebar from "../../Components/UI/LogoSidebar"
import menuItems from '../../Data/AdminNavs.json'
const Sidebar = ({ activeComponent, setIsActiveComponent }: {activeComponent:string, setIsActiveComponent:(name:string)=>void}) => {

    const logOut = async () => {
        try {
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/adminlogout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (e) {
            console.error('Admin logout error:', e);
        }
        window.location.reload();
      };
    return (
        <div className="bg-white z-[100] flex min-w-[8rem]  w-[8rem] lg:w-[16rem] shadow-xl  sticky  h-screen top-0  flex-col justify-between text-zinc-900 border-r overflow-y-auto home border-zinc-300 text-lg ">

            <LogoSidebar className='lg:flex-row lg:text-[2.4rem] 4xl:text-[2.5rem] mt-0' />


            <div className=' flex flex-1  justify-start items-center flex-col gap-y-2  p-4'>

                {menuItems.map((item:any) => (
                    <div key={item.id} onClick={() => setIsActiveComponent(item?.name)} className={`lg:px-4 py-3  cursor-pointer flex flex-col lg:flex-row lg:justify-start justify-center gap-y-1 items-center gap-x-2 w-full rounded-2xl text-[1rem] lg:text-[1.1rem] font-semibold aspect-auto 
   ${activeComponent === item.name ? 'text-white bg-gradient-to-r from-primary-500 to-primary-300 shadow-lg' : 'text-black border-transparent'}`}>
                        <Icon icon={item.icon} className={`text-2xl lg:text-3xl 4xl:text-[1.8rem]`} />
                        {item.name}
                    </div>
                ))}
            </div>
            <div className='px-4 w-full mb-4 flex flex-col cursor-pointer gap-y-2 justify-between items-center bg-transparent self-center rounded-[24px]'>
          <a  onClick={logOut} className='py-3 text-center bg-zinc-200 hover:bg-zinc-300 w-full rounded-2xl gap-x-2 text-black flex justify-center items-center flex-col lg:flex-row'>
            <Icon icon="solar:logout-2-bold-duotone" className='text-[1.6rem]' />
            Log Out</a>
        </div>
        </div>
    )
}

export default Sidebar
