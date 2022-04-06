import "./SearchResults.css"
import { GetProjectDto } from "@common/dto/get-project.dto";
import { useEffect } from "react";

const SearchResults = (query?: string) => {
    const results: GetProjectDto[] = [];

    useEffect(() => {
        fetch(window.location + "/api")
    }, [query])

    return (
        <div>
            {results.map(e =>
                <div>{e.name}</div>
            )}
        </div>
    )
}


export default SearchResults;