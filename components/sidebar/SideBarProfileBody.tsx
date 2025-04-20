import Image from "next/image";
import profile from "../../public/assets/profile.png"

const sideBarProfileBody = () => {
    return (
        <div className="sidebar-profile-card mt-5">
            <div className="sidebar-profile-body">
                <div className="flex justify-center flex-col items-center">
                    <div className="rounded-md border p-2 border-indigo-600 mb-3">
                        <Image src={profile} alt="profile" loading="lazy" className="w-16 h-auto rounded"></Image>
                    </div>
                    <div className="sidebar-profile-detail">
                        <h6 className="sidebar-profile-name">Elon Musk</h6>
                        <span className="sidebar-profile-username">@musk</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default sideBarProfileBody;