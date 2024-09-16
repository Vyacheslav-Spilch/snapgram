import PostStats from "@/components/shared/PostStats"
import { useUserContext } from "@/context/AuthContext"
import { multiFormatDateString } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"

type PostCardProps = {
    post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext()
    
    if(!post.creator) return;

    

    return (
        <div className="post-card">
            <div className="flex-between md:w-full">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img 
                            src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} 
                            alt="creator" 
                            className="h-11 w-11 rounded-full md:rounded-full object-cover object-center"
                        />
                    </Link>

                    <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                            {post.creator.name}
                        </p>
                        <div className="flex-start flex-wrap gap-2 text-light-3">
                            <p className="subtle-semibold lg:small-regular">
                                {multiFormatDateString(post.$createdAt)}
                            </p>
                            {!!post.location && `${'•'}`}
                            <p className="subtle-semibold lg:small-regular">
                                {post.location.length <= 20 
                                    ? post.location 
                                    : post.location.split('').slice(0, 20)
                                }
                            </p>
                        </div>
                    </div>
                </div>

                <Link 
                    to={`/update-post/${post.$id}`}
                    className={`${user.id !== post.creator.$id && "hidden"}`}
                >
                    <img 
                        src="/assets/icons/edit.svg" 
                        alt="edit"
                        width={20}
                        height={20} 
                    />
                </Link>
            </div>

            <Link to={`/posts/${post.$id}`}>
                <div className="small-medium lg:base-medium py-5">
                    <p>{post.caption}</p>
                    <ul className="flex flex-wrap gap-1 mt-2">
                        {!!post.tags.join('') && post.tags.map((tag: string, index: number) => (
                            <li key={`${tag}${index}`} className="text-light-3 small-regular">
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
                <img 
                    src={post.imageUrl || '/assets/icons/profile^placeholder.svg'}
                    alt="post image" 
                    className="post-card_img"
                />
            </Link>

            <PostStats post={post} userId={user.id}/>
        </div>
    )
}

export default PostCard