import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import { Models } from "appwrite"

type SearchResultsProps = {
    searchedPosts: Models.Document[]
    isSearchFetching: boolean
}

const SearchResults = ({ searchedPosts, isSearchFetching }: SearchResultsProps) => {

    if(isSearchFetching) return <Loader />
    //@ts-ignore
    if(searchedPosts && searchedPosts.documents.length > 0) {
        //@ts-ignore
        return <GridPostList posts={searchedPosts.documents}/>
    }

    return (
        <p className="text-light-4 mt-10 text-center w-full">No result found</p>
    )
}

export default SearchResults