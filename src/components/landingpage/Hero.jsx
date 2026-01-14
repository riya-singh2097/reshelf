import {ArrowRight} from 'lucide-react'
import BackgroundImg from '../../assets/booksbg.jpg'
import {Link} from "react-router-dom"

const Hero = (
    {onLoginClick}
) => {
  return (
    <section className="relative w-full h-[350px] flex items-center lg:justify-start justify-center mx-auto mt-8">
       <div className="absolute w-11/12 inset-0  bg-cover rounded-xl shadow-xl bg-no-repeat mx-auto " style={{backgroundImage : `url(${BackgroundImg})`}}></div>
       <div className="absolute w-11/12 inset-0 bg-black/10 rounded-2xl mx-auto "></div>
       <div className='relative z-10 flex flex-col items-center text-center text-white p-8 lg:left-20  '>
           <h1 className='text-5xl font-bold lg:text-neutral-900 md:text-white'>Share, Grab, Reshelf</h1>
           <p className=' font-mono mt-4'>Share and discover second hand books</p>
           <div className="flex gap-2 mt-10">
            <Link to="/login" className="btn btn-primary hover:bg-accent hover:text-white px-10  md:hidden" >Login</Link>
           <Link to="/register" className="btn btn-primary  px-10 md:hidden">Register</Link>
           </div>

       </div>


<div className="
    absolute left-1/2 top-3/4 transform -translate-x-1/2 translate-y-10
    flex flex-col md:flex-row justify-around items-center
    w-3/4 lg:w-4/5
    lg:gap-6
    bg-neutral-300 p-4
    rounded md:rounded-full
    z-10 shadow-lg
    max-md:hidden
    text-neutral-900
">
    <div >
        <h2 className="font-bold">Search</h2>
        <p>What book are you looking for?</p>
    </div>

    <span className="divider md:divider-horizontal"></span>

    <div>
        <h2 className="font-bold">Browse</h2>
        <p>Explore listings</p>
    </div>

    <span className="divider md:divider-horizontal"></span>

    <div>
        <h2 className="font-bold">Profile</h2>
        <p>View user profiles</p>
    </div>

    <span className="divider md:divider-horizontal"></span>

    <Link to="/login" className="btn btn-primary hover:bg-accent hover:text-white" >
        <ArrowRight />
    </Link>
</div>

       </section>
  )
}

export default Hero