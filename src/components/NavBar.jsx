import React, { useContext } from 'react'
import { Search , ChevronLeft } from 'lucide-react'
import def from '../assets/def.svg'
import { Link } from 'react-router-dom'
import { AppContext } from '../AppProvider'
function NavBar({serach,link,searchBy}) {
    const {SearchFn} = useContext(AppContext);
    const adminData = JSON.parse(window.localStorage.getItem('admin'))
  return (
    <div className='w-full px-6  flex  justify-between pt-6 bg-bg'>
        {link && <Link to={`/${link}`} className=' cursor-pointer rounded-[50%] flex items-center justify-center '>
        <ChevronLeft color='#C50808' size={45} />
        </Link>}
        {serach && <div className=' border-2 my-2 h-fit border-main px-4 py-1 mx-4  '>
            <form className='flex gap-3 items-center'>
                <input onChange={(e) => {SearchFn(searchBy , e.target.value)}} type='text' className='appearance-none w-96 bg-bg py-2 focus:outline-none ' placeholder='search for product or testeur' />
                <Search color='#C50808' />
            </form>
        </div>}
        <div >
            <div className=' flex px-6 gap-4 items-center'>
                <img className='rounded-full w-16' src={adminData.avatar == 'NULL' ? def : adminData.avatar} alt='...' />
                <p> {adminData.fullname} </p>
            </div>
        </div>

    </div>
  )
}

export default NavBar