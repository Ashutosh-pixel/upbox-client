const Navbar = () => {
    return (
        <div className="navbar items-center h-14 flex w-full bg-white">
            <div className="searchbar border-2 items-center rounded-md flex">
                <input type="search" className="focus:outline-none m-1 ml-3 mr-3" placeholder="Search..."></input>
                <span className="m-1 ml-3 mr-3"> <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="24" viewBox="0 0 24 24">
                <circle cx="11.7669" cy="11.7666" r="8.98856" stroke="currentColor" strokeWidth="1.5"  strokeLinecap="round" />
                <path d="M18.0186 18.4851L21.5426 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
                </span>
            </div>
        </div>
    )
}

export default Navbar;