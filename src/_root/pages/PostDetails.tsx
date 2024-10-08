import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import PostStats from "@/components/shared/PostStats"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext"
import { useDeletePost, useGetPostById, useGetUserPosts } from "@/lib/react-query/queriesAndMutation"
import { multiFormatDateString } from "@/lib/utils"
import { Link, useNavigate, useParams } from "react-router-dom"

const PostDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: post, isPending} = useGetPostById(id ?? '')
    const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
    const { user } = useUserContext()

    const { mutate: deletePost} = useDeletePost()

    const relatedPosts = userPosts?.documents.filter(
        (userPost) => userPost.$id !== id
    );

    const handleDeletePost = () => {
        deletePost({ postId: id || '', imageId: post?.imageId });
        navigate(-1);
    }

    console.log(user.id, post?.creator.$id);
    

    return (
    <div className="post_details-container">
        <div className="hidden md:flex max-w-5xl w-full">
            <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="shad-button_ghost">
            <img
                src={"/assets/icons/back.svg"}
                alt="back"
                width={24}
                height={24}
            />
            <p className="small-medium lg:base-medium">Back</p>
            </Button>
        </div>

        {isPending || !post ? (
            <Loader />
        ) : (
            <div className="post_details-card">
            <img
                src={post?.imageUrl}
                alt="creator"
                className="post_details-img h-full"
            />

        <div className="post_details-info">
            <div className="flex flex-between items-start w-full h-full">
                <Link
                    to={`/profile/${post?.creator.$id}`}
                    className="flex items-start gap-4">
                    <img
                        src={
                            post?.creator.imageUrl ||
                            "/assets/icons/profile-placeholder.svg"
                        }
                        alt="creator"
                        // className="w-8 h-8 rounded-full lg:w-12 lg:h-12"
                        className="h-10 w-10 rounded-full lg:w-12 lg:h-12 md:rounded-full object-cover object-center"
                    />
                    <div className="flex gap-3 flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                            {post?.creator.name}
                        </p>
                        <div className="flex-center gap-2 text-light-3">
                            <p className="subtle-semibold lg:small-regular ">
                                {multiFormatDateString(post?.$createdAt)}
                            </p>
                            <p>{!!post.location && `${' • '}`}</p>
                            <p className="subtle-semibold lg:small-regular">
                                {
                                    post.location.length <= 20 
                                    ? post.location 
                                    : post.location.split('').slice(0, 20)
                                }
                            </p>
                        </div>
                    </div>
                </Link>

                <div className="flex items-start gap-3 ml-3 h-full">
                    <Link
                        to={`/update-post/${post?.$id}`}
                        className={`${user.id !== post?.creator.$id && "hidden"} w-6 h-6`}>
                    <img
                        src={"/assets/icons/edit.svg"}
                        alt="edit"
                    />
                    </Link>

                    <Button
                        onClick={handleDeletePost}
                        variant="ghost"
                        className={`${user.id !== post?.creator.$id ? "hidden" : 'post_details-delete_btn'} w-6 h-6`}>
                    <img
                        src={"/assets/icons/delete.svg"}
                        alt="delete"
                        width={24}
                        height={24}
                    />
                    </Button>
                </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
                <p>{post?.caption}</p>
                <ul className="flex flex-wrap gap-1 mt-2">
                    {!!post.tags.join('') && post?.tags.map((tag: string, index: string) => (
                    <li
                        key={`${tag}${index}`}
                        className="text-light-3 small-regular">
                        #{tag}
                    </li>
                    ))}
                </ul>
            </div>

                <div className="w-full">
                    <PostStats post={post} userId={user.id} />
                </div>
            </div>
        </div>
        )}

        <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

            <h3 className="body-bold md:h3-bold w-full my-10">
            More Related Posts
            </h3>
            {isUserPostLoading || !relatedPosts ? (
            <Loader />
            ) : (
            <GridPostList posts={relatedPosts} />
            )}
        </div>
    </div>
    )
}

export default PostDetails