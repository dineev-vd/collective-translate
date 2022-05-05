import "./SearchResults.css"
import { GetProjectDto } from "@common/dto/project.dto";
import { useEffect, useState } from "react";
import { api } from "api/Api";
import ProjectSmall from "../components/project/ProjectSmall";
import { useSearchParams } from "react-router-dom";

const SearchResults: React.FC = () => {
    const [results, setResults] = useState<GetProjectDto[]>([]);
    const [params, _] = useSearchParams();
    const query = params.get("query");

    useEffect(() => {
        console.log(query)

        if(query == null || !!!query?.trim()) {
            return;
        }
        
        api.getProjectsByQuery(query.toString())
        .then(([projectsResponse, _]) => {
            setResults(projectsResponse);
        })
        .catch(error => console.log(error));
    }, [query])

    return (
        <div className="search-results">
            {results.map(e =>
                <ProjectSmall key={e.id} project={e} />
            )}
        </div>
    )
}


export default SearchResults;