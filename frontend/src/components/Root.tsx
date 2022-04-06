import Header from './Header';
import "./Root.css";
import SearchResults from './SearchResults';


const Root = () => {
    return (
        <div className="root">
            <Header />
            <SearchResults />
        </div>
    )
}

export default Root