import { Button } from "@/components/ui/button"
import { sidebarLinks } from "@/constans"
import { useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation"
import { INavLink } from "@/types"
import { useEffect } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"

const LeftSideBar = () => {
    const { mutate: signOut, isSuccess} = useSignOutAccount()
    const navigate = useNavigate()
    const { user } = useUserContext()
    const { pathname } = useLocation()


    useEffect(() => {
        if(isSuccess) navigate(0)
    }, [isSuccess])

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
            <Link to="/" className="flex gap-3 items-center">
            <img 
                src="/assets/images/logo.svg" 
                alt="logo"
                width={170}
                height={36}            
            />
            </Link>

            <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                <img 
                    src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
                    alt="profile"
                    className="h-12 w-12 rounded-full" 
                />
                <div className="flex flex-col">
                    <p className="body-bold">
                        {user.name}
                    </p>
                    <p className="small-regular text-light-3">
                        @{user.username}
                    </p>
                </div>
            </Link>

            <ul className="flex flex-col gap-6">
                {sidebarLinks.map((link: INavLink, index) => {
                    const isActive = link.route === pathname
                    return (
                        <li key={index} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                            <NavLink 
                                to={link.route}
                                className="flex gap-4 items-center p-4"
                            >
                                <img 
                                    src={link.imgURL}
                                    alt={link.label}
                                    className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                                />
                                {link.label}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>

            <Button 
                variant="ghost" 
                className="shad-button_ghost"
                onClick={() => signOut()}>
                <img 
                    src="/assets/icons/logout.svg" 
                    alt="logout"
                />
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
            </div>
        </nav>
    )
}

export default LeftSideBar 